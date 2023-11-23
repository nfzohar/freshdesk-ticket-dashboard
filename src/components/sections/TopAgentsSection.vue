<template>
  <div class="w-full">
    <h1
      class="text-xl font-bold mb-1 cursor-pointer"
      :class="{ 'border-l-4 pl-2 border-primary-400': !showSection }"
      v-text="'Top ' + topListCount + ' agents'"
      @click.stop="showSection = !showSection"
    />

    <div
      v-if="showSection"
      :key="tickets.length"
      class="grid grid-cols-1 gap-5 items-center justify-between w-full p-2 border-primary-800 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
      :class="'overflow-y-scroll scrollbar-hide'"
      style="max-height: 50vh"
    >
      <a-top-agent v-for="(agent, t) in topCountedAgents" :key="t" :position="t" :agent="agent" />
    </div>
  </div>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import ATopAgent from '@/components/subcomponents/ATopAgent.vue'

export default defineComponent({
  name: 'TopAgentsSection',

  components: { ATopAgent },

  props: {
    tickets: {
      type: [Array, Object],
      required: false,
      default: () => []
    },
    topListCount: {
      type: Number,
      required: false,
      default: 5
    }
  },

  data() {
    return {
      showSection: true,
      sortedAgents: [],
      allAgents: []
    }
  },

  watch: {
    tickets() {
      this.fetchAgents()
    }
  },

  computed: {
    topCountedAgents() {
      return this.sortedAgents.slice(0, this.topListCount)
    }
  },

  mounted() {
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
