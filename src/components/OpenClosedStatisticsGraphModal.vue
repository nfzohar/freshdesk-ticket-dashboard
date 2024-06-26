<template>
  <a-dialog custom-class="-mt-28 md:-mt-14" :manual-open="open">
    <template #trigger>
      <button
        class="actions-button"
        :title="'Show Open/Closed statistics graph'"
        @click="open = true"
      >
        <i class="fa fa-chart-line" />
      </button>
    </template>

    <template #content>
      <div class="bg-secondary-600 w-11/12 h-auto m-auto rounded-md p-5 border border-primary-500">
        <div class="w-full flex items-center justify-between mb-5">
          <h1
            class="w-full text-xl font-bold"
            :class="`text-${secondaryColorIsDark ? 'white' : 'black'}`"
            v-text="'Ticket open/closed ratio'"
          />
          <a-select
            class="w-max"
            :options="displayForYear"
            :the-value="selectedYear"
            :show-null-value="false"
            @changed="(value) => (selectedYear = value)"
          />
        </div>

        <div>
          <a-statistics-graph
            class="w-full"
            :key="ticketsByYear.length"
            :type="'line'"
            :datasets="datasets"
            :dataset-labels="labels"
          />
        </div>
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import { defineComponent } from 'vue'
import ADialog from '@/components/general/ADialog.vue'
import ASelect from '@/components/general/ASelect.vue'
import AStatisticsGraph from '@/components/general/AStatisticsGraph.vue'

export default defineComponent({
  name: 'TicketStatisticsOpenClosedGraph',

  components: { AStatisticsGraph, ASelect, ADialog },

  props: {
    tickets: {
      type: [Object, Array],
      required: false,
      default: () => []
    }
  },

  data() {
    return {
      open: false,
      labels: [],
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
      return this.$information.statuses.filter((st) => st.value == 'Open')[0]?.id
    },
    closedStatusId(): Object {
      return this.$information.statuses.filter((st) => st.value == 'Closed')[0]?.id
    },
    secondaryColorIsDark() {
      return this.$information.isSecondaryColorDark
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
