<template>
  <div class="flex items-center justify-between w-80vh border-primary-500 border-b pb-2">
    <h1 class="text-3xl font-semibold" v-text="title" />
    <button
      :class="`primary-button py-1 px-3 border-none ${primaryTextClass}`"
      @click.stop="$emit('closeDetails')"
      v-text="'Back'"
    />
  </div>

  <div
    :key="theTicket?.id"
    :class="`w-full scrollbar-hide overflow-y-scroll h-full ${secondaryTextClass} ${
      isLoading ? 'is-loading' : ''
    }`"
  >
    <div :class="`flex md:flex-row-reverse items-start gap-5 h-full py-3 ${secondaryTextClass}`">
      <div class="w-full sm:w-3/12 h-80vh scrollbar-hide overflow-y-scroll">
        <template v-for="(field, f) in ticketFields" :key="f">
          <div v-if="field?.show" class="py-1">
            <span class="block w-full font-bold capitalize" v-text="field?.label" />
            <div :class="`rounded-md p-3 text-center ${secondaryBgAccentColor}`">
              <span class="w-auto text-center font-semibold" v-text="field?.value" />
            </div>
          </div>
        </template>

        <div v-for="(field, f) in customFields" :key="f" class="py-1">
          <span class="block w-full font-bold capitalize" v-text="field?.label" />
          <div :class="`rounded-md p-3 text-center ${secondaryBgAccentColor}`">
            <span class="w-auto text-center font-semibold" v-text="field?.value" />
          </div>
        </div>

        <a
          :href="ticketUrl"
          :target="'_blank'"
          :class="`block w-full text-center primary-button my-2 py-1 px-3 border-none ${primaryTextClass}`"
          v-text="'Open in Freshdesk'"
        />
      </div>

      <div
        class="block bg-white text-black w-full h-80vh scrollbar-hide overflow-y-scroll sm:w-9/12 p-5 rounded-lg scrollbar-hide shadow-primary-500"
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
      this.fetchTicket()
    }
  },

  computed: {
    ticketDescription(): String {
      return this.theTicket?.description
    },
    title(): String {
      return `#${this.theTicket?.id}: ${this.theTicket?.subject}`
    },
    status(): String {
      return this.findValueOf(
        this.$information?.storedStatuses,
        this.theTicket?.status,
        'label',
        'id'
      )
    },
    source(): String {
      return this.findValueOf(
        this.$information?.storedSources,
        this.theTicket?.source,
        'label',
        'id'
      )
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
    allTicketsOfRequesterPageUrl(): string {
      return `${this.freshdeskWebUrl}contacts/${this.theTicket?.requester?.id}`
    },
    ticketUrl(): string {
      return `${this.freshdeskWebUrl}tickets/${this.theTicket?.id}`
    },
    ticketFields() {
      return [
        {
          show: true,
          label: 'Type',
          value: this.theTicket?.requester?.name
        },
        {
          show: true,
          label: 'Requester',
          value: this.theTicket?.requester?.name
        },
        {
          show: true,
          label: 'Tags',
          value: this.theTicket?.tags?.toString()
        },
        {
          show: true,
          label: 'Status',
          value: this.status
        },
        {
          show: true,
          label: 'Source',
          value: this.source
        },
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
        .catch((e) => {
          this.$emit('closeDetails')
        })
    },

    fdate(date: String, dateFormat = 'd. M. y') {
      return date ? format(new Date(date), dateFormat) : '-'
    },

    findValueOf(
      listOfValues: Object,
      searchValue: String,
      returnvalue: String,
      compareValue = 'value'
    ) {
      let all = Object.values(listOfValues)
      let result = all?.filter((item) => item[compareValue] == searchValue)

      return get(result, `[0].${returnvalue}`) ?? 'N/A'
    }
  }
})
</script>
