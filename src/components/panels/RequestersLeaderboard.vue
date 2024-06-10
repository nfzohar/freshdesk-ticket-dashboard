<template>
  <a-section
    :datasets="dataset"
    :dataset-labels="datasetLabels"
    :title="`Top ${leaderboardsLength} requesters`"
  >
    <template #defaultView>
      <div
        v-if="showSection"
        :key="tickets.length"
        class="grid grid-cols-1 gap-5 items-center justify-between w-full p-2 border-primary-800 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
        :class="'overflow-y-scroll scrollbar-hide'"
        style="max-height: 50vh"
      >
        <div v-for="(requester, r) in topCountedRequesters" :key="r" class="flex items-center">
          <a-card
            :class="{ 'rounded-l-md rounded-r-none': showTrophies }"
            :name="requester?.name"
            :subtitle="requester?.email"
            :count-label="'Created tickets'"
            :count="requester?.ticket_count"
          />
          <span
            v-if="showTrophies && Number(r) < 3"
            class="block h-auto w-max bg-primary-500 px-3 py-6 rounded-r-md"
          >
            <i :class="`text-4xl ${trophyIcon} ${trophyColors[r]}`" />
          </span>
        </div>
      </div>
    </template>
  </a-section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { groupBy, uniqBy } from 'lodash'
import ASection from '@/components/general/ASection.vue'
import ACard from '@/components/subcomponents//ACard.vue'

export default defineComponent({
  name: 'RequestersLeaderboard',

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
    topListCount(): number {
      let count = this.$dashboard?.$state?.layout?.top_requesters?.settings?.listLentgh
      return count > 0 ? count : 5
    },
    topCountedRequesters(): Object {
      return this.topRequesters.slice(0, this.topListCount)
    },
    dataset() {
      return Object.values(this.topCountedRequesters?.map((field) => field?.ticket_count))
    },
    datasetLabels() {
      return Object.values(this.topCountedRequesters?.map((field) => field?.name))
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
    this.findTopRequesters()
  },

  methods: {
    findTopRequesters() {
      let requesters = groupBy(this.tickets, 'requester.name')

      Object.keys(requesters).forEach((requester) => {
        this.topRequesters.push({
          name: requester,
          ticket_count: requesters[requester].length
        })
      })

      this.topRequesters = this.topRequesters.sort(
        (tr1, tr2) => tr2?.ticket_count - tr1?.ticket_count
      )

      this.topRequesters = uniqBy(this.topRequesters, 'name')
    }
  }
})
</script>
