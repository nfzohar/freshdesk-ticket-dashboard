<template>
  <a-dialog :manual-open="open" custom-class="-mt-28 md:-mt-14">
    <template #trigger>
      <button class="actions-button" :title="'Settings'" @click="open = true">
        <i class="fa fa-cog" />
      </button>
    </template>

    <template #content>
      <div
        class="m-auto w-8/12 bg-secondary-500 border-primary-500 border rounded-md p-5"
        :class="'text-white'"
      >
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div class="bg-secondary-500 z-100 w-full p-4">
            <h1
              class="w-full border-b border-primary-600 font-bold mb-2"
              v-text="'Manage Dashboard Layout'"
            />

            <div class="flex items-center mb-5 bg-secondary-600 rounded-md px-5 py-3">
              <a-checkbox
                :key="refreshMinRate"
                class="w-9/12 font-bold pr-2 mb-2"
                :the-value="refreshSwitch"
                :label="'Refresh per minutes'"
                :title="'Toggle automatic refresh.'"
                @changed="(value) => (refreshSwitch = value)"
              />
              <input
                v-model="refreshMinRate"
                type="number"
                :title="'Count of minutes in a refresh interval.'"
                class="w-3/12 rounded-md text-black px-1"
              />
            </div>

            <div v-for="(section, s) in layout" :key="s" class="w-full flex flex-col">
              <a-checkbox
                class="w-max font-bold pr-2 mb-2"
                :the-value="section?.show"
                :label="'Show ' + section?.label"
                :title="'Toggle section visibility.'"
                @changed="(value) => (section.show = value)"
              />

              <div
                v-if="section['show'] && section['label'] == 'Ticket count'"
                class="grid grid-cols-1 md:grid-cols-2 items-center gap-x-8 mb-5 bg-secondary-600 rounded-md px-5 py-3"
              >
                <a-checkbox
                  v-for="(count, p) in statusLabels"
                  :key="p"
                  class="my-2 w-full"
                  :label="count"
                  :the-value="visibleCounts.includes(count)"
                  @changed="(value) => updateVisibleTicketCounts(count, value)"
                />
              </div>

              <div
                v-if="section?.show && section?.settings"
                class="grid grid-cols-1 md:grid-cols-2 items-center gap-x-8 mb-5 bg-secondary-600 rounded-md px-5 py-3"
              >
                <template v-for="(setting, p) in section?.settings" :key="p">
                  <a-checkbox
                    v-if="setting.type == 'boolean'"
                    class="my-2 w-full"
                    :label="setting.label"
                    :the-value="setting.value"
                    @changed="(value) => (setting.value = value)"
                  />
                  <div v-if="setting.type == 'number'" class="flex-col">
                    <label class="inline w-full 2xl:w-6/12 2xl:mx-3" v-text="setting.label" />
                    <input
                      type="number"
                      class="inline w-full 2xl:w-3/12 rounded-md text-black px-1"
                      v-model="setting.value"
                    />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 xl:grid-cols-4 w-full gap-x-10 gap-y-4">
          <button
            class="primary-button text-center bg-primary-500 border-none hover:bg-primary-600 py-2 px-10 shadow-primary-600 h-10 w-auto"
            v-text="'Clear all data'"
            :title="'Logout and delete all current configuration data'"
            @click.stop=""
          />
          <button
            class="primary-button text-center bg-primary-500 border-none hover:bg-primary-600 py-2 px-10 shadow-primary-600 h-10 w-auto"
            v-text="'Logout'"
            :title="'Logout without deleting current configuration data.'"
            @click.stop="$router.push('/logout')"
          />
          <button
            class="primary-button text-center bg-primary-500 border-none hover:bg-primary-600 py-2 px-10 shadow-primary-600 h-10 w-auto"
            v-text="'Reload'"
            :title="'Reload entire dashboard.'"
            @click.stop="updateDashboardData"
          />
          <button
            class="primary-button text-center bg-primary-500 border-none hover:bg-primary-600 py-2 px-10 shadow-primary-600 h-10 w-auto"
            v-text="'Save'"
            :title="'Save current configuration'"
            @click.stop=""
          />
        </div>
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ADialog from '@/components/general/ADialog.vue'
import ACheckbox from '@/components/general/ACheckbox.vue'

export default defineComponent({
  name: 'DashboardSettings',

  components: { ACheckbox, ADialog },

  emits: ['refreshDashboard', 'reloadDashboard'],

  props: {
    aTicket: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  data() {
    return {
      intervalId: null,
      refreshSwitch: false,
      clearInterval: Number,
      refreshMinRate: 5,
      customFields: {},
      open: false,
      layout: {}
    }
  },

  computed: {
    statuses() {
      return this.$dashboard?.statuses ?? []
    },
    statusLabels() {
      let labels = this.statuses.map((status: { label: String }) => status?.label)
      labels.unshift('All', 'Unresolved')
      return labels
    },
    stateLayout(): Object {
      return this.$dashboard?.dashboardLayout ?? []
    },
    stateCustomFields(): Object {
      return this.$dashboard?.storedCustomFields ?? []
    },
    visibleCounts() {
      return this.$dashboard?.layout.ticket_counts.visibleCounts
    }
  },

  watch: {},

  async mounted() {},

  methods: {
    updateDashboardData() {
      this.$router.replace('/loading')
    }
  }
})
</script>
