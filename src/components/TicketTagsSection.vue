<template>
  <div class="w-full">
    <h1 class="text-xl font-bold opacity-40 mb-1" v-text="'Tags'" />

    <div
      class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center justify-between w-full p-2 border-primary-800 bg-secondary-500 border rounded-md shadow-md shadow-primary-600"
      :class="'overflow-y-scroll scrollbar-hide'"
      style="max-height: 50vh"
    >
      <a-tag v-for="(tag, t) in tags" :key="t" :tag="[]" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import ATag from '@/components/subcomponents/ATag.vue'

export default defineComponent({
  name: 'TicketTagStatisticsSection',

  components: { ATag },

  data() {
    return {
      tags: ['1', '2', '3']
    }
  },

  mounted() {
    this.getTicketGroups()
  },

  methods: {
    getTicketGroups() {
    }
  }
})
</script>
