<template>
  <div
    :title="'Show details'"
    :class="`bg-primary-500 p-3 hover:bg-primary-400 border-primary-600 rounded-md shadow-primary-700 cursor-pointer ${primaryColorText}`"
  >
    <template v-if="mode == 'panel-content'">
      <h3
        :class="`block font-bold text-base border-0 border-b-2 w-full h-7 overflow-x-hidden break-keep`"
        v-text="subject"
      />

      <div class="flex flex-col items-left w-full text-sm justify-between">
        <div class="flex flex-col items-left w-max text-sm justify-between">
          <span v-html="`<b>Submitted by:</b> ${requester}`" />
          <span v-if="tags?.length" v-html="`<b>Tags</b>: ${tags}`" />
        </div>

        <div :class="`flex items-end gap-x-2 mt-1 w-max ${primaryColorText}`">
          <span
            title="Ticket status"
            :class="`font-bold text-xs border w-max text-center rounded-md px-3 py-1 border-primary-500 ${primaryAccentedBg}`"
            v-text="status"
          />
          <span
            title="Ticket type"
            :class="`font-bold text-xs border w-max text-center rounded-md px-3 py-1 border-primary-500 ${primaryAccentedBg}`"
            v-text="type"
          />
        </div>
      </div>
    </template>

    <template v-else>
      <h3 class="block font-bold text-lg" v-text="`#${id}: ${subject}`" />
      <hr class="my-1 border-t-2" />

      <div class="flex items-center justify-between">
        <div class="flex flex-col gap-y-1 w-auto text-base">
          <span v-html="`<b>Submitted by:</b> ${requester}`" />
          <span v-if="tags?.length" v-html="`<b>Tags</b>: ${tags}`" />
        </div>

        <div :class="`flex items-center gap-x-2 justify-between p-2 w-auto ${primaryColorText}`">
          <span
            title="Ticket status"
            :class="`ticket-label border-primary-500 ${primaryAccentedBg}`"
            v-text="status"
          />
          <span
            title="Ticket type"
            :class="`ticket-label border-primary-500 ${primaryAccentedBg}`"
            v-text="type"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { get } from 'lodash'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ATicket',

  props: {
    theTicket: {
      type: String,
      required: false,
      default: () => {}
    },
    mode: {
      type: String,
      required: false,
      default: 'list-item'
    }
  },

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
    primaryColorDarkt(): String {
      return this.$information?.textOnPrimaryColor
    },
    storedStatuses(): Array {
      return Object.values(this.$information?.storedStatuses)
    },
    status(): String {
      let status = this.storedStatuses?.filter((status) => status?.id == this.theTicket?.status)
      return get(status, '[0].label') ?? 'N/A'
    },
    primaryColorText(): String {
      return `text-${this.$information?.isPrimaryColorDark ? 'white' : 'black'}`
    },
    primaryAccentedBg(): String {
      return this.$information?.isPrimaryColorDark ? 'bg-primary-600' : 'bg-primary-400'
    }
  }
})
</script>

<style scoped>
.ticket-label {
  @apply w-auto m-auto font-bold border rounded-md px-2 py-1;
}
</style>
