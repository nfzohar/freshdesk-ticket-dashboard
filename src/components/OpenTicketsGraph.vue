<template>
  <a-dialog :manual-open="open">
    <template #trigger>
      <button class="actions-button" :title="'Show open tickets grid view.'" @click="open = true">
        <i class="fa fa-grip" />
      </button>
    </template>

    <template #content>
      <div
        :key="updateToken"
        class="flex flex-col bg-secondary-600 w-90p xl:w-80p 2xl:w-65p gap-5 m-auto p-5 rounded-md border border-primary-500"
        :class="[{ 'is-loading': (this.isLoading = false) }, textOnSecondaryColor]"
      >
        <div class="w-full flex m-auto items-center">
          <div class="w-full flex gap-x-2 m-auto items-center">
            <span class="font-bold" v-text="'Show ticket of year:'" />
            <a-select
              :class="'w-full md:w-2/12'"
              :options="yearsWithTickets"
              :show-null-value="false"
              :the-value="selectedYear"
              :label="''"
              @changed="(value) => (selectedYear = value)"
            />
          </div>

          <a-checkbox
            class="block w-full"
            :the-value="showNumbers"
            :label="'Show ticket counts'"
            @changed="(value) => (showNumbers = value)"
          />

          <div class="flex items-center gap-x-2">
            <span class="font-bold" v-text="'Legend:'" />
            <i
              class="fa fa-square border border-primary-500 rounded-md text-primary-900"
              :title="'Less than 10 tickets.'"
            />
            <i
              class="fa fa-square border border-primary-500 rounded-md text-primary-800"
              :title="'Less than 25 tickets.'"
            />
            <i
              class="fa fa-square border border-primary-500 rounded-md text-primary-700"
              :title="'Between 25 and 50 tickets.'"
            />
            <i
              class="fa fa-square border border-primary-500 rounded-md text-primary-600"
              :title="'Between 50 to 100 tickets.'"
            />
            <i
              class="fa fa-square border border-primary-500 rounded-md text-primary-500"
              :title="'Between 100 to 200 tickets.'"
            />
            <i
              class="fa fa-square border border-primary-500 rounded-md text-primary-400"
              :title="'More than 200 tickets.'"
            />
          </div>
        </div>

        <div
          class="grid grid-cols-12 items-start w-100p gap-x-5 m-auto h-80p overflow-y-scroll scrollbar-hide"
        >
          <div
            v-for="(month, m) in months"
            class="flex flex-col items-center gap-1 font-bold"
            :key="m"
          >
            <span class="block lg:hidden" v-text="m + 1" />
            <span class="hidden lg:block" v-text="month.label" />

            <div
              v-for="(day, d) in month.days"
              class="w-10/12 h-5 border border-primary-600 rounded-md hover:border-2 bg-primary-600 text-center font-normal text-xs"
              :class="ticketCountColor(dayTicketCount(m, d))"
              :title="`${day}. ${month?.label} ${selectedYear}`"
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
      if (typeof ticketCount != 'number') {
        return
      }

      if (ticketCount <= 10) {
        return 'bg-primary-900'
      }
      if (ticketCount > 10 && ticketCount <= 25) {
        return 'bg-primary-800'
      }
      if (ticketCount > 25 && ticketCount <= 50) {
        return 'bg-primary-700'
      }
      if (ticketCount > 50 && ticketCount <= 100) {
        return 'bg-primary-600'
      }
      if (ticketCount > 100 && ticketCount <= 200) {
        return 'bg-primary-500'
      }
      if (ticketCount > 200 && ticketCount <= 300) {
        return 'bg-primary-400'
      }
    }
  }
})
</script>
