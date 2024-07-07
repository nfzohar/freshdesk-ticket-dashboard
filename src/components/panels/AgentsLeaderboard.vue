<template>
  <a-panel
    :title="`Top ${leaderboardsLength} agents`"
    :dataset-source="graphData"
    :is-sortable="false"
  >
    <template #defaultView>
      <div :key="tickets.length" class="panel-body" :class="'overflow-y-scroll scrollbar-hide'">
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
    leaderboardsLength(): number {
      return this.$configuration?.leaderboardsLength
    },
    trophyColors(): Array {
      return this.$information?.trophyColors
    },
    trophyIcon(): String {
      return this.$configuration?.trophyIcon
    },
    showTrophies(): Boolean {
      return this.$configuration?.showTrophies
    },

    topCountedAgents(): Object {
      return Object.values(this.sortedAgents?.slice(0, this.leaderboardsLength))
    },
    graphData() {
      return {
        labels: this.topCountedAgents?.map((field) => field?.name),
        values: this.topCountedAgents?.map((field) => field?.ticket_count)
      }
    }
  },

  mounted() {
    this.allAgents = this.$information.storedAgents
    this.calculateAgentStatistics()
  },

  methods: {
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

      this.sortedAgents = sortBy(this.sortedAgents, 'ticket_count').reverse()
    }
  }
})
</script>
