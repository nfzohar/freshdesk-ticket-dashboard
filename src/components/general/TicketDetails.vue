<template>
  <div class="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-line">
    <div class="flex items-start gap-2 min-w-0">
      <button
        v-if="showBackButton"
        class="actions-button shrink-0"
        :title="'Back to the ticket list'"
        @click.stop="$emit('closeDetails')"
      >
        <i class="fa fa-arrow-left" />
      </button>
      <div class="min-w-0">
        <span class="chip tabular-nums" v-text="`#${theTicket?.id ?? ''}`" />
        <h3 class="mt-1.5 text-lg font-semibold leading-snug" v-text="theTicket?.subject" />
      </div>
    </div>

    <a
      class="btn-secondary shrink-0"
      :href="ticketUrl"
      :target="'_blank'"
      rel="noopener"
      :title="'For more information, open this ticket in your Freshdesk.'"
    >
      <span v-text="'Open in Freshdesk'" />
      <i class="fa fa-arrow-up-right-from-square text-xs" />
    </a>
  </div>

  <div :key="theTicket?.id" :class="['w-full pt-4', { 'is-loading min-h-[40vh]': isLoading }]">
    <div class="flex flex-col lg:flex-row items-start gap-5">
      <!-- Ticket HTML is sanitized; kept on a light "paper" surface since email markup assumes it. -->
      <div
        class="w-full lg:flex-1 max-h-[65vh] overflow-y-auto rounded-xl border border-line bg-white p-5 text-sm text-neutral-900"
        v-html="ticketDescription"
      />

      <dl class="w-full lg:w-72 shrink-0 grid grid-cols-2 lg:grid-cols-1 gap-3">
        <template v-for="(field, f) in ticketFields" :key="f">
          <div v-if="field?.show" class="rounded-lg bg-surface-2/70 px-3 py-2">
            <dt class="text-xs font-medium text-ink-muted capitalize" v-text="field?.label" />
            <dd class="mt-0.5 flex items-center gap-2 text-sm">
              <span class="truncate" v-text="field?.value ?? 'N/A'" />
              <a
                v-if="field?.url"
                class="text-ink-muted hover:text-ink"
                :href="field?.url"
                :target="'_blank'"
                rel="noopener"
                :title="`Open ${field?.label} in Freshdesk`"
              >
                <i class="fa fa-arrow-up-right-from-square text-xs" />
              </a>
            </dd>
          </div>
        </template>

        <div
          v-for="(field, f) in customFields"
          :key="`cf-${f}`"
          class="rounded-lg bg-surface-2/70 px-3 py-2"
        >
          <dt class="text-xs font-medium text-ink-muted capitalize" v-text="field?.label" />
          <dd class="mt-0.5 text-sm truncate" v-text="field?.value ?? 'N/A'" />
        </div>
      </dl>
    </div>
  </div>
</template>

<script lang="ts">
import { get } from 'lodash'
import DOMPurify from 'dompurify'
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
    },
    showBackButton: {
      type: Boolean,
      required: false,
      default: true
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
      return DOMPurify.sanitize(this.theTicket?.description ?? '')
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
