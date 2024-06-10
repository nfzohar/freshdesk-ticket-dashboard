<template>
  <a-section :title="'Tags'" :datasets="dataset" :dataset-labels="datasetLabels">
    <template #defaultView>
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center justify-between w-full p-2 border-primary-800 bg-secondary-500 border rounded-md shadow-md shadow-primary-600"
        :class="'overflow-y-scroll scrollbar-hide'"
        style="max-height: 50vh"
      >
        <a-card
          v-for="(tag, t) in uniqueTags"
          :key="t"
          :name="tag?.name"
          :count="tag?.ticket_count"
        />
      </div>
    </template>
  </a-section>
</template>

<script lang="ts">
import { uniq } from 'lodash'
import { defineComponent } from 'vue'
import ASection from '@/components/general/ASection.vue'
import ACard from '@/components/general/ACard.vue'

export default defineComponent({
  name: 'TicketTagStatisticsSection',

  components: { ACard, ASection },

  props: {
    tickets: {
      type: [Array, Object],
      required: false,
      default: () => {}
    }
  },

  data() {
    return {
      uniqueTags: []
    }
  },

  computed: {
    tags() {
      return this.tickets?.map((ticket) => ticket.tags)
    },
    dataset() {
      return Object.values(this.uniqueTags?.map((field) => field?.ticket_count))
    },
    datasetLabels() {
      return Object.values(this.uniqueTags?.map((field) => field?.name))
    }
  },

  watch: {
    'tickets.length'() {
      this.uniqueTags = []
      this.generateTagStatistics()
    }
  },

  mounted() {
    this.generateTagStatistics()
  },

  methods: {
    generateTagStatistics() {
      let uniqueTagList = uniq(this.tags.flat())

      if (uniqueTagList?.length <= 1) {
        this.uniqueTags.push({
          name: uniqueTagList[0],
          ticket_count: this.tags?.length
        })
        return
      }

      uniqueTagList?.forEach((uniqueTag) => {
        let ticketsOfTags = this.tags?.filter((tag) => tag?.includes(uniqueTag))

        this.uniqueTags.push({
          name: uniqueTag,
          ticket_count: ticketsOfTags?.length
        })
      })
    }
  }
})
</script>
