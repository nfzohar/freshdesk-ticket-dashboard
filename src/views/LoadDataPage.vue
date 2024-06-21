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

    this.$router.replace('/dashboard')
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

    async fetchStatusesFromFreshdesk() {},

    async fetchTicketFieldOptions(filterId) {
      await ApiCall.get('admin/ticket_fields/' + filterId + '?include=section').then((response) => {
        let filter = response

        if (filter) {
          if (filter.name == 'agent') {
            filter['choices'] = this.$dashboard?.storedAgents
          }
          if (filter.name == 'group') {
            filter['choices'] = this.$dashboard?.storedGroups
          }

          this.filters.push(filter)

          if (filter.name == 'status') {
            this.$dashboard.statuses = filter?.choices

            filter.choices = filter?.choices?.map((option) => {
              return { label: option?.label, value: option?.id }
            })
          }

          if (filter.name == 'ticket_type') {
            filter.name = 'type'
          }
        }
      })
  }
})
</script>
