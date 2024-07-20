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

  computed: {
    storedTicketFields(): Object {
      return this.$information?.storedAdminTicketFields
    }
  },

  async mounted() {
    await this.fetchTicketFieldsFromFreshdesk()
    await this.fetchTicketFieldOptions()
    console.log(this.storedTicketFields)

    // setTimeout(() => {
    //   console.log(fields)
    //   //this.$router.replace('/dashboard')
    // }, 10000)
  },

  methods: {
    async fetchTicketFieldsFromFreshdesk() {
      await ApiCall.get('admin/ticket_fields').then((response) => {
        if (response) {
          this.$information?.setAdminTicketFields(response)
        }
      })
    },

    async fetchTicketFieldOptions() {
      let adminTicketFields = new Array()
      //this.message = 'Loading ticket field options'

      await Object.values(this.storedTicketFields)?.forEach((ticketField) => {
        let index = ticketField?.label?.toLocaleLowerCase()
        let ticketFieldsRoute = ''

        switch (index) {
          case 'agent':
            ticketFieldsRoute = 'agents?per_page=100'
            break
          case 'group':
            ticketFieldsRoute = 'groups?per_page=100'
            break
          default:
            ticketFieldsRoute = `admin/ticket_fields/${ticketField?.id}?include=section`
            break
        }

        ApiCall.get(ticketFieldsRoute).then((response) => {
          if (index == 'agent' && index == 'group') {
            ticketField['choices'] = Object.values(response ?? [])
          } else {
            ticketField['choices'] = Object.values(response?.choices ?? [])
          }
        })

        adminTicketFields[index] = ticketField
      })

      this.$information?.setAdminTicketFields(adminTicketFields)
    }
  }
})
</script>
