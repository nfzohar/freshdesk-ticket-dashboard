<template>
  <a-dialog :manual-open="showModal" @close="reset()">
    <template #content>
      <div
        :key="details?.id"
        class="w-11/12 md:w-9/12 bg-secondary-500 border-primary-500 border rounded-md p-7 m-auto"
        :class="[{ 'is-loading': isLoading }, darkBackground ? 'text-white' : 'text-black']"
      >
        <div class="flex items-center justify-between w-full border-primary-500 border-b pb-2">
          <h1 class="text-3xl font-semibold" v-text="title" />
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 my-3 gap-5">
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
              <span class="w-auto text-center font-semibold" v-text="details?.type" />
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
          class="bg-white text-black p-5 rounded-lg overflow-y-scroll scrollbar-hide shadow-primary-500"
          style="max-height: 60vh"
          v-html="details?.description"
        />
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { format } from 'date-fns'
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import { colorIsDark } from '@/helpers/CommonMethods'
import ADialog from '@/components/general/ADialog.vue'

export default defineComponent({
  name: 'TheDashboard',

  components: {
    ADialog
  },

  emits: ['modalClosed'],

  props: {
    ticketId: {
      type: Number,
      required: false,
      default: null
    }
  },

  data() {
    return {
      details: [],
      isLoading: true,
      detailsTicketId: null
    }
  },

  watch: {
    detailsTicketId() {
      this.fetchTicket()
    }
  },

  computed: {
    requester() {
      return this.details?.requester
    },
    ticketTags() {
      return this.details?.tags?.toString()
    },
    showModal() {
      return this.detailsTicketId ? true : false
    },
    statuses(): Object {
      return this.$dashboard?.statuses ?? []
    },
    status() {
      let label = 'Undefined'

      Object.values(this.statuses)?.forEach((status) => {
        if (status.id == this.details?.status) {
          label = status?.label
        }
      })
      return label
    },
    title() {
      return '#' + this.details?.id + ': ' + this.details?.subject
    },
    darkBackground() {
      return Boolean(colorIsDark(import.meta.env.VITE_THEME_SECONDARY_COLOR))
    },
    freshdeskWebUrl() {
      return String(this.$auth.domain).replace('api/v2/', 'a/')
    },
    requesterPageUrl(): string {
      return this.freshdeskWebUrl + 'contacts/' + this.requester?.id
    },
    ticketUrl(): string {
      return this.freshdeskWebUrl + 'tickets/' + this.details?.id
    },
    hasCustomFields() {
      return Object.values(this.details?.custom_fields ?? []).length > 0
    },
    customFields() {
      let ticketCustomFields = Array()

      Object.keys(this.details.custom_fields).forEach((customField) => {
        let aCustomField = {
          label: customField.replace('cf_', '').replace('_', ' '),
          value: this.details?.custom_fields[customField]
        }

        ticketCustomFields.push(aCustomField)
      })

      return ticketCustomFields
    },
    stats() {
      return [
        {
          show: true,
          label: 'Created',
          date: this.fdate(this.details?.created_at)
        },
        {
          show: true,
          label: 'Last update',
          date: this.fdate(this.details?.updated_at)
        },
        {
          show: this.details.stats?.reopened_at ? true : false,
          label: 'Reopened at',
          date: this.fdate(this.details?.stats?.reopened_at)
        },
        {
          show: this.details.stats?.resolved_at ? true : false,
          label: 'Resolved at',
          date: this.fdate(this.details?.stats?.resolved_at)
        },
        {
          show: this.details.stats?.closed_at ? true : false,
          label: 'Closed at',
          date: this.fdate(this.details?.stats?.closed_at)
        }
      ]
    }
  },

  async mounted() {
    this.detailsTicketId = this.ticketId
  },

  methods: {
    fetchTicket() {
      if (this.detailsTicketId) {
        ApiCall.get('/tickets/' + this.detailsTicketId + '?include=requester,company,stats')
          .then((ticketDetails) => {
            this.details = ticketDetails
          })
          .then(() => {
            this.isLoading = false
          })
      }
    },

    fdate(date: String) {
      return date ? format(new Date(date), 'd. M. y') : '-'
    },

    reset() {
      this.detailsTicketId = null
      this.$emit('modalClosed')
    }
  }
})
</script>
