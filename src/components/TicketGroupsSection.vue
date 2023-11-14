<template>
  <div class="w-full">
    <h1 class="text-xl font-bold opacity-40 mb-1" v-text="'Groups'" />

    <div
      class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center justify-between h- w-full p-2 border-primary-300 bg-secondary-500 border rounded-md shadow-md shadow-primary-600"
      :class="'overflow-y-scroll scrollbar-hide'"
      style="max-height: 50vh"
    >
      <a-group v-for="(tag, t) in tags" :key="t" :group="[]" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import AGroup from './subcomponents/AGroup.vue'

export default defineComponent({
  name: 'TicketGroupStatisticsSection',

  components: { AGroup },

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
      return ApiCall.get('tickets/all')
    }
  }
})
</script>
