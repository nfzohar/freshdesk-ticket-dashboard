<template>
  <div :key="theTicket?.id" :class="` w-full ${primaryTextClass} ${isLoading ? 'is-loading' : ''}`">
    <div class="flex items-center justify-between w-full border-primary-500 border-b pb-2">
      <h1 class="text-3xl font-semibold" v-text="title" />
      <button
        class="primary-button py-1 px-3"
        :class="`${primaryTextClass} border-none`"
        @click.stop="$emit('closeDetails')"
        v-text="'Back'"
      />
    </div>

    <div
      class="flex flex-col sm:flex-row-reverse items-start justify-between gap-3 overflow-y-scroll h-auto py-3"
    >
      <div class="flex flex-col w-full sm:w-1/3">
        <span class="font-bold" v-text="'Ticket information'" />

        <div v-if="hasCustomFields" class="flex flex-col">
          <div class="flex flex-col bg-secondary-600 rounded-md p-3 h-full gap-y-1">
            <template v-for="(customField, s) in customFields" :key="s">
              <div v-if="customField?.value" class="grid grid-cols-2">
                <span class="text-left font-semibold capitalize" v-text="customField?.label" />
                <span class="text-right" v-text="customField?.value" />
              </div>
            </template>
          </div>
        </div>
      </div>

      <div
        class="block bg-white text-black w-full sm:w-2/3 h-full p-5 rounded-lg scrollbar-hide shadow-primary-500"
        v-html="ticketDescription"
      />
    </div>
  </div>

  <!-- <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 my-3 gap-5">
      <div>
        <span class="block w-full font-bold capitalize" v-text="'Opened by'" />

        <div class="bg-secondary-600 rounded-md p-3 text-left">
          <a :href="requesterPageUrl" target="_blank">
            <span class="block w-full font-semibold" v-text="requester?.name" />
            <span class="block text-sm italic" v-text="requester?.email" />
          </a>
        </div>
      </div>

      <div>
        <span class="block w-full font-bold capitalize" v-text="'Type'" />
        <div class="bg-secondary-600 rounded-md p-3 text-center">
          <span class="w-auto text-center font-semibold" v-text="theTicket?.type" />
        </div>
      </div>

      <div>
        <span class="block w-full font-bold capitalize" v-text="'Status'" />
        <div class="bg-secondary-600 rounded-md p-3 text-center">
          <span class="w-auto text-center font-semibold" v-text="status" />
        </div>
      </div>

      <div class="flex flex-col">
        <span class="font-bold capitalize" v-text="'Tags'" />
        <span class="bg-secondary-600 rounded-md p-3 text-center" v-text="ticketTags" />
      </div>

      <a
        class="border-primary-600 bg-primary-500 rounded-md text-center m-auto border-none p-3 w-full h-12"
        :href="ticketUrl"
        target="_blank"
        v-text="'Open in Freshdesk'"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 my-3 gap-5">
      <div class="flex flex-col">
        <span class="font-bold" v-text="'Stats:'" />
        <div
          class="grid grid-cols-2 md:grid-cols-1 xl:grid-cols-2 bg-secondary-600 rounded-md p-3 h-full gap-x-10"
        >
          <template v-for="(stat, s) in stats" :key="s">
            <div v-if="stat?.show" class="grid grid-cols-2">
              <span class="text-left font-semibold capitalize" v-text="stat?.label" />
              <span class="text-right" v-text="stat?.date" />
            </div>
          </template>
        </div>
      </div>

      <div v-if="hasCustomFields" class="flex flex-col xl:px-16">
        <span class="font-bold" v-text="'Custom Fields:'" />
        <div class="flex flex-col bg-secondary-600 rounded-md p-3 h-full gap-y-1">
          <template v-for="(customField, s) in customFields" :key="s">
            <div v-if="customField?.value" class="grid grid-cols-2">
              <span class="text-left font-semibold capitalize" v-text="customField?.label" />
              <span class="text-right" v-text="customField?.value" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <span class="text-base mb-2 font-bold" v-text="'Description:'" />
    <div
      class="bg-white text-black p-5 max-h-60vh rounded-lg overflow-y-scroll scrollbar-hide shadow-primary-500"
      v-html="ticketDescription"
    />
  </div> -->
</template>

<script lang="ts">
import { get } from 'lodash'
import { format } from 'date-fns'
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'

export default defineComponent({
  name: 'TicketDetails',

  emits: ['closeDetails'],

  props: {
    ticketId: {
      type: Number,
      required: false,
      default: null
    }
  },

  data() {
    return {
      theTicket: [],
      isLoading: true
    }
  },

  mounted() {
    if (this.ticketId) {
      this.fetchTicket()
    }
  },

  computed: {
    requester(): Object {
      return this.theTicket?.requester
    },
    ticketDescription(): String {
      return this.theTicket?.description
    },
    ticketTags(): String {
      return this.theTicket?.tags?.toString()
    },
    title(): String {
      return `#${this.theTicket?.id}: ${this.theTicket?.subject}`
    },
    status(): String {
      let statuses = Object.values(this.$information?.statuses)

      let status = statuses?.filter((status) => status?.id == this.theTicket?.status)
      return get(status, '[0].label') ?? 'Undefined'
    },
    primaryTextClass(): String {
      return this.$information?.textOnPrimaryColor
    },
    freshdeskWebUrl() {
      return String(this.$auth.domain).replace('api/v2/', 'a/')
    },
    requesterPageUrl(): string {
      return `${this.freshdeskWebUrl}contacts/${this.requester?.id}`
    },
    ticketUrl(): string {
      return `${this.freshdeskWebUrl}tickets/${this.theTicket?.id}`
    },
    hasCustomFields() {
      return Object.values(this.theTicket?.custom_fields ?? []).length > 0
    },
    customFields(): Array {
      let ticketCustomFields = Array()

      Object.keys(this.theTicket.custom_fields).forEach((customField) => {
        let aCustomField = {
          label: customField.replace('cf_', '').replace('_', ' '),
          value: this.theTicket?.custom_fields[customField]
        }

        ticketCustomFields.push(aCustomField)
      })

      return ticketCustomFields
    },

    ticketFields() {
      return [
        {
          label: 'Created',
          date: this.fdate(this.theTicket?.created_at)
        }
      ]
    },

    stats(): Array {
      return [
        {
          show: true,
          label: 'Created',
          date: this.fdate(this.theTicket?.created_at)
        },
        {
          show: true,
          label: 'Last update',
          date: this.fdate(this.theTicket?.updated_at)
        },
        {
          show: this.theTicket.stats?.reopened_at ? true : false,
          label: 'Reopened at',
          date: this.fdate(this.theTicket?.stats?.reopened_at)
        },
        {
          show: this.theTicket.stats?.resolved_at ? true : false,
          label: 'Resolved at',
          date: this.fdate(this.theTicket?.stats?.resolved_at)
        },
        {
          show: this.theTicket.stats?.closed_at ? true : false,
          label: 'Closed at',
          date: this.fdate(this.theTicket?.stats?.closed_at)
        }
      ]
    }
  },

  methods: {
    fetchTicket() {
      ApiCall.get(`/tickets/${this.ticketId}?include=requester,company,stats`)
        .then((ticketObject) => {
          this.theTicket = ticketObject
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    fdate(date: String) {
      return date ? format(new Date(date), 'd. M. y') : '-'
    }
  }
})
</script>
