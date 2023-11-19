<template>
  <div class="w-full">
    <h1 class="text-xl font-bold opacity-40 mb-1" v-text="'Tags'" />

    <div
      class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center justify-between w-full p-2 border-primary-800 bg-secondary-500 border rounded-md shadow-md shadow-primary-600"
      :class="'overflow-y-scroll scrollbar-hide'"
      style="max-height: 50vh"
    >
      <a-tag v-for="(tag, t) in uniqueTags" :key="t" :tag="tag" />
    </div>
  </div>
</template>

<script lang="ts">
import { uniq } from 'lodash'
import { defineComponent } from 'vue'
import ATag from '@/components/subcomponents/ATag.vue'

export default defineComponent({
  name: 'TicketTagStatisticsSection',

  components: { ATag },

  props: {
    tags: {
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

  mounted() {
    this.generateTagStatistics()
  },

  methods: {
    generateTagStatistics() {
      let uniqueTagList = uniq(this.tags.flat())

      if (uniqueTagList.length >= 1) {
        this.uniqueTags.push({
          name: uniqueTagList[0],
          ticket_count: this.tags.length
        })
        return
      }

      uniqueTagList.forEach((uniqueTag) => {
        this.uniqueTags.push({
          name: uniqueTag,
          ticket_count: this.tags.filter((tag) => tag.includes(uniqueTag))
        })
      })
    }
  }
})
</script>
