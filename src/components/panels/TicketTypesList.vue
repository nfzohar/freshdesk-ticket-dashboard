<template>
  <ticket-custom-field
    :title="'Types'"
    :custom-field="'type'"
    :show-undefined="false"
    :tickets="tickets"
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
