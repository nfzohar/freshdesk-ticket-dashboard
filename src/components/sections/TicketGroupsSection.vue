<template>
  <div class="w-full">
    <h1
      class="text-xl font-bold mb-1 cursor-pointer"
      :class="{ 'border-l-4 pl-2 border-primary-400': !showSection }"
      v-text="'Groups'"
      @click.stop="showSection = !showSection"
    />

    <div
      v-if="showSection"
      :key="ticketGroups?.length"
      class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center justify-between w-full p-2 border-primary-800 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
      :class="'overflow-y-scroll scrollbar-hide'"
      style="max-height: 50vh"
    >
      <a-group v-for="(group, t) in ticketGroups" :key="t" :group="group" />
    </div>
  </div>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import AGroup from '@/components/subcomponents/AGroup.vue'

export default defineComponent({
  name: 'TicketGroupStatisticsSection',

  components: { AGroup },

  props: {
    tickets: {
      type: [Array, Object],
      required: false,
      default: () => {}
    }
  },

  data() {
    return {
      groups: [],
      showSection: true,
      ticketGroups: Array()
    }
  },

  watch: {
    'tickets.length'() {
      this.getGroupTicketCounts()
    }
  },

  async mounted() {
    await this.fetchTicketGroups()
    this.$dashboard.groups = this.groups
  },

  methods: {
    async fetchTicketGroups() {
      this.groups = []

      await ApiCall.get('groups?per_page=100')
        .then((response) => {
          if (response) {
            this.groups = response
          }
        })
        .then(() => {
          this.getGroupTicketCounts()
        })
    },

    async getGroupTicketCounts() {
      this.ticketGroups = []
      let ticketsGrouped = groupBy(this.tickets, 'group_id')

      Object.values(this.groups).forEach((group) => {
        if (group) {
          this.ticketGroups.push({
            name: group?.name,
            ticket_count: ticketsGrouped[group?.id]?.length ?? 0
          })
        }
      })
    }
  }
})
</script>
