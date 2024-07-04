<template>
  <a-panel :title="'Priorities'" :datasets="dataset" :dataset-labels="datasetLabels">
    <template #defaultView>
      <div class="panel-body lg:grid-cols-2" :class="'overflow-y-scroll scrollbar-hide'">
        <a-card
          v-for="(priority, p) in uniquePriorities"
          :key="p"
          :name="priority?.name"
          :count="priority?.ticket_count"
        />
      </div>
    </template>
  </a-panel>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { groupBy, sortBy, get } from 'lodash'
import ACard from '@/components/general/ACard.vue'
import APanel from '@/components/general/APanel.vue'

export default defineComponent({
  name: 'TicketPriorityList',

  components: { ACard, APanel },

  props: {
    tickets: {
      type: [Array, Object],
      required: false,
      default: () => {}
    }
  },

  data() {
    return {
      uniquePriorities: []
    }
  },

  computed: {
    ticketPriorities(): Array {
      return this.$information?.storedPriorities
    },
    datasetLabels() {
      return Object.values(this.uniquePriorities?.map((field) => field?.name))
    },
    dataset() {
      return Object.values(this.uniquePriorities?.map((field) => field?.ticket_count))
    }
  },

  watch: {
    'tickets.length'() {
      this.generatePrioritiesStatistics()
    }
  },

  mounted() {
    this.generatePrioritiesStatistics()
  },

  methods: {
    generatePrioritiesStatistics() {
      this.uniquePriorities = []

      let ticketPrioritiesList = groupBy(this.tickets, 'priority')

      Object.keys(ticketPrioritiesList).forEach((priorityId) => {
        let priority = {
          name: this.getPriorityLabel(priorityId),
          ticket_count: ticketPrioritiesList[priorityId].length
        }
        this.uniquePriorities.push(priority)
      })

      this.uniquePriorities = sortBy(this.uniquePriorities, 'ticket_count').reverse()
    },

    getPriorityLabel(priorityId: Number) {
      let priorityObject = this.ticketPriorities.filter((priority) => priority?.value == priorityId)
      return get(priorityObject, '[0].label')
    }
  }
})
</script>
