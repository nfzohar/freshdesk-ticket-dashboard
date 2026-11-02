<template>
  <div class="dashboard-body">
    <div
      v-if="ready"
      :key="reloadToken"
      class="flex flex-col transition-colors dashboard-body"
      :class="[
        { 'is-loading': isLoading },
        { 'cursor-loading': keepFetching },
        { 'cursor-none': hiddenCursor }
      ]"
      @mousemove="hideCursor"
    >
      <tool-bar
        :all-tickets="allTickets"
        :is-fetching-tickets="keepFetching"
        :results-truncated="resultsTruncated"
        @startLoading="startLoading"
        @stopLoading="stopLoading"
        @reload="reloadToken++"
        @refresh="loadTickets"
        @openWizard="openWizard(true)"
        @refetch="fetchingFields = true"
        @editLayout="editMode = true"
      />
      <div class="block md:hidden overflow-hidden scrollbar-hide min-h-screen w-screen">
        <mobile-layout :key="resizeToken" :all-tickets="allTickets" />
      </div>
      <div class="hidden md:block flex-1 min-h-0 overflow-hidden scrollbar-hide w-screen">
        <!-- The grid tracks its own width; re-keying it on resize would drop unsaved edits. -->
        <component
          :key="dashboardLayout == 'grid-layout' ? reloadToken : resizeToken"
          :is="dashboardLayout"
          :all-tickets="allTickets"
          v-bind="layoutProps"
        />
      </div>
    </div>

    <dashboard-skeleton v-else />

    <!-- Overlays are teleported to <body>, so the dashboard's .is-loading can't block them. -->
    <login-overlay v-if="!authenticated" />
    <configuration-wizard
      v-else-if="wizardOpen"
      :closable="wizardClosable"
      @close="closeWizard"
      @finished="finishWizard"
    />
    <fetching-overlay v-else-if="fetchingFields" @done="fetchingFields = false" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import { filterParser } from '@/helpers/CommonMethods'
import { presetPanels } from '@/helpers/LayoutGrid'
import ToolBar from '@/components/DashboardToolbar.vue'
import DashboardSkeleton from '@/components/general/DashboardSkeleton.vue'
import MobileLayout from '@/components/layouts/MobileLayout.vue'
import LoginOverlay from '@/components/overlays/LoginOverlay.vue'
import FetchingOverlay from '@/components/overlays/FetchingOverlay.vue'
import ConfigurationWizard from '@/components/overlays/ConfigurationWizard.vue'

// Paced, but no longer the old flat 6s-per-page wait: plenty of accounts have far
// more rate-limit budget than that implies. Only back off hard once the account's
// own remaining-requests count (reported by Freshdesk on every response) runs low.
const FETCH_DELAY = 250
const RATE_LIMIT_SAFETY_BUFFER = 10
const RATE_LIMIT_BACKOFF_DELAY = 5000
// Fallback wait on a 429 with no Retry-After header.
const DEFAULT_RETRY_AFTER_SECONDS = 15

export default defineComponent({
  name: 'TheDashboard',

  components: {
    ToolBar,
    MobileLayout,
    LoginOverlay,
    FetchingOverlay,
    DashboardSkeleton,
    ConfigurationWizard
  },

  data() {
    return {
      page: 1,
      tickets: [] as any[],
      ticketsTemp: [] as any[],
      apiCallUrl: '',
      startYear: '',
      timeoutId: null,
      fetchRun: 0,
      fetchTimeoutId: undefined as ReturnType<typeof setTimeout> | undefined,
      isLoading: true,
      keepFetching: true,
      hiddenCursor: false,
      refreshIntervalId: null,
      updateToken: 0,
      reloadToken: 0,
      resizeToken: 0,
      perPage: 100,
      // Freshdesk's search endpoint ignores per_page: 30 results per page, max 10 pages.
      searchPageSize: 30,
      searchMaxPages: 10,
      resultsTruncated: false,
      // Requests left in Freshdesk's current rate-limit window, from the most
      // recent response's X-RateLimit-Remaining header; null until first known.
      rateLimitRemaining: null as number | null,
      wizardOpen: false,
      editMode: false,
      // Set after the custom wizard path: open edit mode once the dashboard is ready.
      editAfterReady: false,
      wizardClosable: false,
      fetchingFields: false
    }
  },

  computed: {
    authenticated(): boolean {
      return this.$auth?.authenticated
    },
    layoutDefined(): boolean {
      return this.$configuration?.layoutPanels?.length > 0
    },
    // Tickets are only fetched while the dashboard itself is showing. A closable
    // wizard (opened from settings) keeps the dashboard running behind it.
    ready(): boolean {
      return (
        this.authenticated &&
        this.layoutDefined &&
        !this.fetchingFields &&
        !(this.wizardOpen && !this.wizardClosable)
      )
    },
    allTickets(): any {
      return this.tickets?.flat() ?? []
    },
    // Edit mode always uses the grid, also when the carousel is the chosen layout.
    dashboardLayout(): string {
      return this.editMode ? 'grid-layout' : this.$configuration?.layoutComponent
    },
    layoutProps(): Record<string, any> {
      return this.dashboardLayout == 'grid-layout'
        ? { editMode: this.editMode, onExitEdit: () => (this.editMode = false) }
        : {}
    },
    anyFiltersSet(): boolean {
      return (
        this.storedFilters?.date_filters?.length > 0 ||
        this.storedFilters?.field_filters?.length > 0
      )
    },
    autoRefresh(): any {
      return this.$configuration.theAutoRefresh
    },
    storedFilters(): any {
      return {
        field_filters: this.$information?.storedFilters,
        date_filters: this.$information?.storedDateFilters
      }
    },
    statStartYear(): string {
      let year = import.meta.env?.VITE_FRESHDESK_START_YEAR ?? '1970'
      return new Date(year).toISOString()
    },
    // Fetch the next page right away while there's ample rate-limit budget left;
    // only back off once it's running low, so a long pagination run doesn't trip a 429.
    nextFetchDelay(): number {
      if (this.rateLimitRemaining != null && this.rateLimitRemaining <= RATE_LIMIT_SAFETY_BUFFER) {
        return RATE_LIMIT_BACKOFF_DELAY
      }
      return FETCH_DELAY
    }
  },

  watch: {
    'allTickets.length'() {
      this.updateToken++
    },
    'autoRefresh.active'() {
      if (this.ready) {
        this.initiateRefreshInterval()
      }
    },
    authenticated(isAuthenticated: boolean) {
      if (isAuthenticated) {
        // After login, fetch fresh ticket fields; first run the wizard if there is no layout yet.
        this.layoutDefined ? (this.fetchingFields = true) : this.openWizard(false)
      } else {
        this.wizardOpen = false
        this.fetchingFields = false
      }
    },
    ready: {
      immediate: true,
      handler(isReady: boolean) {
        isReady ? this.startDashboard() : this.stopDashboard()

        if (isReady && this.editAfterReady) {
          this.editAfterReady = false
          this.editMode = true
        }
        if (!isReady) {
          this.editMode = false
        }
      }
    }
  },

  created() {
    if (this.authenticated && !this.layoutDefined) {
      this.openWizard(false)
    }
    this.windowResizeListener()
  },

  beforeUnmount() {
    this.stopDashboard()
    clearTimeout(this.timeoutId)
    window.removeEventListener('resize', this.onWindowResize)
  },

  methods: {
    startDashboard() {
      this.startYear = this.statStartYear
      this.startLoading()
      this.loadTickets()
      this.initiateRefreshInterval()
    },

    stopDashboard() {
      // Invalidate any fetch chain still waiting on a response.
      this.fetchRun++
      clearTimeout(this.fetchTimeoutId)
      clearInterval(this.refreshIntervalId)
      this.keepFetching = false
      this.tickets = []
      this.ticketsTemp = []
    },

    openWizard(closable: boolean) {
      this.wizardClosable = closable
      this.wizardOpen = true
    },

    closeWizard() {
      this.wizardOpen = false
      // Layouts read their panels on mount; remount to show wizard changes.
      this.reloadToken++
    },

    finishWizard() {
      // The custom path has no panels yet: start from the preset panels in edit mode.
      if (!this.layoutDefined) {
        this.$configuration.updateLayoutPanels(presetPanels())
        this.editAfterReady = true
      }
      this.wizardOpen = false
      this.fetchingFields = true
    },

    async loadTickets() {
      // Start a new fetch chain; any previous one stops at its next step.
      this.fetchRun++
      clearTimeout(this.fetchTimeoutId)
      this.keepFetching = true
      this.apiCallUrl = `tickets?updated_since=${this.startYear}&include=requester,stats&per_page=${this.perPage}`

      if (this.anyFiltersSet) {
        this.apiCallUrl = filterParser(this.apiCallUrl, this.storedFilters)
      }

      await this.fetchTicketsByPage()
    },

    async fetchTicketsByPage() {
      this.page = 1
      this.ticketsTemp = []
      this.resultsTruncated = false

      try {
        await this.fetchTickets(this.fetchRun)
      } catch (error) {
        this.keepFetching = false
        this.stopLoading()
      }
    },

    async fetchTickets(run: number) {
      let raw

      try {
        raw = await ApiCall.getWithResponse(`${this.apiCallUrl}&page=${this.page}`)
      } catch (error: any) {
        if (run != this.fetchRun) {
          return
        }
        this.handleFetchError(error, run)
        return
      }

      if (run != this.fetchRun) {
        return
      }

      this.trackRateLimit(raw?.headers)
      const response = raw?.data

      if (response) {
        this.ticketsTemp[this.page] = Object.values(response?.results ?? response)
      }

      if (this.isLastPage(response)) {
        this.keepFetching = false
        this.resultsTruncated = this.isTruncatedSearch(response)

        if (this.ticketsTemp.flat().length) {
          this.refershTicketsFromTemp()
        } else {
          this.stopLoading()
          this.$toast.clear()
          this.$toast.error('No tickets to display found.')
        }
        return
      }

      this.page++
      this.fetchTimeoutId = setTimeout(() => {
        this.fetchTickets(run)
      }, this.nextFetchDelay)
    },

    // A 429 waits out exactly what Freshdesk's Retry-After header asks for and
    // resumes the same run; any other failure stops and shows what was fetched so far.
    handleFetchError(error: any, run: number) {
      if (error?.response?.status == 429) {
        // Retry-After often isn't readable cross-origin unless Freshdesk opts it into
        // Access-Control-Expose-Headers; the fallback below covers that case safely.
        const retryAfter = Number(this.readHeader(error.response.headers, 'retry-after'))
        const delaySeconds = retryAfter || DEFAULT_RETRY_AFTER_SECONDS

        this.$toast.info(`Freshdesk API rate limit reached. Resuming in ${delaySeconds}s…`)
        this.fetchTimeoutId = setTimeout(() => this.fetchTickets(run), delaySeconds * 1000)
        return
      }

      this.keepFetching = false
      this.stopLoading()
      this.$toast.clear()
      this.$toast.error(error?.message || 'Data could not be loaded. Please try again.')
    },

    // Freshdesk may or may not list this in Access-Control-Expose-Headers for a
    // cross-origin call; when it doesn't, this silently stays unset and
    // nextFetchDelay just keeps using the fast path — handleFetchError's 429
    // handling (not this proactive check) is the real backstop either way.
    trackRateLimit(headers: any) {
      const remaining = Number(this.readHeader(headers, 'x-ratelimit-remaining'))

      if (!isNaN(remaining)) {
        this.rateLimitRemaining = remaining
      }
    },

    // AxiosHeaders (what a browser response actually carries) only reliably exposes
    // header values through get(), not plain bracket access — this works for either.
    readHeader(headers: any, name: string) {
      return typeof headers?.get == 'function' ? headers.get(name) : headers?.[name]
    },

    isLastPage(response: any) {
      // Failed request: stop and show what was fetched so far.
      if (!response) {
        return true
      }

      if (Array.isArray(response?.results)) {
        return (
          this.page * this.searchPageSize >= (response?.total ?? 0) ||
          this.page >= this.searchMaxPages
        )
      }

      return this.ticketsTemp[this.page]?.length < this.perPage
    },

    // Freshdesk's search endpoint hard-caps at searchMaxPages: if more tickets
    // actually matched, what we show is a partial result.
    isTruncatedSearch(response: any) {
      return (
        Array.isArray(response?.results) &&
        this.page >= this.searchMaxPages &&
        this.page * this.searchPageSize < (response?.total ?? 0)
      )
    },

    initiateRefreshInterval() {
      clearInterval(this.refreshIntervalId)

      if (!this.autoRefresh?.active || this.autoRefresh?.perMinutes <= 0) {
        return
      }

      let intervalLength = 1000 * 60 * this.autoRefresh?.perMinutes

      this.refreshIntervalId = setInterval(() => {
        // Skip while editing: the loading state would block dragging.
        if (!this.editMode) {
          this.loadTickets()
        }
      }, intervalLength)
    },

    async refershTicketsFromTemp() {
      this.startLoading()
      if (this.ticketsTemp?.length) {
        this.tickets = this.ticketsTemp
      }

      this.setInformationTicketFields()

      // ticketsTemp is reset at the start of each fetch run; clearing it here
      // could wipe pages of a run started within these 3 seconds.
      setTimeout(() => {
        this.stopLoading()
      }, 3000)
    },

    windowResizeListener() {
      window.addEventListener('resize', this.onWindowResize)
    },

    onWindowResize() {
      this.resizeToken++
    },

    setInformationTicketFields() {
      this.$information?.saveTicketFields(this.allTickets[1])
    },

    hideCursor() {
      this.hiddenCursor = false
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        this.hiddenCursor = true
      }, 10000)
    },

    startLoading() {
      this.isLoading = true
    },

    stopLoading() {
      this.isLoading = false
    }
  }
})
</script>
