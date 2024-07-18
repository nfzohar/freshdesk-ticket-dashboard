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
    let fields = await this.fetchTicketFieldsFromFreshdesk()

    setTimeout(() => {
      console.log(fields)
      this.$information?.setAdminTicketFields(fields)
      //this.$router.replace('/dashboard')
    }, 10000)
  },

  methods: {
    async fetchTicketFieldsFromFreshdesk() {
      let adminTicketFields = new Array()
      let tempFields = new Array()

      await ApiCall.get('admin/ticket_fields').then((response) => {
        tempFields = Object.values(response ?? [])
      })

      await tempFields?.forEach((ticketField) => {
        let index = ticketField?.label?.toLocaleLowerCase()
        let ticketFieldsRoute = `admin/ticket_fields/${ticketField?.id}?include=section`

        if (index == 'agent') {
          ticketFieldsRoute = 'agents?per_page=100'
        }
        if (index == 'group') {
          ticketFieldsRoute = 'groups?per_page=100'
        }

        ApiCall.get(ticketFieldsRoute).then((response) => {
          if (index == 'agent' && index == 'group') {
            ticketField['choices'] = Object.values(response ?? [])
          } else {
            ticketField['choices'] = Object.values(response?.choices ?? [])
          }
          adminTicketFields[index] = ticketField
        })
      })

      return adminTicketFields
    }
  }
})
</script>
