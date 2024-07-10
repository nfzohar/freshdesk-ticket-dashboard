<template>
  <div
    :key="theTicket?.id"
    :class="` w-full ${secondaryTextClass} ${isLoading ? 'is-loading' : ''}`"
  >
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
      :class="`flex md:flex-row-reverse items-start gap-5 overflow-y-scroll scrollbar-hide h-full py-3 ${secondaryTextClass}`"
    >
      <div class="w-full sm:w-1/3">
        <span class="font-bold" v-text="'Ticket details'" />
        <hr class="border-primary-500 my-2" />

        <template v-for="(field, f) in ticketFields" :key="f">
          <div v-if="field?.show">
            <span class="block w-full font-bold capitalize" v-text="field?.label" />
            <div :class="`rounded-md p-3 text-center ${secondaryBgAccentColor}`">
              <span class="w-auto text-center font-semibold" v-text="field?.value" />
            </div>
          </div>
        </template>

        <div v-for="(field, f) in customFields" :key="f">
          <span class="block w-full font-bold capitalize" v-text="field?.label" />
          <div :class="`rounded-md p-3 text-center ${secondaryBgAccentColor}`">
            <span class="w-auto text-center font-semibold" v-text="field?.value" />
          </div>
        </div>
      </div>

      <div
        class="block bg-white text-black w-full sm:w-2/3 h-full p-5 rounded-lg scrollbar-hide shadow-primary-500"
        v-html="ticketDescription"
      />
    </div>
  </div>
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
      try {
        this.fetchTicket()
      } catch (e) {
        //this.$emit('closeDetails')
      }
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
    secondaryTextClass(): String {
      return this.$information?.textOnSecondaryColor
    },
    secondaryBgAccentColor(): String {
      return this.$information?.bgAccentSecondaryColor
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
    ticketFields() {
      return [
        {
          show: true,
          label: 'Created',
          value: this.fdate(this.theTicket?.created_at)
        },
        {
          show: true,
          label: 'Last update',
          value: this.fdate(this.theTicket?.updated_at)
        },
        {
          show: this.theTicket.stats?.reopened_at ? true : false,
          label: 'Reopened at',
          value: this.fdate(this.theTicket?.stats?.reopened_at)
        },
        {
          show: this.theTicket.stats?.resolved_at ? true : false,
          label: 'Resolved at',
          value: this.fdate(this.theTicket?.stats?.resolved_at)
        },
        {
          show: this.theTicket.stats?.closed_at ? true : false,
          label: 'Closed at',
          value: this.fdate(this.theTicket?.stats?.closed_at)
        }
      ]
    },
    customFields(): Array {
      let customFieldsList = []

      if (this.theTicket?.custom_fields) {
        customFieldsList = Object.keys(this.theTicket?.custom_fields)?.map((field) => {
          return {
            label: field.replace('cf_', '').replace('_', ' '),
            value: this.theTicket?.custom_fields[field] ?? 'N/A'
          }
        })
      }
      return customFieldsList
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

    fdate(date: String, dateFormat = 'd. M. y') {
      return date ? format(new Date(date), dateFormat) : '-'
    }
  }
})
</script>
