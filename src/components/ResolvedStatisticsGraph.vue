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
        class="flex flex-col bg-secondary-600 gap-5 w-95p xl:w-80p m-auto p-5 rounded-md border border-primary-500"
      >
        <div class="w-full flex items-end justify-between">
          <a-select
            :class="'w-max'"
            :options="yearsFromTickets"
            :show-null-value="false"
            :the-value="selectedYear"
            :label="'Show ticket of year:'"
            @changed="(value) => (selectedYear = value)"
          />

          <span
            :class="`bg-secondary-500 p-3 w-auto h-full rounded-md ${textOnSecondaryColor}`"
            v-html="`<b>Date range:</b> ${firstTicketDate} - ${lastTicketDate}`"
          />
        </div>

        <div :class="'w-100p m-auto'">
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
import { format } from 'date-fns'
import { defineComponent } from 'vue'
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
    },
    lastTicketDate: {
      type: Date,
      required: false,
      default: new Date()
    },
    firstTicketDate: {
      type: Date,
      required: false,
      default: new Date()
    }
  },

  data() {
    return {
      open: false,
      updateToken: 0,
      selectedDay: '',
      selectedYear: '',
      selectedMonth: '',

      ticketsByYear: [],
      openedTickets: [],
      closedTickets: [],
      yearsFromTickets: []
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
          borderColor: 'red',
          backgroundColor: 'red',
          label: 'Opened tickets',
          data: this.openedTickets
        },
        {
          label: 'Closed/resolved tickets',
          borderColor: 'green',
          backgroundColor: 'green',
          data: this.closedTickets
        }
      ]
    },
    datasetLabels(): String {
      return this.months?.map((month) => month?.label)
    },
    textOnSecondaryColor(): String {
      return this.$information?.textOnSecondaryColor
    },
    statuses(): Array {
      return Object.values(this.$information?.statuses ?? [])
    },
    selectedIsLeapYear(): Boolean {
      let year = Number(this.selectedYear)
      return (0 == year % 4 && 0 != year % 100) || 0 == year % 400
    },
    months(): Array {
      return this.$information?.months
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

      let closedStatusIds = [this.findStatusId('Closed'), this.findStatusId('Resolved')]
      this.closedTickets = this.buildTicketsArray(
        ticketsOfSelectedYear,
        closedStatusIds,
        'updated_at'
      )

      let openStatusId = [this.findStatusId('Open')]
      this.openedTickets = this.buildTicketsArray(ticketsOfSelectedYear, openStatusId, 'created_at')
    },

    buildTicketsArray(ticketsOfYear, statusIds, dateField: String) {
      let ticketsOfStatus = ticketsOfYear.filter((yearsTicket) =>
        statusIds.includes(yearsTicket.status)
      )

      ticketsOfStatus.forEach((ticket) => {
        ticket['sorting_index'] = Number(new Date(ticket[dateField]).getMonth()) + 1
      })
      ticketsOfStatus = groupBy(ticketsOfStatus, 'sorting_index')

      for (let month = 1; month <= 12; month++) {
        if (!ticketsOfStatus[month]) {
          ticketsOfStatus[month] = []
        }
      }
      return Object.values(ticketsOfStatus).map((month) => month?.length)
    },

    findStatusId(label: String) {
      return this.statuses?.filter((status) => status?.value == label)[0]?.id
    }
  }
})
</script>
