<template>
  <a-section :title="'Groups'" :datasets="dataset" :dataset-labels="datasetLabels">
    <template #defaultView>
      <div
        :key="ticketGroups?.length"
        class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center justify-between w-full p-2 border-primary-800 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
        :class="'overflow-y-scroll scrollbar-hide'"
        style="max-height: 50vh"
      >
        <a-card
          v-for="(group, g) in ticketGroups"
          :key="g"
          :name="group?.name"
          :count="group?.ticket_count"
        />
      </div>
    </template>
  </a-section>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import ASection from '@/components/general/ASection.vue'
import ACard from '@/components/subcomponents/ACard.vue'

export default defineComponent({
  name: 'TicketGroupsList',

  components: { ASection, ACard },

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
      ticketGroups: Array()
    }
  },

  computed: {
    dataset() {
      return Object.values(this.ticketGroups?.map((group) => group?.ticket_count))
    },
    datasetLabels() {
      return Object.values(this.ticketGroups?.map((group) => group?.name))
    }
  },

  watch: {
    'tickets.length'() {
      this.getGroupTicketCounts()
    }
  },

  async created() {
    await this.fetchTicketGroups()
  },

  methods: {
    async fetchTicketGroups() {
      if (!this.$configuration.storedGroups?.length) {
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
          .then(() => {
            this.$dashboard.groups = this.groups
          })
      }
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
