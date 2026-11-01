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
      tickets: [],
      ticketsTemp: [],
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
    allTickets(): Object {
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
    anyFiltersSet(): Boolean {
      return (
        this.storedFilters?.date_filters?.length > 0 ||
        this.storedFilters?.field_filters?.length > 0
      )
    },
    autoRefresh(): Boolean {
      return this.$configuration.theAutoRefresh
    },
    storedFilters(): Array {
      return {
        field_filters: this.$information?.storedFilters,
        date_filters: this.$information?.storedDateFilters
      }
    },
    statStartYear(): string {
      let year = import.meta.env?.VITE_FRESHDESK_START_YEAR ?? '1970'
      return new Date(year).toISOString()
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

      try {
        await this.fetchTickets(this.fetchRun)
      } catch (error) {
        this.keepFetching = false
        this.stopLoading()
      }
    },

    async fetchTickets(run: number) {
      await ApiCall.get(`${this.apiCallUrl}&page=${this.page}`).then((response) => {
        if (run != this.fetchRun) {
          return
        }

        if (response) {
          this.ticketsTemp[this.page] = Object.values(response?.results ?? response)
        }

        if (this.isLastPage(response)) {
          this.keepFetching = false

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
        }, 6000)
      })
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
