<template>
  <div class="flex items-start justify-between w-80vh border-primary-500 border-b pb-2">
    <h1 class="text-3xl font-semibold" v-text="`#${theTicket?.id}: ${theTicket?.subject}`" />
    <button
      :class="`primary-button py-1 px-3 hover:font-bold border-none ${primaryTextClass}`"
      @click.stop="$emit('closeDetails')"
      v-text="'Back'"
    />
  </div>

  <div
    :key="theTicket?.id"
    :class="[
      `w-full scrollbar-hide overflow-y-scroll h-full`,
      { 'is-loading': isLoading },
      secondaryTextClass
    ]"
  >
    <div
      :class="`flex flex-col md:flex-row-reverse items-start gap-5 h-full py-3 ${secondaryTextClass}`"
    >
      <div
        class="grid grid-cols-3 gap-3 md:block w-full md:w-3/12 h-80vh scrollbar-hide overflow-y-scroll"
      >
        <template v-for="(field, f) in ticketFields" :key="f">
          <div v-if="field?.show" class="py-1">
            <span class="block w-full font-bold capitalize" v-text="field?.label" />

            <div :class="`rounded-md p-3 text-center ${secondaryBgAccentColor}`">
              <span class="w-auto text-center font-semibold" v-text="field?.value ?? 'N/A'" />
              <a
                v-if="field?.url"
                :class="'mx-2 hover:text-primary-500'"
                :href="field?.url"
                :target="'_blank'"
              >
                <i class="fa fa-external-link" />
              </a>
            </div>
          </div>
        </template>

        <div v-for="(field, f) in customFields" :key="f" class="py-1">
          <span class="w-full font-bold capitalize" v-text="field?.label" />
          <div :class="`rounded-md p-3 text-center ${secondaryBgAccentColor}`">
            <span class="w-auto text-center font-semibold" v-text="field?.value ?? 'N/A'" />
          </div>
        </div>
        <a
          class="block w-full text-center hover:text-primary-500 hover:font-bold mt-5 text-base px-1"
          :href="ticketUrl"
          :target="'_blank'"
          :title="'For more information, open this ticket in your Freshdesk.'"
          v-html="`View ticket in Freshdesk <i class='fa fa-external-link' />`"
        />
      </div>

      <div
        class="block bg-white text-black w-full h-80vh scrollbar-hide overflow-y-scroll md:w-9/12 p-5 rounded-lg scrollbar-hide"
        v-html="ticketDescription"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { get } from 'lodash'
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import { fdate } from '@/helpers/CommonMethods'

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
    ticketUrl(): string {
      return `${this.freshdeskWebUrl}tickets/${this.theTicket?.id}`
    },
    status(): String {
      let statuses = this.$information?.storedStatuses
      return this.findValueOf(statuses, this.theTicket?.status, 'label')
    },
    source(): String {
      let sources = this.$information?.storedSources
      return this.findValueOf(sources, this.theTicket?.source, 'label')
    },
    priority(): String {
      let prorities = this.$information?.storedPriorities
      return this.findValueOf(prorities, this.theTicket?.priority, 'label', 'value')
    },
    customFields(): Array {
      let customFieldsList = new Array()

      if (this.theTicket?.custom_fields) {
        customFieldsList = Object.keys(this.theTicket?.custom_fields)?.map((field) => {
          return {
            label: field.replace('cf_', '').replace('_', ' '),
            value: this.theTicket?.custom_fields[field]
          }
        })
      }
      return customFieldsList
    },
    ticketFields(): Array {
      return [
        {
          show: true,
          label: 'Requester',
          value: this.theTicket?.requester?.name,
          url: `${this.freshdeskWebUrl}contacts/${this.theTicket?.requester?.id}`
        },
        {
          show: true,
          label: 'Type',
          value: this.theTicket?.type
        },
        {
          show: true,
          label: 'Status',
          value: this.status
        },
        {
          show: true,
          label: 'Priority',
          value: this.priority
        },
        {
          show: true,
          label: 'Source',
          value: this.source
        },
        {
          show: true,
          label: 'Tags',
          value: this.theTicket?.tags?.toString()
        },
        {
          show: this.theTicket?.ticket_cc_emails?.length,
          label: 'CC Emails',
          value: this.theTicket?.ticket_cc_emails?.join('\n')
        },
        {
          show: true,
          label: 'Created',
          value: fdate(this.theTicket?.created_at, 'd. M. y - HH:mm')
        },
        {
          show: true,
          label: 'Last updated',
          value: fdate(this.theTicket?.updated_at, 'd. M. y - HH:mm')
        },
        {
          show: this.theTicket.stats?.reopened_at ? true : false,
          label: 'Reopened at',
          value: fdate(this.theTicket?.stats?.reopened_at, 'd. M. y - HH:mm')
        },
        {
          show: this.theTicket.stats?.resolved_at ? true : false,
          label: 'Resolved at',
          value: fdate(this.theTicket?.stats?.resolved_at, 'd. M. y - HH:mm')
        },
        {
          show: this.theTicket.stats?.closed_at ? true : false,
          label: 'Closed at',
          value: fdate(this.theTicket?.stats?.closed_at, 'd. M. y - HH:mm')
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
        .catch((e) => {
          this.$emit('closeDetails')
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    findValueOf(
      listOfValues: Object,
      searchValue: String,
      returnvalue: String,
      compareValue = 'id'
    ) {
      let all = Object.values(listOfValues)
      let result = all?.filter((item) => item[compareValue] == searchValue)

      return get(result, `[0].${returnvalue}`) ?? 'N/A'
    }
  }
})
</script>
