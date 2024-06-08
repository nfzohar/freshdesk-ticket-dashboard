<template>
  <a-section
    :datasets="dataset"
    :dataset-labels="datasetLabels"
    :title="'Top ' + topListCount + ' agents'"
  >
    <template #defaultView>
      <div
        :key="tickets.length"
        class="grid grid-cols-1 gap-5 items-center justify-between w-full p-2 border-primary-800 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
        :class="'overflow-y-scroll scrollbar-hide'"
        style="max-height: 50vh"
      >
        <a-top-agent v-for="(agent, t) in topCountedAgents" :key="t" :position="t" :agent="agent" />
      </div>
    </template>
  </a-section>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import ASection from '@/components/General/ASection.vue'
import ATopAgent from '@/components/subcomponents/ATopAgent.vue'

export default defineComponent({
  name: 'AgentsLeaderboard',

  components: { ATopAgent, ASection },

  props: {
    tickets: {
      type: [Array, Object],
      required: false,
      default: () => []
    }
  },

  data() {
    return {
      topCountedAgents: [],
      sortedAgents: [],
      allAgents: []
    }
  },

  watch: {
    'tickets.length'() {
      this.sortedAgents = []
      this.calculateAgentStatistics()
    },
    'sortedAgents.length'() {
      this.topCountedAgents = this.sortedAgents.slice(0, this.topListCount)
    }
  },

  computed: {
    topListCount(): number {
      let count = this.$dashboard?.$state?.layout?.top_agents?.settings?.listLentgh
      return count > 0 ? count : 5
    },
    dataset() {
      return Object.values(this.topCountedAgents?.map((agent) => agent?.ticket_count))
    },
    datasetLabels() {
      return Object.values(this.topCountedAgents?.map((agent) => agent?.name))
    }
  },

  created() {
    this.fetchAgents()
  },

  methods: {
    async fetchAgents() {
      await ApiCall.get('agents?per_page=100')
        .then((response) => {
          if (response) {
            this.allAgents = Object.values(response)
          }
        })
        .then(() => {
          this.sortedAgents = []
          this.calculateAgentStatistics()
        })
        .then(() => {
          this.$dashboard.agents = this.allAgents
        })
    },

    calculateAgentStatistics() {
      let ticketsByAgent = groupBy(this.tickets, 'responder_id')

      this.allAgents.forEach((agent) => {
        if (agent) {
          let anAgent = agent
          anAgent['ticket_count'] = ticketsByAgent[agent.id]?.length

          this.sortedAgents.push(anAgent)
        }
      })

      this.sortedAgents = this.sortedAgents.sort((a1, a2) => {
        a1['ticket_count'] > a2['ticket_count']
      })
    }
  }
})
</script>
