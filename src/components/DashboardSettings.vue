<template>
  <a-dialog>
    <template #trigger>
      <settings-icon class="cursor-pointer" />
    </template>

    <template #content>
      <div
        class="m-auto w-8/12 bg-secondary-500 border-primary-500 border rounded-md p-5 mt-10"
        :class="'text-white'"
      >
        <div class="bg-secondary-500 z-100 w-full p-4">
          <h1 class="w-full border-b font-bold mb-2" v-text="'Manage Dashboard Layout'" />
          <div class="lg:grid grid-cols-3">
            <a-checkbox
              v-for="(section, s) in sections"
              :key="s"
              class="my-2"
              :the-value="$dashboard.$state[section.state]"
              :label="section.label"
              @changed="(value) => ($dashboard.$state[section.state] = value)"
            />
          </div>
        </div>

        <div class="flex items-center justify-between w-full">
          <div class="bg-secondary-500 z-100 w-full p-4">
            <h1 class="w-full border-b font-bold mb-2" v-text="'Manage visible statistics'" />
            <div>
              <a-checkbox
                v-for="(section, s) in sections"
                :key="s"
                :the-value="$dashboard.$state[section.state]"
                :label="section.label"
                @changed="(value) => ($dashboard.$state[section.state] = value)"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ADialog from '@/components/General/ADialog.vue'
import ACheckbox from '@/components/General/ACheckbox.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'

export default defineComponent({
  name: 'DashboardSettings',

  components: { ACheckbox, ADialog, SettingsIcon },

  data() {
    return {
      customFields: [],
      sections: {
        layout: {
          ticket_counts: {
            label: 'Ticket count',
            show: true,
            settings: {}
          },
          types: {
            label: 'Ticket types',
            show: true
          },
          tags: {
            label: 'Tags',
            show: true
          },
          groups: {
            label: 'Groups',
            show: true
          },
          top_requesters: {
            label: 'Top requesters',
            show: true,
            settings: {}
          },
          top_agents: {
            label: 'Top agents',
            show: true,
            settings: {}
          },
          ticket_list: {
            label: 'Ticket list',
            show: true
          }
        }
      }
    }
  },

  computed: {
    layout() {
      return this.$dashboard?.state.layout
    }
  }
})
</script>
