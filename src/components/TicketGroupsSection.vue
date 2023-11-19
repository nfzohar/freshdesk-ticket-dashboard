<template>
  <div class="w-full">
    <h1 class="text-xl font-bold opacity-40 mb-1" v-text="'Groups'" />

    <div
      class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center justify-between w-full p-2 border-primary-800 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
      :class="'overflow-y-scroll scrollbar-hide'"
      style="max-height: 50vh"
    >
      <a-group v-for="(group, t) in groups" :key="t" :group="group" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AGroup from '@/components/subcomponents/AGroup.vue'

export default defineComponent({
  name: 'TicketGroupStatisticsSection',

  components: { AGroup },

  props: {
    groups: {
      type: [Array, Object],
      required: false,
      default: () => {}
    }
  }
})
</script>
