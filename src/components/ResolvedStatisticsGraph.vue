<template>
  <a-dialog
    :manual-open="open"
    size="full"
    icon="fa fa-chart-line"
    :title="'Resolution statistics'"
    :subtitle="`Tickets created between ${firstTicketDate} and ${lastTicketDate}.`"
  >
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
      <div :key="updateToken" class="flex flex-col gap-5">
        <div class="flex flex-wrap items-end gap-4">
          <a-select
            class="w-40"
            :options="yearsFromTickets"
            :show-null-value="false"
            :the-value="selectedYear"
            :label="'Year'"
            @changed="(value) => (selectedYear = value)"
          />
          <a-select
            class="w-56"
            :options="graphTypes"
            :show-null-value="false"
            :the-value="selectedGraphType"
            :label="'Graph type'"
            :value-field="'value'"
            :label-field="'label'"
            @changed="(value) => (selectedGraphType = value)"
          />
        </div>

        <div class="w-full rounded-xl border border-line p-4">
          <a-statistics-graph
            class="w-full max-h-[60vh]"
            :custom-class="''"
            :type="selectedGraphType"
            :display-graph-legend="true"
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
import { groupBy, get } from 'lodash'
import { defineComponent } from 'vue'
import { fdate } from '@/helpers/CommonMethods'
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
      type: String,
      required: false,
      default: () => new Date().toDateString()
    },
    firstTicketDate: {
      type: String,
      required: false,
      default: () => new Date().toDateString()
    }
  },

  data() {
    return {
      open: false,
      updateToken: 0,
      selectedDay: '',
      selectedYear: '',
      selectedMonth: '',
      selectedGraphType: 'line',

      ticketsByYear: [],
      openedTickets: [],
      closedTickets: [],
      resolvedTickets: [],
      finishedTickets: [],
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
          borderColor: '#ff0000',
          backgroundColor: '#ff0000',
          label: 'Opened tickets',
          data: this.openedTickets
        },
        {
          label: 'Closed & Resolved tickets',
          borderColor: '#008B83',
          backgroundColor: '#008B83',
          data: this.finishedTickets
        },
        {
          label: 'Closed tickets',
          borderColor: '#007d06',
          backgroundColor: '#007d06',
          data: this.closedTickets,
          hidden: true
        },
        {
          label: 'Resolved tickets',
          borderColor: '#0099ff',
          backgroundColor: '#0099ff',
          data: this.resolvedTickets,
          hidden: true
        }
      ]
    },
    datasetLabels(): string {
      return this.months?.map((month) => month?.label)
    },
    textOnSecondaryColor(): string {
      return this.$information?.textOnSecondaryColor
    },
    statuses(): Array<any> {
      return Object.values(this.$information?.storedStatuses ?? [])
    },
    selectedIsLeapYear(): boolean {
      let year = Number(this.selectedYear)
      return (0 == year % 4 && 0 != year % 100) || 0 == year % 400
    },
    months(): Array<any> {
      return this.$information?.months
    },
    graphTypes() {
      let allGraphTypesFromStore = this.$information?.graphTypes ?? []
      let excludedGraphTypes = ['pie', 'doughnut', 'polar-area']

      return allGraphTypesFromStore?.filter((chart) => !excludedGraphTypes.includes(chart.value))
    }
  },

  created() {
    window.addEventListener('resize', this.onWindowResize)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
  },

  mounted() {
    this.splitTicketsByYear()
    this.ticketStatisticsForYear()
  },

  methods: {
    onWindowResize() {
      this.updateToken++
    },

    splitTicketsByYear() {
      this.ticketsByYear = groupBy(this.tickets, (ticket) => fdate(ticket?.created_at, 'y'))
      this.yearsFromTickets = Object.keys(this.ticketsByYear)
      this.selectedYear = this.yearsFromTickets[0]
    },

    ticketStatisticsForYear() {
      let ticketsOfYear = this.ticketsByYear[this.selectedYear] ?? []

      this.openedTickets = this.buildTicketsArray(ticketsOfYear, 'Open', 'created_at')
      this.closedTickets = this.buildTicketsArray(ticketsOfYear, 'Closed', 'stats.closed_at')
      this.resolvedTickets = this.buildTicketsArray(ticketsOfYear, 'Resolved', 'stats.resolved_at')

      for (let i = 0; i < this.closedTickets?.length; i++) {
        this.finishedTickets[i] = this.closedTickets[i] + this.resolvedTickets[i]
      }
    },

    buildTicketsArray(ticketsOfYear: any, status: string, dateField: string) {
      let statusId = this.findStatusId(status)

      let ticketsOfStatus = ticketsOfYear.filter((yearsTicket: any) => yearsTicket.status == statusId)

      ticketsOfStatus.forEach((ticket: any) => {
        ticket['sorting_index'] = Number(fdate(get(ticket, dateField), 'M'))
      })
      ticketsOfStatus = groupBy(ticketsOfStatus, 'sorting_index')

      for (let month = 1; month <= 12; month++) {
        if (!ticketsOfStatus[month]) {
          ticketsOfStatus[month] = []
        }
      }
      return Object.values(ticketsOfStatus).map((month: any) => month?.length)
    },

    findStatusId(label: string) {
      return this.statuses?.filter((status) => status?.value == label)[0]?.id
    }
  }
})
</script>
