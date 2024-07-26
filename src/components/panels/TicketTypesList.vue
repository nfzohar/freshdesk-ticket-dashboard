<template>
  <ticket-custom-field
    :tickets="tickets"
    :show-undefined="false"
    :custom-ticket-title="'Types'"
    :custom-ticket-field="'type'"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TicketCustomField from '@/components/panels/TicketCustomField.vue'

export default defineComponent({
  name: 'TicketTypesList',

  components: { TicketCustomField },

  props: {
    tickets: {
      type: [Array, Object],
      required: false,
      default: () => []
    }
  }
})
</script>
