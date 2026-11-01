<template>
  <a-dialog
    :manual-open="open"
    size="lg"
    icon="fa fa-circle-question"
    :title="'Help'"
    :subtitle="'How the dashboard works.'"
  >
    <template #trigger>
      <button class="actions-button" :title="'Help'" @click="open = true">
        <i class="fa fa-circle-question" />
      </button>
    </template>

    <template #content>
      <div class="text-sm leading-relaxed">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a-section :section-title="'About'" body-class="text-ink-muted">
            <p>
              This application was built with the intent of helping admins setup a quick and simple
              statistics overview. It was designed with general use in mind, to provide as much
              ticket count statistics as possible.
            </p>
          </a-section>

          <a-section :section-title="'Layout'" body-class="flex flex-col gap-3 text-ink-muted">
            <p>
              The layout consists of configurable panels (Type, Tags, Groups...) arranged on a grid.
            </p>
            <p>
              Use <b class="text-ink" v-text="'Edit layout'" /> in the toolbar to move panels by
              dragging them, resize them from their bottom-right corner, and add or remove panels.
              Changes apply when you save.
            </p>
          </a-section>

          <a-section
            :section-title="'Setup wizard'"
            body-class="flex flex-col gap-3 text-ink-muted"
          >
            <p>
              The setup wizard covers automatic refresh, leaderboards and the layout type: a free
              grid, or a carousel that rotates through the panels.
            </p>
            <i>It can be rerun from the Settings dialog.</i>
          </a-section>

          <a-section :section-title="'Filters'" body-class="flex flex-col gap-3 text-ink-muted">
            <p>
              The filters form allows filtering by any of your freshdesk's ticket fields. With the
              exception of date filters, all filters are generated from ticet fields, present in
              your freshdesk instance.
            </p>
            <i>
              At current, it is only possible to filter tickets by a single field at a time. A
              solution is in the works.</i
            >
          </a-section>

          <a-section
            :section-title="'Other'"
            class="md:col-span-2"
            body-class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-ink-muted"
          >
            <div>
              <h4 class="font-medium text-ink" v-text="'Excel export'" />
              <p v-text="'All loaded tickets can be exported into an Excel file.'" />
            </div>
            <div>
              <h4 class="font-medium text-ink" v-text="'View tickets'" />
              <p v-text="'View a list of all tickets and view ticket details.'" />
            </div>
            <div>
              <h4 class="font-medium text-ink" v-text="'Graph of open/closed tickets'" />
              <p v-text="'View a graph of all open and closed tickets by year.'" />
            </div>
          </a-section>
        </div>
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ADialog from '@/components/general/ADialog.vue'
import ASection from '@/components/general/ASection.vue'

export default defineComponent({
  name: 'HelpSection',

  components: { ADialog, ASection },

  data() {
    return { open: true }
  }
})
</script>
