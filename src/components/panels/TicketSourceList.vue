<template>
  <a-panel :title="'Priorities'" :dataset-source="uniqueSources">
    <template #defaultView>
      <div class="panel-body lg:grid-cols-2" :class="'overflow-y-scroll scrollbar-hide'">
        <a-card
          v-for="(priority, p) in uniqueSources"
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
  name: 'TicketSourceList',

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
      uniqueSources: []
    }
  },

  computed: {
    ticketSources(): Array {
      return this.$information?.storedSources
    }
  },

  watch: {
    'tickets.length'() {
      this.generateSourceStatistics()
    }
  },

  mounted() {
    this.generateSourceStatistics()
  },

  methods: {
    generateSourceStatistics() {
      this.uniqueSources = []

      let ticketSourcesList = groupBy(this.tickets, 'source')

      Object.keys(ticketSourcesList).forEach((sourceId) => {
        let priority = {
          name: this.getSourceLabel(sourceId),
          ticket_count: ticketSourcesList[sourceId].length
        }
        this.uniqueSources.push(priority)
      })

      this.uniqueSources = sortBy(this.uniqueSources, 'ticket_count').reverse()
    },

    getSourceLabel(sourceId: Number) {
      let sourceObject = this.ticketSources.filter((source) => source?.value == sourceId)
      return get(sourceObject, '[0].label')
    }
  }
})
</script>
