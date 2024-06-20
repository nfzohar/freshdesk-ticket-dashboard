<template>
  <a-panel :title="title" :datasets="customDatasets" :dataset-labels="customDatasetLabels">
    <template #defaultView>
      <div
        :key="uniqueFields?.length"
        class="panel-body lg:grid-cols-2"
        :class="'overflow-y-scroll scrollbar-hide'"
      >
        <a-card
          v-for="(customField, c) in uniqueFields"
          :key="c"
          :name="customField?.name"
          :count="customField?.ticket_count"
        />
      </div>
    </template>
  </a-panel>
</template>

<script lang="ts">
import { uniq } from 'lodash'
import { defineComponent } from 'vue'
import ACard from '@/components//general/ACard.vue'
import APanel from '@/components/general/APanel.vue'

export default defineComponent({
  name: 'TicketCustomFieldPanel',

  components: { ACard, APanel },

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
    window.addEventListener('resize', () => this.updateToken++)
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
