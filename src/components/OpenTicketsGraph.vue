<template>
  <a-dialog
    :manual-open="open"
    size="full"
    icon="fa fa-grip"
    :title="'Tickets per day'"
    :subtitle="`Created tickets in ${selectedYear ?? '…'}, by day.`"
  >
    <template #trigger>
      <button class="actions-button" :title="'Show open tickets grid view.'" @click="open = true">
        <i class="fa fa-grip" />
      </button>
    </template>

    <template #content>
      <div :key="updateToken" class="flex flex-col gap-5">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="flex flex-wrap items-end gap-4">
            <a-select
              class="w-40"
              :options="yearsWithTickets"
              :show-null-value="false"
              :the-value="selectedYear"
              :label="'Year'"
              @changed="(value) => (selectedYear = value)"
            />
            <a-checkbox
              class="mb-2"
              :the-value="showNumbers"
              :label="'Show ticket counts'"
              @changed="(value) => (showNumbers = value)"
            />
          </div>

          <div class="flex items-center gap-2 text-xs text-ink-muted">
            <span v-text="'Fewer'" />
            <span
              v-for="(level, l) in legend"
              :key="l"
              class="h-4 w-4 rounded"
              :class="level.class"
              :title="level.title"
            />
            <span v-text="'More'" />
          </div>
        </div>

        <div class="grid grid-cols-12 items-start gap-x-2 lg:gap-x-4 max-h-[65vh] overflow-y-auto">
          <div v-for="(month, m) in months" class="flex flex-col items-center gap-1" :key="m">
            <span class="block lg:hidden text-xs font-medium text-ink-muted" v-text="m + 1" />
            <span
              class="hidden lg:block text-xs font-medium text-ink-muted"
              v-text="month.label.slice(0, 3)"
            />

            <div
              v-for="(day, d) in month.days"
              class="grid place-items-center w-full h-5 rounded text-[10px] tabular-nums transition hover:ring-2 hover:ring-primary/60"
              :class="ticketCountColor(dayTicketCount(m, d))"
              :title="`${day}. ${month?.label} ${selectedYear}: ${dayTicketCount(m, d) ?? 0} tickets`"
              :key="d"
              v-text="showNumbers ? dayTicketCount(m, d) : ''"
            />
          </div>
        </div>
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import { defineComponent } from 'vue'
import { fdate } from '@/helpers/CommonMethods'
import ADialog from '@/components/general/ADialog.vue'
import ASelect from '@/components/general/ASelect.vue'
import ACheckbox from '@/components/general/ACheckbox.vue'

export default defineComponent({
  name: 'OpenTicketsGraph',

  components: { ASelect, ADialog, ACheckbox },

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
      isLoading: true,
      selectedYear: '',
      ticketsOfYear: [],
      showNumbers: false,
      yearsWithTickets: []
    }
  },

  watch: {
    'tickets.length'() {
      this.splitTicketsByYear()
      this.buildTicketsArray()
    },
    selectedYear() {
      this.generateTicketsOfYearArray()
    },
    open() {
      if (this.open) {
        this.isLoading = true
        this.splitTicketsByYear()
        this.generateTicketsOfYearArray()
      }
    }
  },

  computed: {
    // Heatmap steps, lowest to highest. Class names are literal so Tailwind keeps them.
    legend() {
      return [
        { max: 10, class: 'bg-primary/30 text-ink', title: '1 to 10 tickets.' },
        { max: 25, class: 'bg-primary/50 text-ink', title: '11 to 25 tickets.' },
        { max: 50, class: 'bg-primary/70 text-on-primary', title: '26 to 50 tickets.' },
        { max: 100, class: 'bg-primary/90 text-on-primary', title: '51 to 100 tickets.' },
        { max: 200, class: 'bg-primary text-on-primary', title: '101 to 200 tickets.' },
        { max: Infinity, class: 'bg-primary-600 text-on-primary', title: 'More than 200 tickets.' }
      ]
    },
    textOnSecondaryColor(): String {
      return this.$information?.textOnSecondaryColor
    },
    months(): Array {
      return this.$information?.months
    }
  },

  methods: {
    splitTicketsByYear() {
      this.yearsWithTickets = Object.keys(
        groupBy(this.tickets, (ticket) => fdate(ticket?.created_at, 'y'))
      )
      this.selectedYear = new Date().getFullYear()
    },

    generateTicketsOfYearArray() {
      this.ticketsOfYear = this.tickets.filter(
        (ticket) => fdate(ticket?.created_at, 'y') == this.selectedYear
      )

      this.ticketsOfYear = groupBy(this.ticketsOfYear, (ticket) => fdate(ticket?.created_at, 'L'))

      this.ticketsOfYear = Object.values(this.ticketsOfYear).map((month) =>
        groupBy(month, (ticket) => fdate(ticket?.created_at, 'd'))
      )

      console.log(this.ticketsOfYear)

      this.isLoading = false
    },

    dayTicketCount(month: number, day: number) {
      if (this.ticketsOfYear[month]) {
        if (this.ticketsOfYear[month][day]) {
          return this.ticketsOfYear[month][day].length
        }
        return 0
      }
      return '-'
    },

    ticketCountColor(ticketCount: number) {
      if (typeof ticketCount != 'number' || ticketCount <= 0) {
        return 'bg-surface-2 text-ink-muted'
      }
      return this.legend.find((level) => ticketCount <= level.max)?.class
    }
  }
})
</script>
