<template>
  <a-panel :title="customTitle" :dataset-source="uniqueFields">
    <template #defaultView>
      <div
        :key="uniqueFields?.length"
        class="panel-body lg:grid-cols-2"
        :class="'overflow-y-scroll scrollbar-hide'"
      >
        <a-card
          v-for="(customField, c) in uniqueFields"
          :key="c"
          :name="formatLabel(customField?.name)"
          :count="customField?.ticket_count"
        />
      </div>
    </template>
  </a-panel>
</template>

<script lang="ts">
import { uniq, get } from 'lodash'
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
      default: () => {}
    },
    showUndefined: {
      type: Boolean,
      required: false,
      default: false
    },
    customTicketTitle: {
      type: String,
      required: false,
      default: ''
    },
    customTicketField: {
      type: String,
      required: false,
      default: ''
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
      return this.customTicketTitle
        ? this.customTicketField
        : this.additionalData?.custom_title ?? 'Custom field section'
    },
    customField() {
      return this.customTicketField
        ? this.customTicketField
        : this.additionalData?.custom_field ?? ''
    },
    customFieldIsDefined() {
      return this.customTitle && this.customField
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

      let customFields = this.tickets.map((ticket) => get(ticket, this.customField))
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
    },

    formatLabel(label: Any) {
      if ([true, false].includes(label)) {
        return Boolean(label) ? 'Yes' : 'No'
      }
      return label
    }
  }
})
</script>
