<template>
  <a-panel :title="'Tags'" :datasets="dataset" :dataset-labels="datasetLabels">
    <template #defaultView>
      <div
        class="panel-body lg:grid-cols-2"
        :class="'overflow-y-scroll scrollbar-hide'"
      >
        <a-card
          v-for="(tag, t) in uniqueTags"
          :key="t"
          :name="tag?.name"
          :count="tag?.ticket_count"
        />
      </div>
    </template>
  </a-panel>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { uniq, sortBy, get } from 'lodash'
import ACard from '@/components/general/ACard.vue'
import APanel from '@/components/general/APanel.vue'

export default defineComponent({
  name: 'TicketTagStatisticsSection',

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
        this.setSingleTagObject(uniqueTagList)
        return
      }

      uniqueTagList?.forEach((tag) => {
        let ticketsOfTags = this.tags?.filter((aTag) => aTag?.includes(tag))

        this.uniqueTags.push({
          name: tag,
          ticket_count: ticketsOfTags?.length
        })
      })

      this.uniqueTags = sortBy(this.uniqueTags, 'ticket_count')
      this.uniqueTags.reverse()
    },

    setSingleTagObject(uniqueTagList: Array) {
      let tag = {
        name: get(uniqueTagList, '[0]'),
        ticket_count: this.tags?.length
      }

      this.uniqueTags.push(tag)
    }
  }
})
</script>