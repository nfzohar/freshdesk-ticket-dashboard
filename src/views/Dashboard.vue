<template>
  <div
    :key="reloadToken"
    class="flex flex-col transition-colors dashboard-body"
    :class="[{ 'is-loading': isLoading }, { 'cursor-none': hiddenCursor }]"
    @mousemove="hideCursor"
  >
    <tool-bar
      :loading="isLoading"
      :all-tickets="allTickets"
      @stopLoading="stopLoading"
      @startLoading="startLoading"
      @refresh="loadTickets"
      @reload="reloadToken++"
    />
    <div class="overflow-hidden scrollbar-hide min-h-screen w-screen">
      <component :key="resizeToken" :is="dashboardLayout" :all-tickets="allTickets" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import ToolBar from '@/components/DashboardToolbar.vue'
import RowsLayout from '@/components/layouts/RowsLayout.vue'
import ColumnsLayout from '@/components/layouts/ColumnsLayout.vue'

export default defineComponent({
  name: 'TheDashboard',

  components: {
    ToolBar,
    RowsLayout,
    ColumnsLayout
  },

  data() {
    return {
      page: 1,
      tickets: [],
      ticketsTemp: [],
      apiCallUrl: '',
      startYear: '',
      timeoutId: null,
      isLoading: false,
      hiddenCursor: false,
      keepFetching: true,
      refreshIntervalId: null,
      updateToken: 0,
      reloadToken: 0,
      resizeToken: 0
    }
  },

  computed: {
    allTickets(): Object {
      return this.tickets?.flat()
    },
    dashboardLayout(): Object {
      return this.$configuration?.layoutComponent
    },
    statStartYear(): string {
      return new Date(import.meta.env?.VITE_FRESHDESK_START_YEAR ?? '1970').toISOString()
    }
  },

  watch: {
    'allTickets.length'() {
      this.updateToken++
    },
    '$configuration.theAutoRefresh.active'() {
      let autorefresh = this.$configuration?.theAutoRefresh

      if (!autorefresh?.active || autorefresh?.perMinutes <= 0) {
        clearInterval(this.refreshIntervalId)
        return
      }

      this.refreshIntervalId = setInterval(
        () => {
          this.loadTickets()
        },
        1000 * 60 * autorefresh?.perMinutes
      )
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
    await this.loadTickets()
  },

  methods: {
    async loadTickets() {
      this.keepFetching = true
      this.startLoading()

      if (!this.apiCallUrl) {
        this.apiCallUrl =
          'tickets?updated_since=' + this.startYear + '&include=requester,stats&per_page=100'
      }

      await this.fetchTicketsByPage()
      this.setInformationTicketFields()
    },

    async fetchTicketsByPage() {
      this.page = 1
      this.ticketsTemp = []

      try {
        await this.fetchTickets()
      } catch (error) {
        this.keepFetching = false
        this.stopLoading()
      }
    },

    async fetchTickets() {
      await ApiCall.get(this.apiCallUrl + '&page=' + this.page).then((response) => {
        if (response) {
          this.ticketsTemp[this.page] = Object.values(response.results ?? response)
        }

        this.refershTicketsFromTemp()
        this.keepFetching = this.isLoading = !true
        return

        // if (!this.ticketsTemp[this.page]?.length) {
        //   this.keepFetching = false

        //   if (this.ticketsTemp?.length) {
        //     this.refershTicketsFromTemp()
        //   } else {
        //     this.$toast.clear()
        //     this.$toast.error('No tickets to display found.')
        //     this.stopLoading()
        //   }
        // }

        // if (this.keepFetching) {
        //   this.page++
        //   setTimeout(() => {
        //     this.fetchTickets()
        //   }, 6000)
        // }
      })
    },

    async refershTicketsFromTemp() {
      this.startLoading()
      if (this.ticketsTemp?.length) {
        this.tickets = this.ticketsTemp
      }

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
      this.$information.saveTicketFields(this.allTickets.at(1))
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
