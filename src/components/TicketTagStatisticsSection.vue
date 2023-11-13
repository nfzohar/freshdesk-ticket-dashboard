<template>
  <div class="flex items-center justify-between w-full">
test
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'

export default defineComponent({
  name: 'TicketTagStatisticsSection',


  data() {
    return {
      tags: [],
    }
  },

  mounted() {
    this.getTicketCounts()
  },

  methods: {
    getTicketCounts() {
      return ApiCall.get('tickets/all')
    }
  }
})
</script>
