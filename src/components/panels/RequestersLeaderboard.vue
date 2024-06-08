<template>
  <a-section
    :datasets="dataset"
    :dataset-labels="datasetLabels"
    :title="'Top ' + topListCount + ' requesters'"
  >
    <template #defaultView>
      <div
        v-if="showSection"
        :key="tickets.length"
        class="grid grid-cols-1 gap-5 items-center justify-between w-full p-2 border-primary-800 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
        :class="'overflow-y-scroll scrollbar-hide'"
        style="max-height: 50vh"
      >
        <a-top-requester
          v-for="(topRequester, t) in topCountedRequesters"
          :key="t"
          :position="t"
          :requester="topRequester"
        />
      </div>
    </template>
  </a-section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { groupBy, uniqBy } from 'lodash'
import ASection from '@/components/General/ASection.vue'
import ATopRequester from '@/components/subcomponents/ATopRequester.vue'

export default defineComponent({
  name: 'RequestersLeaderboard',

  components: { ATopRequester, ASection },

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
