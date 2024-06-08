<template>
  <div class="w-full">
    <div class="w-full flex items-center justify-between py-2">
      <h1
        class="w-full text-xl font-bold mb-1 cursor-pointer"
        :class="{ 'border-l-4 pl-2 border-primary-400': !showSection }"
        v-text="'Ticket open/closed ratio'"
        @click.stop="showSection = !showSection"
      />

      <a-select
        class="w-max"
        :options="displayForYear"
        :the-value="selectedYear"
        :show-null-value="false"
        @changed="(value) => (selectedYear = value)"
      />
    </div>

    <div v-if="showSection" :key="ticketsByYear.length">
      <a-statistics-graph :type="'line'" :datasets="datasets" :dataset-labels="labels" />
    </div>
  </div>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import { defineComponent } from 'vue'
import ASelect from '@/components/General/ASelect.vue'
import AStatisticsGraph from '@/components/General/AStatisticsGraph.vue'

export default defineComponent({
  name: 'TicketStatisticsOpenClosedGraph',

  components: { AStatisticsGraph, ASelect },

  props: {
    tickets: {
      type: [Object, Array],
      required: false,
      default: () => []
    }
  },

  data() {
    return {
      labels: [],
      showSection: true,
      ticketsByYear: [],
      openedTickets: [],
      closedTickets: [],
      displayForYear: [],
      selectedYear: new Date().getFullYear()
    }
  },

  watch: {
    'tickets.length'() {
      this.ticketsByYear = []
      this.splitTicketsByYear()
      this.ticketStatisticsForYear()
    },
    selectedYear() {
      this.ticketsByYear = []
      this.ticketStatisticsForYear()
    }
  },

  computed: {
    datasets() {
      return [
        {
          label: 'Opened tickets',
          data: this.openedTickets,
          borderColor: 'red',
          backgroundColor: 'red'
        },
        {
          label: 'Closed tickets',
          data: this.closedTickets,
          borderColor: 'green',
          backgroundColor: 'green'
        }
      ]
    },
    months() {
      return [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ].slice(new Date(this.oldestTicket).getMonth())
    },
    openStatusId(): Object {
      return this.$dashboard.statuses.filter((st) => st.value == 'Open')[0]?.id
    },
    closedStatusId(): Object {
      return this.$dashboard.statuses.filter((st) => st.value == 'Closed')[0]?.id
    }
  },

  created() {
    this.labels = this.months

    this.splitTicketsByYear()
    this.ticketStatisticsForYear()
  },

  methods: {
    splitTicketsByYear() {
      this.ticketsByYear = groupBy(this.tickets, (ticket) =>
        new Date(ticket.created_at).getFullYear()
      )

      this.displayForYear = Object.keys(this.ticketsByYear)
    },

    ticketStatisticsForYear() {
      let ticketsOfYear = this.ticketsByYear[this.selectedYear] ?? []

      this.openedTickets = this.buildOpenTicketsArray(ticketsOfYear)
      this.closedTickets = this.buildClosedTicketsArray(ticketsOfYear)

      // console.log('opened:')
      // console.log(this.openedTickets)

      // console.log('closed:')
      // console.log(this.closedTickets)
    },

    buildOpenTicketsArray(ticketsOfYear) {
      let ticketsOfStatus = ticketsOfYear.filter(
        (yearsTicket) => yearsTicket.status == this.openStatusId
      )

      ticketsOfStatus.forEach((ticket) => {
        ticket['created_month'] = Number(new Date(ticket['created_at']).getMonth()) + 1
      })

      ticketsOfStatus = groupBy(ticketsOfStatus, 'created_month')

      for (let month = 1; month <= 12; month++) {
        if (!ticketsOfStatus[month]) {
          ticketsOfStatus[month] = []
        }
      }

      return Object.values(ticketsOfStatus).map((month) => month?.length)
    },

    buildClosedTicketsArray(ticketsOfYear) {
      let ticketsOfStatus = ticketsOfYear.filter(
        (yearsTicket) => yearsTicket.status == this.closedStatusId
      )

      ticketsOfStatus.forEach((ticket) => {
        ticket['closed_month'] = Number(new Date(ticket['updated_at']).getMonth()) + 1
      })

      ticketsOfStatus = groupBy(ticketsOfStatus, 'closed_month')

      for (let month = 1; month <= 12; month++) {
        if (!ticketsOfStatus[month]) {
          ticketsOfStatus[month] = []
        }
      }
      
      return Object.values(ticketsOfStatus).map((month) => month?.length)
    }
  }
})
</script>
