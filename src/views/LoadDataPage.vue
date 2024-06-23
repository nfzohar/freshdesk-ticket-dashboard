<template>
  <div class="dashboard-body">
    <div class="m-auto w-min align-middle mt-44 animate-spin">
      <logo-icon pt-width="300" pt-height="300" class="shadow-lg rounded-full" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import LogoIcon from '@/components/general/TheLogo.vue'

export default defineComponent({
  name: 'LoadDataPage',

  components: { LogoIcon },

  async mounted() {
    await this.fetchAgentsFromFreshdesk()
    await this.fetchGroupsFromFreshdesk()
    await this.fetchStatusesFromFreshdesk()

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

    async fetchStatusesFromFreshdesk() {
      let statusFieldId = null

      await ApiCall.get('admin/ticket_fields').then((response) => {
        if (response) {
          Object.values(response).forEach(async (adminField) => {
            if (adminField?.name == 'status') {
              statusFieldId = adminField?.id
            }
          })
        }
      })

      await ApiCall.get(`admin/ticket_fields/${statusFieldId}?include=section`).then((response) => {
        let statuses = response?.choices
        this.$information.setStatuses(statuses)

        if (!this.$information.visibleTicketCounts?.length) {
          let statusLabels = statuses.map((status) => status?.label).unshift('All', 'Unresolved')
          this.$configuration.updateVisibleStatuses(statusLabels)
        }
      })
    }
  }
})
</script>
