<template>
  <a-dialog :manual-open="open">
    <template #trigger>
      <button class="actions-button" :title="'Help'" @click="open = true">
        <i class="fa fa-question-circle" />
      </button>
    </template>

    <template #content>
      <div
        class="m-auto w-8/12 bg-secondary-500 h-80vh overflow-y-scroll border-primary-500 border rounded-md p-5"
        :class="'text-white'"
      >
        <h1 class="text-2xl font-bold cursor-pointer" v-text="'Help'" />
        <hr class="my-2 border-t-primary-500" />

        <div class="flex flex-col">
          <a-section :section-title="'About'">
            <p>
              This application was built with the intent of helping admins setup a quick and simple
              statistics overview. It was designed with general use in mind, to provide as much
              ticket count statistics as possible.
            </p>
          </a-section>

          <a-section :section-title="'Layout'" body-class="flex flex-col gap-4 p-5">
            <p>
              The layout consists of multiple configurable panels (Type, Tags, Groups...). Panels
              are grouped into rows or columns, depending on the currently selected layout.
            </p>
            <i>
              The layout can be modified through the
              <a href="/setup"><u v-text="'Configuration wizard'" /></a>, found in the Settings
              form.
            </i>
          </a-section>

          <a-section :section-title="'Configuration wizard'" body-class="flex flex-col gap-4 p-5">
            <p>
              The configuration wizard walks you through elements that make up the layout, including
              selecting a prefered dashboard layout (rows, colums, carousel...) and configuring
              panels in the selected layout.
            </p>
            <i> It also allows updating automatic refresh settings and dashboard properties. </i>
          </a-section>

          <a-section :section-title="'Filters'" body-class="flex flex-col gap-4 p-5">
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

          <a-section :section-title="'Other'" body-class="flex flex-col gap-4 p-5">
            <div>
              <h1 class="font-bold" v-text="'Excel export'" />
              <p v-text="'All loaded tickets can be exported into an Excel file.'" />
            </div>
            <div>
              <h1 class="font-bold" v-text="'View tickets'" />
              <p v-text="'View a list of all tickets and view ticket details.'" />
            </div>
            <div>
              <h1 class="font-bold" v-text="'Graph of open/closed tickets'" />
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
