<template>
  <div
    :key="reloadToken"
    class="flex flex-col bg-secondary-500 h-screen w-screen transition-colors"
    :class="[{ 'is-loading': isLoading }, { 'cursor-none': autoHideTopBar }]"
    @mousemove="displayTopBar"
  >
    <tool-bar
      :loading="isLoading"
      :all-tickets="allTickets"
      :auto-hide="autoHideTopBar"
      @stopLoading="stopLoading"
      @startLoading="startLoading"
      @refresh="loadTickets"
    />
    <!-- @reload="" -->
    <component :is="dashboardLayoutAlignment" :all-tickets="allTickets" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import ToolBar from '@/components/DashboardToolbar.vue'
import RowsLayout from '@/components/layouts/RowsLayout.vue'
import ColumnsLayout from '@/components/layouts/ColumnsLayout.vue'
import { getAvailablePanelComponents } from '@/helpers/CommonMethods'

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
      filters: [],
      tickets: [],
      ticketsTemp: [],
      apiCallUrl: '',
      updateToken: 0,
      reloadToken: 0,
      startYear: null,
      isLoading: false,
      keepFetching: true,
      hiddenTopBar: false,
      timeoutId: null
    }
  },

  computed: {
    dashboardLayoutAlignment() {
      return this.$configuration?.orientation == 'vertical' ? 'columns-layout' : 'rows-layout'
    },
    autoHideTopBar() {
      return this.$configuration?.autoHideToolbar && this.hiddenTopBar
    },
    allTickets(): Object {
      return this.tickets?.flat()
    }
  },

  watch: {
    'allTickets.length'() {
      this.updateToken++
    },
    apiCallUrl() {
      this.loadTickets()
    }
  },

  created() {
    this.startYear = new Date(import.meta.env?.VITE_FRESHDESK_START_YEAR ?? '1970').toISOString()
  },

  async mounted() {
    // if (!this.$auth.authenticated) {
    //   this.$router.push('/')
    // }

    await this.loadTickets()
  },

  methods: {
    async loadTickets() {
      this.keepFetching = true
      this.startLoading()

      // Set default api call if not set
      if (!this.apiCallUrl) {
        this.apiCallUrl =
          'tickets?updated_since=' + this.startYear + '&include=requester,stats&per_page=100'
      }
      await this.fetchTicketsByPage()
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
      this.tickets = this.ticketsTemp

      setTimeout(async () => {
        this.ticketsTemp = []
        this.stopLoading()
      }, 3000)
    },

    loadFilteredTickets() {
      this.apiCallUrl = 'search/tickets?query="' + this.$auth.filters + '"'
    },

    startLoading() {
      this.isLoading = true
    },

    stopLoading() {
      this.isLoading = false
    },

    displayTopBar() {
      this.hiddenTopBar = false
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        this.hiddenTopBar = true
      }, 10000)
    }
  }
})
</script>
