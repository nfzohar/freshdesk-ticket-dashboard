<template>
  <div v-if="customFieldIsDefined" class="w-full" :key="tickets.length">
    <a-section-title
      :the-text="title"
      :section-visible="showSection"
      :show-recolor-button="selectedView != 'default'"
      @toggleVisibility="showSection = !showSection"
      @recolorGraph="updateToken++"
      @switchView="nextView()"
    />

    <div
      v-if="showSection"
      class="border-primary-800 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
    >
      <div
        v-if="selectedViewDefault"
        class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center justify-between w-full p-2 overflow-y-scroll scrollbar-hide"
        style="max-height: 50vh"
      >
        <a-custom-field
          v-for="(customField, c) in uniqueFields"
          :key="c"
          :custom-field="customField"
        />
      </div>

      <a-statistics-graph
        v-else
        :key="(selectedView, updateToken)"
        :type="selectedView"
        :custom-class="'p-5 border-primary-700 border'"
        :datasets="customDatasets"
        :dataset-title="title"
        :dataset-labels="customDatasetLabels"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { uniq } from 'lodash'
import { defineComponent } from 'vue'
import ASectionTitle from '@/components//General/ASectionTitle.vue'
import ACustomField from '@/components/subcomponents/ACustomField.vue'
import AStatisticsGraph from '@/components/General/AStatisticsGraph.vue'

export default defineComponent({
  name: 'TicketCustomFieldSection',

  components: { ACustomField, AStatisticsGraph, ASectionTitle },

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
    },
    showUndefined: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  data() {
    return {
      updateToken: 0,
      isLoading: true,
      showSection: true,
      uniqueFields: Array(),
      selectedView: 'default',
      views: ['default', 'v-bar', 'h-bar', 'pie', 'doughnut']
    }
  },

  computed: {
    customFieldIsDefined() {
      return this.title && this.customField
    },
    selectedViewDefault() {
      return this.selectedView == 'default'
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

        if (this.showUndefined) {
          this.uniqueFields.push({
            name: 'Undefined',
            ticket_count: customFields.filter((customField) => !customField).length
          })
        }
      }

      this.isLoading = false
    },

    nextView() {
      let currentIndex = this.views.indexOf(this.selectedView) + 1
      this.selectedView = this.views[currentIndex] ?? 'default'
    }
  }
})
</script>
