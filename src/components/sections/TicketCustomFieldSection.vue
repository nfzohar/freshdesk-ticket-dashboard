<template>
  <div v-if="customFieldIsDefined" class="w-full" :key="tickets.length">
    <div class="flex items-center justify-between">
      <h1
        class="text-xl font-bold mb-1 cursor-pointer"
        :class="{ 'border-l-4 pl-2 border-primary-400': !showSection }"
        v-text="title"
        @click.stop="showSection = !showSection"
      />

      <button
        class="hover:bg-primary-500 hover:shadow-md hover:shadow-primary-600 rounded-full"
        :title="'Switch view'"
        @click="nextView()"
      >
        <switch-icon />
      </button>
    </div>

    <div
      v-if="showSection"
      class="border-primary-800 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
    >
      <div
        v-if="selectedView == 'default'"
        class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center justify-between w-full p-2 overflow-y-scroll scrollbar-hide"
        style="max-height: 50vh"
      >
        <a-custom-field
          v-for="(customField, c) in uniqueFields"
          :key="c"
          :custom-field="customField"
        />
      </div>

      <div v-else :key="selectedView">
        <a-statistics-graph
          :type="selectedView"
          :custom-class="'p-5 border-primary-700 border'"
          :datasets="customDatasets"
          :dataset-labels="customDatasetLabels"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { uniq } from 'lodash'
import { defineComponent } from 'vue'
import SwitchIcon from '@/components//icons/SwitchIcon.vue'
import ACustomField from '@/components/subcomponents/ACustomField.vue'
import AStatisticsGraph from '@/components/General/AStatisticsGraph.vue'

export default defineComponent({
  name: 'TicketCustomFieldSection',

  components: { ACustomField, AStatisticsGraph, SwitchIcon },

  props: {
    tickets: {
      type: [Array, Object],
      required: false,
      default: () => []
    },
    customField: {
      type: String,
      required: true,
      default: ''
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
      showSection: true,
      isLoading: true,
      selectedView: 'default'
    }
  },

  computed: {
    customFieldIsDefined() {
      return this.title && this.customField
    },
    customCustomField() {
      return this.customField.substring(0, 3) == 'cf_'
    },
    customDatasets() {
      return Object.values(this.uniqueFields.map((field) => field.ticket_count))
    },
    customDatasetLabels() {
      return Object.values(this.uniqueFields.map((field) => field.name))
    }
  },

  watch: {
    'tickets.length'() {
      this.generateCustomFieldStatistics()
    }
  },

  mounted() {
    this.generateCustomFieldStatistics()
  },

  methods: {
    generateCustomFieldStatistics() {
      this.uniqueFields = []

      let customFields = this.customCustomField
        ? this.tickets.map((ticket) => ticket.custom_fields[this.customField])
        : this.tickets.map((ticket) => ticket[this.customField])

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
    },

    nextView() {
      let validViews = ['default', 'v-bar', 'h-bar', 'pie', 'doughnut']
      let currentIndex = validViews.indexOf(this.selectedView) + 1
      this.selectedView = validViews[currentIndex] ?? 'default'
    }
  }
})
</script>
