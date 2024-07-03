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
  name: 'TicketTypesList',

  components: { ACard, APanel },

  props: {
    tickets: {
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
      title: 'Types',
      updateToken: 0,
      isLoading: true,
      uniqueFields: []
    }
  },

  computed: {
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

      let ticketTypes = this.tickets.map((ticket) => ticket?.type)
      let uniqueTicketTypes = uniq(ticketTypes)

      if (uniqueTicketTypes.length == 1) {
        let ticketList = {
          name: uniqueTicketTypes[0] ?? 'Undefined',
          ticket_count: this.tickets?.length
        }
        this.uniqueFields.push(ticketList)
        return
      }

      uniqueTicketTypes.forEach((uniqueTicketType) => {
        if (uniqueTicketType) {
          let typeFieldSet = {
            name: uniqueTicketType,
            ticket_count: ticketTypes.filter((type) => type == uniqueTicketType)?.length
          }
          this.uniqueFields.push(typeFieldSet)
        }
      })

      if (this.showUndefined) {
        this.uniqueFields.push({
          name: 'Undefined',
          ticket_count: ticketTypes.filter((type) => !type)?.length
        })
      }

      this.isLoading = false
    }
  }
})
</script>
