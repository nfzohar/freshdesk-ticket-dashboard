<template>
  <a-dialog custom-class="-mt-14" :manual-open="open">
    <template #trigger>
      <button
        class="actions-button"
        :title="'Show ticket resolvement statistics graph'"
        @click="open = true"
      >
        <i class="fa fa-chart-line" />
      </button>
    </template>

    <template #content>
      <div
        :key="updateToken"
        class="bg-secondary-600 w-10/12 m-auto rounded-md p-7 border border-primary-500"
      >
        <div class="w-full flex items-center justify-between mb-5">
          <h1
            :class="`w-full text-xl font-bold ${textOnSecondaryColor}`"
            v-text="'Ticket open/closed ratio'"
          />

          <div class="flex items-center justify-between gap-5 w-1/2">
            <a-select
              class="w-full px-1"
              :options="yearsFromTickets"
              :show-null-value="false"
              :the-value="selectedYear"
              @changed="(value) => (selectedYear = value)"
            />
            <a-select
              class="w-full px-1"
              :options="months"
              :label-field="'label'"
              :value-field="'value'"
              :the-value="selectedMonth"
              :null-value-label="'All months'"
              @changed="(value) => (selectedMonth = value)"
            />
          </div>
        </div>

        <div class="w-full">
          <a-statistics-graph
            :type="'line'"
            :class="'w-full h-full'"
            :datasets-through-prop="true"
            :dataset-labels="datasetLabels"
            :datasets="datasets"
          />
        </div>
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import { defineComponent } from 'vue'
import { format } from 'date-fns'

import ADialog from '@/components/general/ADialog.vue'
import ASelect from '@/components/general/ASelect.vue'
import AStatisticsGraph from '@/components/general/AStatisticsGraph.vue'

export default defineComponent({
  name: 'ResolvedStatisticsGraph',

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
      updateToken: 0,
      selectedYear: '',
      selectedMonth: '',
      openedTickets: [],
      closedTickets: [],
      ticketsByYear: [],
      yearsFromTickets: [],
      months: [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
      ]
    }
  },

  watch: {
    'tickets.length'() {
      this.splitTicketsByYear()
      this.ticketStatisticsForYear()
    },
    selectedYear() {
      this.selectedMonth = ''
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
          label: 'Closed/Resolved tickets',
          data: this.closedTickets,
          borderColor: 'green',
          backgroundColor: 'green'
        }
      ]
    },
    datasetLabels() {
      return this.months?.map((month) => month?.label)
    },
    textOnSecondaryColor() {
      return this.$information.textOnSecondaryColor
    },
    statuses(): Array {
      return Object.values(this.$information?.statuses)
    },
    openStatusId(): Object {
      return this.statuses?.filter((st) => st?.value == 'Open')[0]?.id
    },
    closedStatusId(): Object {
      return this.statuses?.filter((st) => st?.value == 'Closed')[0]?.id
    },
    resolvedStatusId(): Object {
      return this.statuses?.filter((st) => st?.value == 'Resolved')[0]?.id
    }
  },

  created() {
    window.addEventListener('resize', () => {
      this.updateToken++
    })
  },

  mounted() {
    this.splitTicketsByYear()
    this.ticketStatisticsForYear()
  },

  methods: {
    splitTicketsByYear() {
      this.ticketsByYear = groupBy(this.tickets, (ticket) =>
        format(new Date(ticket?.created_at), 'y')
      )

      this.yearsFromTickets = Object.keys(this.ticketsByYear)
      this.selectedYear = this.yearsFromTickets[0]
    },

    ticketStatisticsForYear() {
      let ticketsOfSelectedYear = this.ticketsByYear[this.selectedYear] ?? []

      this.openedTickets = this.buildOpenTicketsArray(ticketsOfSelectedYear)
      this.closedTickets = this.buildClosedTicketsArray(ticketsOfSelectedYear)
    },

    // TO DO: add a general function for buiding ticket counts

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

    buildClosedTicketsArray(ticketsOfYear: [Object, Array]) {
      let ticketsOfStatus = ticketsOfYear?.filter((yearsTicket) =>
        [this.closedStatusId, this.resolvedStatusId].includes(yearsTicket.status)
      )

      ticketsOfStatus?.map(
        (ticket) => (ticket['closed_in_month'] = format(new Date(ticket['updated_at']), 'M'))
      )
      ticketsOfStatus = groupBy(ticketsOfStatus, 'closed_in_month')

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
