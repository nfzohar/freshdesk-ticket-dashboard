<template>
  <div class="w-full">
    <h1 class="text-xl font-bold opacity-40 mb-1" v-text="'Top requesters'" />

    <div
      :key="tickets.length"
      class="grid grid-cols-1 gap-5 items-center justify-between w-full p-2 border-primary-800 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
      :class="'overflow-y-scroll scrollbar-hide'"
      style="max-height: 50vh"
    >
      <a-custom-field
        v-for="(customField, c) in topRequesters"
        :key="c"
        :custom-field="customField"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import { defineComponent } from 'vue'
import ACustomField from '@/components/subcomponents/ACustomField.vue'

export default defineComponent({
  name: 'TopRequestersSection',

  components: { ACustomField },

  props: {
    tickets: {
      type: [Array, Object],
      required: false,
      default: () => []
    },
    topListCount: {
      type: Number,
      required: false,
      default: 5
    }
  },

  data() {
    return {
      topRequesters: Array()
    }
  },

  watch: {
    tickets() {
      this.findTopRequesters()
    }
  },

  mounted() {
    this.findTopRequesters()
  },

  methods: {
    findTopRequesters() {
      let requesters = groupBy(this.tickets, 'requester.name')

      Object.keys(requesters).forEach((requester) => {
        this.topRequesters.push({
          name: requester,
          ticket_count: requesters[requester].length
        })
      })

      this.topRequesters = this.topRequesters.sort(
        (tr1, tr2) => tr2?.ticket_count - tr1?.ticket_count
      )
      this.topRequesters = this.topRequesters.slice(0, this.topListCount)
    }
  }
})
</script>
