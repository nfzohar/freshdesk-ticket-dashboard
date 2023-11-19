<template>
  <div
    :title="'Show details'"
    class="bg-primary-500 p-3 hover:bg-primary-400 border-primary-600 rounded-md shadow-primary-700 shadow-md cursor-pointer"
    @click="$emit('openTicketDetails', id)"
  >
    <div class="flex items-center justify-between">
      <h3 class="block font-bold text-lg" v-text="'#' + id + ': ' + subject" />
      <span class="font-semibold" v-text="type" />
    </div>

    <hr class="my-1 border-t-2" />

    <div class="flex items-center">
      <div class="flex flex-col w-10/12">
        <div class="flex items-center gap-x-1">
          <span class="font-semibold" v-text="'Requested by:'" />
          <span class="text-base" v-text="requester" />
        </div>

        <div class="flex items-center gap-x-1">
          <span class="font-semibold" v-text="'Tags:'" />
          <span v-text="tags" />
        </div>
      </div>

      <div class="w-2/12">
        <span
          class="block w-max m-auto font-bold bg-primary-600 border-secondary-400 rounded-md px-2 py-1"
          v-text="status"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ATicket',

  props: {
    theTicket: {
      type: String,
      required: false,
      default: () => {}
    }
  },

  emits: ['openTicketDetails'],

  computed: {
    id() {
      return this.theTicket?.id ?? 0
    },
    subject() {
      return this.theTicket?.subject ?? 'New ticket'
    },
    type() {
      return this.theTicket?.type ?? 'Ticket'
    },
    requester() {
      return this.theTicket?.requester_id ?? 'Not set'
    },
    tags() {
      if (this.theTicket?.tags.length) {
        return this.theTicket?.tags.join(', ')
      }
      return 'None'
    },
    status() {
      return this.theTicket?.status
    }
  }
})
</script>
