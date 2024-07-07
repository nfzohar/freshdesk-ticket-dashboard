<template>
  <a-panel
    :title="`Top ${leaderboardsLength} requesters`"
    :dataset-source="graphData"
    :is-sortable="false"
  >
    <template #defaultView>
      <div
        v-if="showSection"
        :key="tickets.length"
        class="panel-body"
        :class="'overflow-y-scroll scrollbar-hide'"
      >
        <div v-for="(requester, r) in topCountedRequesters" :key="r" class="flex items-center">
          <a-card
            :name="requester?.name"
            :subtitle="requester?.email"
            :count-label="'Created tickets'"
            :count="requester?.ticket_count"
          >
            <template v-if="showTrophies && Number(r) < 3" #card-icon>
              <span class="text-5xl">
                <i :class="`${trophyIcon} ${trophyColors[r]}`" />
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
import ACard from '@/components/general/ACard.vue'
import APanel from '@/components/general/APanel.vue'
import { groupBy, uniqBy, sortBy, get } from 'lodash'

export default defineComponent({
  name: 'RequestersLeaderboard',

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
      showSection: true,
      topRequesters: Array()
    }
  },

  watch: {
    tickets() {
      this.findTopRequesters()
    }
  },

  computed: {
    leaderboardsLength(): number {
      return this.$configuration.leaderboardsLength
    },
    showTrophies(): Boolean {
      return this.$configuration.showTrophies
    },
    trophyIcon(): String {
      return this.$configuration.trophyIcon
    },
    trophyColors(): Array {
      return this.$information.trophyColors
    },
    topCountedRequesters(): Object {
      return Object.values(this.topRequesters.slice(0, this.leaderboardsLength))
    },
    graphData() {
      return {
        labels: this.topCountedRequesters?.map((field) => field?.name),
        values: this.topCountedRequesters?.map((field) => field?.ticket_count)
      }
    }
  },

  mounted() {
    this.findTopRequesters()
  },

  methods: {
    findTopRequesters() {
      let requesters = groupBy(this.tickets, 'requester.name')

      Object.keys(requesters).forEach((requester) => {
        this.topRequesters.push({
          name: requester,
          email: get(requesters[requester], '[0].requester.email'),
          ticket_count: requesters[requester].length
        })
      })

      this.topRequesters = sortBy(uniqBy(this.topRequesters, 'name'), 'ticket_count').reverse()
    }
  }
})
</script>
