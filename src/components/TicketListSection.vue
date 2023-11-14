<template>
  <div class="w-full">
    <h1 class="text-xl font-bold opacity-40 mb-1" v-text="'Tickets'" />

    <div
      class="flex items-center justify-between gap-y-4 border border-primary-300 w-full bg-primary-500 rounded-t-lg p-3 shadow-md shadow-primary-600"
    >
      <button>1</button>
      <button>1</button>
      <button>1</button>
      <button>1</button>
      <button>1</button>
    </div>

    <div
      class="flex flex-col gap-y-4 border border-primary-300 w-full rounded-b-md p-3 mt-1 shadow-md shadow-primary-600 h-screen overflow-y-scroll scrollbar-hide"
      style="max-height: 40vh"
    >
      <a-ticket v-for="(ticket, t) in tickets" :key="t" :ticket="ticket" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import ATicket from '@/components/subcomponents/ATicket.vue'

export default defineComponent({
  name: 'TicketListSection',

  components: { ATicket },

  data() {
    return {
      tickets: [1, 2, 3, 4, 5, 6, 7]
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
