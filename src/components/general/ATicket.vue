<template>
  <article
    :title="'Show details'"
    class="group cursor-pointer rounded-xl border border-line bg-surface p-4 transition hover:border-primary/60 hover:bg-surface-2/60"
  >
    <template v-if="mode == 'panel-content'">
      <h3 class="truncate text-sm font-semibold" :title="subject" v-text="subject" />

      <div class="mt-1 flex flex-col text-xs text-ink-muted">
        <span class="truncate"
          >Submitted by <span class="text-ink">{{ requester }}</span></span
        >
        <span v-if="tags?.length" class="truncate">Tags: {{ tags }}</span>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-1.5">
        <span title="Ticket status" class="chip">
          <span class="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden="true" />
          {{ status }}
        </span>
        <span title="Ticket type" class="chip" v-text="type" />
      </div>
    </template>

    <template v-else>
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div class="min-w-0">
          <h3 class="text-sm font-semibold">
            <span class="text-ink-muted tabular-nums" v-text="`#${id}`" />
            {{ subject }}
          </h3>
          <div class="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-muted">
            <span
              >Submitted by <span class="text-ink">{{ requester }}</span></span
            >
            <span v-if="tags?.length">Tags: {{ tags }}</span>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-1.5">
          <span title="Ticket status" class="chip">
            <span class="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden="true" />
            {{ status }}
          </span>
          <span title="Ticket type" class="chip" v-text="type" />
        </div>
      </div>
    </template>
  </article>
</template>

<script lang="ts">
import { get } from 'lodash'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ATicket',

  props: {
    theTicket: {
      type: Object,
      required: false,
      default: () => {}
    },
    mode: {
      type: String,
      required: false,
      default: 'list-item'
    }
  },

  computed: {
    id() {
      return this.theTicket?.id ?? 0
    },
    type() {
      return this.theTicket?.type ?? 'Ticket'
    },
    subject() {
      return this.theTicket?.subject ?? 'New ticket'
    },
    requester() {
      return this.theTicket?.requester?.name ?? 'Not set'
    },
    tags() {
      return this.theTicket?.tags?.length ? this.theTicket?.tags?.join(', ') : 'None'
    },
    primaryColorDarkt(): string {
      return this.$information?.textOnPrimaryColor
    },
    storedStatuses(): Array<any> {
      return Object.values(this.$information?.storedStatuses)
    },
    status(): string {
      let status = this.storedStatuses?.filter((status) => status?.id == this.theTicket?.status)
      return get(status, '[0].label') ?? 'N/A'
    },
    primaryColorText(): string {
      return `text-${this.$information?.isPrimaryColorDark ? 'white' : 'black'}`
    },
    primaryAccentedBg(): string {
      return this.$information?.isPrimaryColorDark ? 'bg-primary-600' : 'bg-primary-400'
    }
  }
})
</script>
