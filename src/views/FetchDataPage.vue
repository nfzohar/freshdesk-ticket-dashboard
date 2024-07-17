<template>
  <div class="dashboard-body flex flex-col">
    <div class="is-loading w-screen m-auto" />
    <span
      class="w-full text-center p-24 font-bold text-xl animate-pulse"
      v-text="'Fetching information from your freshdesk...'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'

export default defineComponent({
  name: 'FetchDataPage',

  async mounted() {
    await this.fetchTicketFieldsFromFreshdesk()

    setTimeout(() => {
      this.$information.saveConfigurationToStore()
      this.$router.replace('/dashboard')
    }, 1000)
  },

  methods: {
    async fetchTicketFieldsFromFreshdesk() {
      let adminTicketFields = new Array()

      await ApiCall.get('admin/ticket_fields').then((response) => {
        if (response) {
          let fetchedTicketFields = Object.values(response)

          fetchedTicketFields?.forEach((ticketField) => {
            let index = ticketField?.label?.toLocaleLowerCase()

            setTimeout(async () => {
              ticketField['choices'] = await this.loadTicketFieldChoices(ticketField?.id, index)
              adminTicketFields[index] = ticketField
            }, 3000)
          })
        }
      })

      this.$information.setAdminTicketFields(adminTicketFields)
    },

    async loadTicketFieldChoices(ticketFieldId, index) {
      let choices = []

      switch (index) {
        case 'agent': {
          choices = await this.fetchAgentsFromFreshdesk()
          break
        }
        case 'group': {
          choices = await this.fetchGroupsFromFreshdesk()
          break
        }
        default: {
          choices = await this.fetchResourceFromFreshdesk(ticketFieldId)
          break
        }
      }
      return choices
    },

    async fetchGroupsFromFreshdesk() {
      let groups = []

      await ApiCall.get('groups?per_page=100').then((response) => {
        if (response) {
          groups = Object.values(response)
        }
      })
      return groups
    },

    async fetchAgentsFromFreshdesk() {
      let agents = []

      await ApiCall.get('agents?per_page=100').then((response) => {
        if (response) {
          agents = Object.values(response)
        }
      })
      return agents
    }

    //   async fetchStatusesFromFreshdesk(statusFieldId: number) {
    //     await ApiCall.get(`admin/ticket_fields/${statusFieldId}?include=section`).then((response) => {
    //       let statuses = response?.choices
    //       this.$information.setStatuses(statuses)
    //       if (!this.$configuration.visibleTicketCounts?.length) {
    //         let visibleStatuses = statuses.map((status) => status?.label)
    //         visibleStatuses.unshift('All', 'Unresolved')
    //         this.$configuration.updateVisibleStatuses(visibleStatuses)
    //       }
    //     })
    //   },
    //   async fetchResourceFromFreshdesk(resourceFieldId: number): Array {
    //     let choices = new Array()
    //     await ApiCall.get(`admin/ticket_fields/${resourceFieldId}?include=section`).then(
    //       (response) => {
    //         choices = response?.choices
    //       }
    //     )
    //     return choices
    //   }
  }
})
</script>
