<template>
  <div class="dashboard-body is-loading" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import { id } from 'date-fns/locale'

export default defineComponent({
  name: 'LoadDataPage',

  async mounted() {
    await this.fetchAgentsFromFreshdesk()
    await this.fetchGroupsFromFreshdesk()
    await this.fetchTicketFieldsFromFreshdesk()

    setTimeout(() => {
      this.$information.saveConfigurationToStore()
      this.$router.replace('/dashboard')
    }, 1000)
  },

  methods: {
    async fetchGroupsFromFreshdesk() {
      let groups = []

      await ApiCall.get('groups?per_page=100')
        .then((response) => {
          if (response) {
            groups = Object.values(response)
          }
        })
        .finally(() => {
          this.$information.setGroups(groups)
        })
    },

    async fetchAgentsFromFreshdesk() {
      let agents = []

      await ApiCall.get('agents?per_page=100')
        .then((response) => {
          if (response) {
            agents = Object.values(response)
          }
        })
        .finally(() => {
          this.$information.setAgents(agents)
        })
    },

    async fetchTicketFieldsFromFreshdesk() {
      let statusFieldId = null
      let sourcesFieldId = null
      let prioritiesFieldId = null

      await ApiCall.get('admin/ticket_fields').then((response) => {
        if (response) {
          Object.values(response).forEach(async (adminField) => {
            switch (adminField?.name) {
              case 'status':
                statusFieldId = adminField?.id
                break
              case 'priority':
                prioritiesFieldId = adminField?.id
                break
              case 'source':
                sourcesFieldId = adminField?.id
                break
            }
          })
        }
      })

      let priorities = await this.fetchResourceFromFreshdesk(prioritiesFieldId)
      this.$information.setPriorities(priorities)

      let sources = await this.fetchResourceFromFreshdesk(sourcesFieldId)
      this.$information?.setSources(sources)

      await this.fetchStatusesFromFreshdesk(statusFieldId)
    },

    async fetchStatusesFromFreshdesk(statusFieldId: number) {
      await ApiCall.get(`admin/ticket_fields/${statusFieldId}?include=section`).then((response) => {
        let statuses = response?.choices
        this.$information.setStatuses(statuses)

        if (!this.$configuration.visibleTicketCounts?.length) {
          let visibleStatuses = statuses.map((status) => status?.label)
          visibleStatuses.unshift('All', 'Unresolved')

          this.$configuration.updateVisibleStatuses(visibleStatuses)
        }
      })
    },

    async fetchResourceFromFreshdesk(resourceFieldId: number): Array {
      let choices = new Array()

      await ApiCall.get(`admin/ticket_fields/${resourceFieldId}?include=section`).then(
        (response) => {
          choices = response?.choices
        }
      )
      return choices;
    }
  }
})
</script>
