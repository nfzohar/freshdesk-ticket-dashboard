<template>
  <div
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
    />
    <div class="block md:hidden overflow-hidden scrollbar-hide min-h-screen w-screen">
      <mobile-layout :key="resizeToken" :all-tickets="allTickets" />
    </div>
    <div class="hidden md:block overflow-hidden scrollbar-hide min-h-screen w-screen">
      <component :key="resizeToken" :is="dashboardLayout" :all-tickets="allTickets" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import { filterParser } from '@/helpers/CommonMethods'
import ToolBar from '@/components/DashboardToolbar.vue'
import MobileLayout from '@/components/layouts/MobileLayout.vue'

export default defineComponent({
  name: 'TheDashboard',

  components: { ToolBar, MobileLayout },

  data() {
    return {
      page: 1,
      tickets: [],
      ticketsTemp: [],
      apiCallUrl: '',
      startYear: '',
      timeoutId: null,
      isLoading: true,
      keepFetching: true,
      hiddenCursor: false,
      refreshIntervalId: null,
      updateToken: 0,
      reloadToken: 0,
      resizeToken: 0
    }
  },

  computed: {
    allTickets(): Object {
      return this.tickets?.flat() ?? []
    },
    dashboardLayout(): Object {
      return this.$configuration?.layoutComponent
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
      if (!this.autoRefresh?.active || this.autoRefresh?.perMinutes <= 0) {
        clearInterval(this.refreshIntervalId)
        return
      }

      let intervalLength = 1000 * 60 * this.autoRefresh?.perMinutes

      this.refreshIntervalId = setInterval(() => {
        this.loadTickets()
      }, intervalLength)
    }
  },

  created() {
    if (!this.$auth.authenticated) {
      this.$router.push('/')
    }
    this.windowResizeListener()
  },

  async mounted() {
    this.startYear = this.statStartYear

    let refresh = this.$configuration.theAutoRefresh.active
    this.$configuration.theAutoRefresh.active = !refresh
    this.$configuration.theAutoRefresh.active = refresh

    await this.loadTickets()
  },

  methods: {
    async loadTickets() {
      this.keepFetching = true
      this.apiCallUrl = `tickets?updated_since=${this.startYear}&include=requester,stats&per_page=100`

      if (this.anyFiltersSet) {
        this.apiCallUrl = filterParser(this.apiCallUrl, this.storedFilters)
      }

      await this.fetchTicketsByPage()
    },

    async fetchTicketsByPage() {
      this.page = 1
      this.ticketsTemp = []

      try {
        await this.fetchTickets()
        // await this.fetchTicketsDev()
      } catch (error) {
        this.keepFetching = false
        this.stopLoading()
      }
    },

    async fetchTickets() {
      await ApiCall.get(`${this.apiCallUrl}&page=${this.page}`).then((response) => {
        if (response) {
          this.ticketsTemp[this.page] = Object.values(response?.results ?? response)
        }

        if (!this.ticketsTemp[this.page]?.length) {
          this.keepFetching = false

          if (this.ticketsTemp?.length) {
            this.refershTicketsFromTemp()
          } else {
            this.stopLoading()
            this.$toast.clear()
            this.$toast.error('No tickets to display found.')
          }
        }

        if (this.keepFetching) {
          this.page++
          setTimeout(() => {
            this.fetchTickets()
          }, 6000)
        }
      })
    },

    async fetchTicketsDev() {
      await ApiCall.get(`${this.apiCallUrl}&page=${this.page}`).then((response) => {
        if (response) {
          this.ticketsTemp[this.page] = Object.values(response?.results ?? response)
        }

        this.keepFetching = false

        if (this.ticketsTemp?.length) {
          this.refershTicketsFromTemp()
        } else {
          this.stopLoading()
          this.$toast.clear()
          this.$toast.error('No tickets to display found.')
        }
      })
    },

    async refershTicketsFromTemp() {
      this.startLoading()
      if (this.ticketsTemp?.length) {
        this.tickets = this.ticketsTemp
      }

      this.setInformationTicketFields()

      setTimeout(async () => {
        this.ticketsTemp = []
        this.stopLoading()
      }, 3000)
    },

    windowResizeListener() {
      window.addEventListener('resize', () => {
        this.resizeToken++
      })
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
