<template>
  <a-panel :title="customTitle" :datasets="customDatasets" :dataset-labels="customDatasetLabels">
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
    additionalData: {
      type: [Array, Object],
      required: false,
      default: () => []
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
      uniqueFields: []
    }
  },

  computed: {
    customTitle() {
      return this.additionalData?.custom_title ?? 'Custom field Section'
    },
    customField() {
      return this.additionalData?.custom_field ?? ''
    },
    customFieldIsDefined() {
      return this.customTitle && this.customField
    },
    customCustomField() {
      return this.customField.substring(0, 3) == 'cf_'
    },
    customDatasets() {
      return Object.values(this.uniqueFields.map((field) => field?.ticket_count))
    },
    customDatasetLabels() {
      return Object.values(this.uniqueFields.map((field) => field?.name))
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
        let ticketList = {
          name: uniqueFieldsList[0] ?? 'Undefined',
          ticket_count: this.customFields?.length
        }

        this.uniqueFields.push(ticketList)
        return
      }

      uniqueFieldsList.forEach((uniqueCustomField) => {
        if (uniqueCustomField) {
          let customFieldSet = {
            name: uniqueCustomField,
            ticket_count: customFields.filter((field) => field == uniqueCustomField)?.length
          }
          this.uniqueFields.push(customFieldSet)
        }
      })

      if (this.showUndefined) {
        this.uniqueFields.push({
          name: 'Undefined',
          ticket_count: customFields.filter((customField) => !customField)?.length
        })
      }

      this.isLoading = false
    }
  }
})
</script>
