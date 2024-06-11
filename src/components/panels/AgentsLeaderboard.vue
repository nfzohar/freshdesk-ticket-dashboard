<template>
  <a-panel
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
            :name="agent?.contact?.name"
            :subtitle="agent?.contact?.email"
            :count-label="'Assigned tickets'"
            :count="agent?.ticket_count"
          >
            <template v-if="showTrophies && Number(a) < 3" #card-icon>
              <span class="text-5xl">
                <i :class="`${trophyIcon} ${trophyColors[a]}`" />
              </span>
            </template>
          </a-card>
        </div>
      </div>
    </template>
  </a-panel>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { groupBy, sortBy } from 'lodash'
import ApiCall from '@/helpers/APICallHelper'
import ACard from '@/components/general/ACard.vue'
import APanel from '@/components/general/APanel.vue'

export default defineComponent({
  name: 'AgentsLeaderboard',

  components: { APanel, ACard },

  props: {
    tickets: {
      type: [Array, Object],
      required: false,
      default: () => []
    }
  },

  data() {
    return {
      sortedAgents: [],
      allAgents: []
    }
  },

  watch: {
    'tickets.length'() {
      this.sortedAgents = []
      this.calculateAgentStatistics()
    }
  },

  computed: {
    topCountedAgents(): Object {
      return Object.values(this.sortedAgents.slice(0, this.leaderboardsLength))
    },
    dataset() {
      return this.topCountedAgents?.map((agent) => agent?.ticket_count)
    },
    datasetLabels() {
      return this.topCountedAgents?.map((agent) => agent?.contact?.name)
    },

    leaderboardsLength(): number {
      return this.$configuration.leaderboardsLength
    },

    showTrophies(): Boolean {
      return this.$configuration.showTrophies
    },
    trophyColors(): Array {
      return this.$configuration.trophyColors
    },
    trophyIcon(): String {
      return this.$configuration.trophyIcon
    }
  },

  mounted() {
    this.fetchAgents()
  },

  methods: {
    async fetchAgents() {
      if (!this.$configuration.storedAgents?.length) {
        await ApiCall.get('agents?per_page=100')
          .then((response) => {
            if (response) {
              this.allAgents = Object.values(response)
            }
          })
          .then(() => {
            this.calculateAgentStatistics()
          })
          .then(() => {
            this.$configuration.setAgents(this.allAgents)
          })
      }
    },

    calculateAgentStatistics() {
      let ticketsByAgent = groupBy(this.tickets, 'responder_id')
      this.sortedAgents = []

      this.allAgents.forEach((agent) => {
        if (agent) {
          let tempAgent = agent
          tempAgent['ticket_count'] = ticketsByAgent[agent.id]?.length

          this.sortedAgents.push(tempAgent)
        }
      })

      this.sortedAgents = sortBy(this.sortedAgents, 'ticket_count')
      this.sortedAgents.reverse()
    }
  }
})
</script>
