<template>
  <a-dialog :manual-open="showModal" @close="reset()">
    <template #content>
      <div
        :key="details?.id"
        class="w-11/12 md:w-8/12 bg-secondary-500 border-primary-500 border rounded-md p-5 m-auto"
        :class="[darkBackground ? 'text-white' : 'text-black', { 'is-loading': isLoading }]"
      >
        <div class="flex items-center justify-between w-full border-primary-500 border-b pb-2">
          <h1 class="text-3xl" v-text="title" />
          <span class="font-bold" v-text="details?.type" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-5 gap-5">
          <div class="flex flex-col">
            <span class="font-bold" v-text="'Opened by:'" />
            <a
              :href="requesterPageUrl"
              target="_blank"
              :title="'Requester'"
              class="bg-secondary-600 rounded-md py-1 px-2 h-full"
            >
              <span class="block w-full" v-text="requester?.name" />
              <span class="block text-sm italic" v-text="requester?.email" />
            </a>
          </div>

          <div class="flex flex-col">
            <span class="font-bold" v-text="'Status:'" />
            <span
              class="bg-secondary-600 rounded-md text-center font-bold text-xl p-3 h-full"
              v-text="status"
            />
          </div>

          <div class="flex flex-col">
            <span class="font-bold" v-text="'Tags:'" />
            <span class="bg-secondary-600 rounded-md p-2 text-center h-full" v-text="ticketTags" />
          </div>

          <div class="flex flex-col">
            <span class="font-bold" v-text="'Stats:'" />

            <div class="grid grid-cols-2 bg-secondary-600 rounded-md py-1 px-2 h-full">
              <span class="text-left" v-text="'Created:'" />
              <span class="text-right" v-text="fdate(details?.created_at)" />
              <span class="text-left" v-text="'Last update:'" />
              <span class="text-right" v-text="fdate(details?.updated_at)" />

              <template v-if="details.stats?.reopened_at">
                <span class="text-left" v-text="'Reopened at:'" />
                <span class="text-right" v-text="fdate(details?.stats?.reopened_at)" />
              </template>

              <template v-if="details.stats?.resolved_at">
                <span class="text-left" v-text="'Resolved at:'" />
                <span class="text-right" v-text="fdate(details?.stats?.resolved_at)" />
              </template>

              <template v-if="details.stats?.closed_at">
                <span class="text-left" v-text="'Closed at:'" />
                <span class="text-right" v-text="fdate(details?.stats?.closed_at)" />
              </template>
            </div>
          </div>

          <br />

          <div class="flex items-end">
            <a
              class="border-primary-600 bg-primary-500 rounded-md text-center border-none p-3 w-full mb-1"
              href="#"
              target="_blank"
              v-text="'Open in Freshdesk'"
            />
          </div>
        </div>

        <span class="text-base my-1 font-bold" v-text="'Description:'" />
        <div
          class="bg-white text-black p-5 rounded-lg overflow-y-scroll scrollbar-hide shadow-md shadow-primary-500"
          style="max-height: 50vh"
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
import ADialog from '@/components/General/ADialog.vue'

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
    darkBackground(): Boolean {
      return colorIsDark(import.meta.env.VITE_THEME_SECONDARY_COLOR)
    },
    requesterPageUrl(): String {
      return String(this.$store.domain).replace('api/v2/', 'a/contacts/' + this.requester?.id)
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

    fdate(date) {
      if (date) {
        return format(new Date(date), 'd. d. y')
      }
    },

    reset() {
      this.detailsTicketId = null
      this.$emit('modalClosed')
    }
  }
})
</script>
