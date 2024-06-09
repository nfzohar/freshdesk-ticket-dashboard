<template>
  <a-section
    :datasets="dataset"
    :dataset-labels="datasetLabels"
    :title="`Top ${leaderboardsLength} agents`"
  >
    <template #defaultView>
      <div
        :key="tickets.length"
        class="grid grid-cols-1 gap-5 items-center justify-between w-full p-2 border-primary-800 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
        :class="'overflow-y-scroll scrollbar-hide'"
        style="max-height: 50vh"
      >
        <div v-for="(agent, a) in topCountedAgents" :key="a" class="flex items-center">
          <a-card
            :class="'rounded-l-md rounded-r-none'"
            :name="agent?.contact?.name ?? 'Agent'"
            :subtitle="agent?.contact?.email ?? 'john@doe.com'"
            :count-label="'Assigned tickets'"
            :count="agent?.ticket_count"
          />
          <span class="block h-auto w-max bg-primary-500 px-3 py-6 rounded-r-md">
            <i class="fa fa-trophy text-4xl" :class="trophyColors[a]" />
          </span>
        </div>
      </div>
    </template>
  </a-section>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import ASection from '@/components/General/ASection.vue'
import ACard from '@/components/subcomponents/panel/ACard.vue'

export default defineComponent({
  name: 'AgentsLeaderboard',

  components: { ASection, ACard },

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
      this.topCountedAgents = this.sortedAgents.slice(0, this.leaderboardsLength)
    }
  },

  computed: {
    dataset() {
      return Object.values(this.topCountedAgents?.map((agent) => agent?.ticket_count))
    },
    datasetLabels() {
      return Object.values(this.topCountedAgents?.map((agent) => agent?.name))
    },
    trophyColors() {
      return ['text-yellow-500', 'text-gray-400', 'text-amber-900']
    },
    leaderboardsLength(): number {
      return this.$configuration.leaderboardsLength
    },
    showTrophies(): Boolean {
      return this.$configuration.showTrophies
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
