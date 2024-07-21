<template>
  <div class="dashboard-body flex flex-col">
    <div class="is-loading w-screen m-auto" />
    <span
      class="w-full text-center p-24 font-bold text-xl animate-pulse"
      v-text="`${message}...`"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'

export default defineComponent({
  name: 'FetchDataPage',

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
    storedTicketFields(): Array {
      return Object.values(this.$information?.storedAdminTicketFields)
    }
  },

  mounted() {
    this.fetchTicketFieldsFromFreshdesk()

    setTimeout(() => {
      this.message = 'Redirecting'
      this.$router.replace('/dashboard')
    }, 10000)
  },

  methods: {
    fetchTicketFieldsFromFreshdesk() {
      ApiCall.get('admin/ticket_fields')
        .then((response) => {
          if (response) {
            this.adminTicketFields = Object.values(response)
          }
        })
        .then(() => {
          this.fetchTicketFieldOptions()
        })
    },

    async fetchTicketFieldOptions() {
      this.adminTicketFields?.forEach((ticketField) => {
        let index = ticketField?.label?.toLocaleLowerCase()
        this.message = `Fetching options for ${index} ticket field`

        if (index == 'agent') {
          ApiCall.get('agents?per_page=100').then((response) => {
            ticketField['choices'] = Object.values(response ?? [])
          })
        } else if (index == 'group') {
          ApiCall.get('groups?per_page=100').then((response) => {
            ticketField['choices'] = Object.values(response ?? [])
          })
        } else {
          ApiCall.get(`admin/ticket_fields/${ticketField?.id}?include=section`).then((response) => {
            ticketField['choices'] = Object.values(response?.choices ?? [])
          })
        }
      })
    }
  }
})
</script>
