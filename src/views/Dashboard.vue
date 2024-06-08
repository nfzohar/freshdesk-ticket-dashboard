<template>
  <ticket-details-modal
    :key="Number(detailsTicketId)"
    :ticket-id="Number(detailsTicketId)"
    @modalClosed="detailsTicketId = null"
  />
  <div
    class="flex flex-col bg-secondary-500 h-screen w-screen transition-colors"
    :class="[{ 'is-loading': isLoading }, { 'cursor-none': hiddenTopBar }]"
    :key="reloadToken"
    @mousemove="displayTopBar"
  >
    <top-bar
      :class="{ '-mt-24 ': hiddenTopBar }"
      :loading="isLoading"
      :all-tickets="allTickets"
      @refresh="loader"
      @reload="reloadToken++"
      @toggleLoading="toggleLoading()"
    />
    <component :is="`${selectedDashboardLayout}-layout`" :all-tickets="allTickets" />

    <!-- <ticket-list /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TopBar from '@/views/TopBar.vue'
import ApiCall from '@/helpers/APICallHelper'
import TicketList from '@/components/panels/TicketList.vue'
import RowsLayout from '@/components/layouts/RowsLayout.vue'
import ColumnsLayout from '@/components/layouts/ColumnsLayout.vue'
import TicketDetailsModal from '@/components/subcomponents/TicketDetailsModal.vue'

export default defineComponent({
  name: 'TheDashboard',

  components: {
    TopBar,
    TicketList,
    RowsLayout,
    ColumnsLayout,
    TicketDetailsModal
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
      detailsTicketId: null
    }
  },

  computed: {
    selectedDashboardLayout() {
      let sel = true
      return !sel ? 'rows' : 'columns'
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

  async mounted() {
    // if (!this.$store.authenticated) {
    //   this.$router.push('/')
    // }
  },

  methods: {
    loader() {},

    async loadTickets() {
      this.keepFetching = true
      this.isLoading = true

      // Set default api call if not set
      if (!this.apiCallUrl) {
        this.apiCallUrl =
          'tickets?updated_since=' + this.startYear + '&include=requester,stats&per_page=100'
      }

      await this.fetchTicketsByPage()
    },

    loadFilteredTickets() {
      this.apiCallUrl = 'search/tickets?query="' + this.$store.filters + '"'
    },

    async fetchTicketsByPage() {
      this.page = 1
      this.ticketsTemp = []

      try {
        await this.fetchTickets()
      } catch (error) {
        this.keepFetching = false
        this.toggleLoading()
      }
    },

    async fetchTickets() {
      await ApiCall.get(this.apiCallUrl + '&page=' + this.page).then((response) => {
        if (response) {
          this.ticketsTemp[this.page] = Object.values(response.results ?? response)
        }

        if (!this.ticketsTemp[this.page]?.length) {
          this.keepFetching = false

          if (this.ticketsTemp?.length) {
            this.refershTicketsFromTemp()
          } else {
            this.$toast.clear()
            this.$toast.error('No tickets to display found.')
            this.toggleLoading()
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

    async refershTicketsFromTemp() {
      this.toggleLoading()
      this.tickets = this.ticketsTemp

      setTimeout(async () => {
        this.ticketsTemp = []
        this.toggleLoading()
      }, 3000)
    },

    toggleLoading() {
      this.isLoading = !this.isLoading
    },

    displayTopBar() {
      this.hiddenTopBar = false
      setTimeout(() => {
        this.hiddenTopBar = true
      }, 10000)
    }
  }
})
</script>
