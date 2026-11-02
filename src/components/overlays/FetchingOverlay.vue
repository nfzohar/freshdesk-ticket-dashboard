<template>
  <a-overlay size="sm" body-class="px-6 py-8">
    <div class="flex flex-col items-center text-center gap-4" role="status" aria-live="polite">
      <span class="spinner" aria-hidden="true" />
      <div>
        <h2 class="text-base font-semibold" v-text="'Loading your Freshdesk setup'" />
        <p class="mt-1 text-sm text-ink-muted" v-text="`${message}…`" />
      </div>
    </div>
  </a-overlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import AOverlay from '@/components/general/AOverlay.vue'

export default defineComponent({
  name: 'FetchingOverlay',

  components: { AOverlay },

  emits: ['done'],

  data() {
    return {
      adminTicketFields: new Array(),
      message: 'Fetching ticket fields from your freshdesk'
    }
  },

  watch: {
    adminTicketFields: {
      deep: true,
      handler: function () {
        this.$information?.setAdminTicketFields(this.adminTicketFields)
      }
    }
  },

  computed: {
    storedTicketFields(): Array<any> {
      return Object.values(this.$information?.storedAdminTicketFields)
    }
  },

  mounted() {
    this.fetchTicketFieldsFromFreshdesk()
  },

  methods: {
    async fetchTicketFieldsFromFreshdesk() {
      const response = await ApiCall.get('admin/ticket_fields')

      if (response) {
        this.adminTicketFields = Object.values(response)
      }

      await this.fetchTicketFieldOptions()

      // Save explicitly: the deep watcher may not flush before the route changes.
      this.$information?.setAdminTicketFields(this.adminTicketFields)
      this.$emit('done')
    },

    fetchTicketFieldOptions() {
      const requests = this.adminTicketFields?.map((ticketField) => {
        let index = ticketField?.label?.toLocaleLowerCase()
        this.message = `Fetching options for ${index} ticket field`

        if (index == 'agent') {
          return ApiCall.get('agents?per_page=100').then((response) => {
            ticketField['choices'] = Object.values(response ?? [])
          })
        } else if (index == 'group') {
          return ApiCall.get('groups?per_page=100').then((response) => {
            ticketField['choices'] = Object.values(response ?? [])
          })
        } else {
          return ApiCall.get(`admin/ticket_fields/${ticketField?.id}?include=section`).then(
            (response) => {
              ticketField['choices'] = Object.values(response?.choices ?? [])

              if (index == 'status') {
                let statuses = ticketField['choices'].map((choice: any) => choice.label)
                this.$configuration.updateVisibleStatuses(statuses)
              }
            }
          )
        }
      })

      return Promise.allSettled(requests ?? [])
    }
  }
})
</script>
