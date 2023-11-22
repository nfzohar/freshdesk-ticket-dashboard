<template>
  <div class="w-full" :key="tickets.length">
    <h1 class="text-xl font-bold mb-1 z-7" v-text="title" />

    <div
      class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center justify-between w-full p-2 overflow-y-scroll scrollbar-hide"
      :class="'border-primary-800 border bg-secondary-500 rounded-md shadow-md shadow-primary-600'"
      style="max-height: 50vh"
    >
      <a-custom-field
        v-for="(customField, c) in uniqueFields"
        :key="c"
        :custom-field="customField"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { uniq } from 'lodash'
import { defineComponent } from 'vue'
import ACustomField from '@/components/subcomponents/ACustomField.vue'

export default defineComponent({
  name: 'TicketCustomFieldSection',

  components: { ACustomField },

  props: {
    tickets: {
      type: [Array, Object],
      required: false,
      default: () => []
    },
    customField: {
      type: String,
      required: true,
      default: 'id'
    },
    title: {
      type: String,
      required: true,
      default: 'Custom field Section'
    }
  },

  data() {
    return {
      uniqueFields: Array(),
      isLoading: true
    }
  },

  watch: {
    tickets() {
      this.generateCustomFieldStatistics()
    }
  },

  mounted() {
    this.generateCustomFieldStatistics()
  },

  methods: {
    generateCustomFieldStatistics() {
      this.uniqueFields = []

      let customFields = this.tickets.map((ticket) => ticket[this.customField])
      let uniqueFieldsList = uniq(customFields)

      if (uniqueFieldsList.length == 1) {
        this.uniqueFields.push({
          name: uniqueFieldsList[0] ?? 'Undefined',
          ticket_count: this.customFields?.length
        })
      } else {
        uniqueFieldsList.forEach((uniqueCustomField) => {
          if (uniqueCustomField) {
            this.uniqueFields.push({
              name: uniqueCustomField,
              ticket_count: customFields.filter((field) => field == uniqueCustomField).length
            })
          }
        })

        this.uniqueFields.push({
          name: 'Undefined',
          ticket_count: customFields.filter((customField) => !customField).length
        })
      }

      this.isLoading = false
    }
  }
})
</script>
