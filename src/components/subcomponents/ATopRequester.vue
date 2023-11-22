<template>
  <div
    class="flex flex-row justify-between items-center rounded-md w-full bg-primary-500 border-secondary-600 px-3 py-2"
    :key="ticketCount"
  >
    <div class="flex flex-col">
      <span class="font-bold" v-text="name" />

      <span class="text-sm">
        <span class="font-semibold" v-text="'Count of tickets: '" />
        <span v-text="ticketCount" />
      </span>
    </div>

    <trophy-icon pt-height="30pt" pt-width="30pt" :spot="Number(position + 1)" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TrophyIcon from '@/components/icons/TrophyIcon.vue'

export default defineComponent({
  name: 'ATopRequester',

  components: { TrophyIcon },

  props: {
    requester: {
      type: [Object, Array],
      required: false,
      default: () => []
    },
    position: {
      type: Number,
      requried: false,
      default: 4
    }
  },

  computed: {
    name() {
      return this.requester?.name ?? 'Requester'
    },
    ticketCount() {
      return this.requester?.ticket_count ?? 0
    }
  }
})
</script>
