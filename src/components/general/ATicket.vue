<template>
  <div
    :title="'Show details'"
    :class="`bg-primary-500 p-3 hover:bg-primary-400 border-primary-600 rounded-md shadow-primary-700 cursor-pointer ${primaryColorText}`"
    @click="$emit('openTicketDetails', id)"
  >
    <h3 class="block font-bold text-lg" v-text="`#${id}: ${subject}`" />
    <hr class="my-1 border-t-2" />

    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-y-1 w-auto text-base">
        <span v-html="`<b>Requested by:</b> ${requester}`" />
        <span v-html="`<b>Tags</b>: ${tags}`" />
      </div>

      <div class="flex items-center gap-x-2 justify-between p-2 w-auto">
        <span
          title="Ticket status"
          :class="`ticket-label border-primary-500 ${primaryColorAccentBackground}`"
          v-text="status"
        />
        <span
          title="Ticket type"
          :class="`ticket-label border-primary-500 ${primaryColorAccentBackground}`"
          v-text="type"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {get} from 'lodash'
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
    type() {
      return this.theTicket?.type ?? 'Ticket'
    },
    subject() {
      return this.theTicket?.subject ?? 'New ticket'
    },
    requester() {
      return this.theTicket?.requester?.name ?? 'Not set'
    },
    tags() {
      return this.theTicket?.tags?.length ? this.theTicket?.tags?.join(', ') : 'None'
    },
    primaryColorText(): Boolean {
      return this.$information.textOnPrimaryColor
    },
    primaryColorAccentBackground(){
      return this.$information.bgAccentPrimaryColor
    },
    storedStatuses(): Array{
      return  Object.values(this.$information?.statuses);
    },
    status(): String {
      let status = this.storedStatuses?.filter(status => status?.id == this.theTicket?.status)
      return get(status, '[0].label') ?? 'N/A'
    },
  }
})
</script>

<style scoped>
.ticket-label {
  @apply w-auto m-auto font-bold border rounded-md px-2 py-1;
}
</style>
