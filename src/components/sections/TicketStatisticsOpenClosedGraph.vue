<template>
  <div class="w-full">
    <div class="w-full flex items-center justify-between py-2">
      <h1 class="w-full text-xl font-bold mb-1" v-text="'Ticket open/closed ratio'" />

      <a-select
        class="w-40"
        :options="displayForYear"
        :the-value="selectedYear"
        :show-null-value="false"
        @changed="(value) => (selectedYear = value)"
      />
    </div>

    <div :key="selectedYear">
      <ticket-statistics-graph :type="'line'" :datasets="datasets" :dataset-labels="labels" />
    </div>
  </div>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import { defineComponent } from 'vue'
import ASelect from '@/components/General/ASelect.vue'
import TicketStatisticsGraph from '@/components/subcomponents/TicketStatisticsGraph.vue'

export default defineComponent({
  name: 'TicketStatisticsOpenClosedGraph',

  components: { TicketStatisticsGraph, ASelect },

  props: {
    tickets: {
      type: [Object, Array],
      required: false,
      default: () => []
    },
    oldestTicket: {
      type: Date,
      required: false,
      default: () => new Date()
    }
  },

  data() {
    return {
      labels: [],
      openedTickets: [],
      closedTickets: [],
      displayForYear: [],
      selectedYear: new Date().getFullYear()
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
    this.calculateYears()
  },

  mounted() {
    this.ticketStatisticsForYear()
  },

  methods: {
    ticketStatisticsForYear() {
      let ticketsOfYear = this.tickets.filter(
        (ticket) => new Date(ticket.created_at).getFullYear() == this.selectedYear
      )

      this.openedTickets = this.buildTicketsArrayByStatus(
        ticketsOfYear,
        this.openStatusId,
        'created_month',
        'created_at'
      )

      this.closedTickets = this.buildTicketsArrayByStatus(
        ticketsOfYear,
        this.closedStatusId,
        'closed_month',
        'updated_at'
      )
    },

    buildTicketsArrayByStatus(ticketsOfYear, statusId, monthFieldName, sortingField) {
      let ticketsOfStatus = ticketsOfYear.filter((yearsTicket) => yearsTicket.status == statusId)

      ticketsOfStatus.forEach((ticket) => {
        ticket[monthFieldName] = new Date(ticket[sortingField]).getMonth()
      })

      ticketsOfStatus = groupBy(ticketsOfStatus, monthFieldName)
      return Object.values(ticketsOfStatus).map((month) => month?.length)
    },

    calculateYears() {
      let oldestTicketDate = new Date(this.oldestTicket).getFullYear()
      let currentYear = new Date().getFullYear()

      for (let i = oldestTicketDate; i <= currentYear; i++) {
        this.displayForYear.push(i)
      }
      this.selectedYear = this.displayForYear[0]
    }
  }
})
</script>
