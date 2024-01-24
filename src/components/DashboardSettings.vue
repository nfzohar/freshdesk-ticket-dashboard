<template>
  <a-dialog :manual-open="open" custom-class="-mt-28 md:-mt-14">
    <template #trigger>
      <button
        class="primary-button text-center bg-primary-500 border-none hover:bg-primary-600 px-3 shadow-md shadow-primary-600 h-10 w-auto"
        :title="'Settings'"
        @click="open = true"
      >
        <settings-icon class="cursor-pointer" />
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

          <custom-fields-manager
            :a-ticket="aTicket"
            :custom-fields="customFields"
            @newCustomFields="(value) => (customFields = value)"
          />
        </div>

        <div class="grid grid-cols-2 xl:grid-cols-4 w-full gap-x-10 gap-y-4">
          <button
            class="primary-button text-center bg-primary-500 border-none hover:bg-primary-600 py-2 px-10 shadow-md shadow-primary-600 h-10 w-auto"
            v-text="'Clear all data'"
            :title="'Logout and delete all current configuration data'"
            @click.stop="clearAllDashboardData()"
          />
          <button
            class="primary-button text-center bg-primary-500 border-none hover:bg-primary-600 py-2 px-10 shadow-md shadow-primary-600 h-10 w-auto"
            v-text="'Logout'"
            :title="'Logout without deleting current configuration data.'"
            @click.stop="$router.push('/logout')"
          />
          <button
            class="primary-button text-center bg-primary-500 border-none hover:bg-primary-600 py-2 px-10 shadow-md shadow-primary-600 h-10 w-auto"
            v-text="'Reload'"
            :title="'Reload entire dashboard.'"
            @click.stop="$emit('reloadDashboard')"
          />
          <button
            class="primary-button text-center bg-primary-500 border-none hover:bg-primary-600 py-2 px-10 shadow-md shadow-primary-600 h-10 w-auto"
            v-text="'Save'"
            :title="'Save current configuration'"
            @click.stop="savePreferencesToState()"
          />
        </div>
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { uniq } from 'lodash'
import { defineComponent } from 'vue'
import ADialog from '@/components/General/ADialog.vue'
import ACheckbox from '@/components/General/ACheckbox.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import CustomFieldsManager from '@/components/subcomponents/CustomFieldsManager.vue'

export default defineComponent({
  name: 'DashboardSettings',

  components: { ACheckbox, ADialog, SettingsIcon, CustomFieldsManager },

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

  watch: {
    open() {
      this.layout = this.buildLayoutFromStore()
    },
    refreshMinRate() {
      this.refreshSwitch = false
    },
    refreshSwitch() {
      if (this.refreshSwitch) {
        if (this.refreshMinRate) {
          this.intervalId = setInterval(
            () => {
              this.$emit('refreshDashboard')
            },
            1000 * 60 * this.refreshMinRate
          )
        }
      } else {
        clearInterval(this.intervalId)
      }
    }
  },

  async mounted() {
    this.customFields = this.stateCustomFields
    this.layout = this.buildLayoutFromStore()
  },

  methods: {
    buildLayoutFromStore() {
      return {
        tags: {
          label: 'Tags',
          show: this.stateLayout?.tags?.show
        },
        groups: {
          label: 'Groups',
          show: this.stateLayout?.groups?.show
        },
        ticket_list: {
          label: 'Ticket list',
          show: this.stateLayout?.ticket_list?.show
        },
        types: {
          label: 'Ticket types',
          show: this.stateLayout?.types?.show
        },
        ticket_open_closed_graph: {
          label: 'Ticket open/closed graph',
          show: this.stateLayout?.ticket_open_closed_graph?.show
        },
        top_requesters: {
          label: 'Top requesters',
          show: this.stateLayout?.top_requesters?.show,
          settings: {
            showTrophies: {
              label: 'Show trophies',
              type: 'boolean',
              value: this.stateLayout?.top_requesters?.settings.showTrophies
            },
            listLentgh: {
              label: 'Top list length',
              type: 'number',
              value: this.stateLayout?.top_requesters?.settings.listLentgh || 5
            }
          }
        },
        top_agents: {
          label: 'Top agents',
          show: this.stateLayout?.top_agents?.show,
          settings: {
            showTrophies: {
              label: 'Show trophies',
              type: 'boolean',
              value: this.stateLayout?.top_agents?.settings.showTrophies
            },
            listLentgh: {
              label: 'Top list length',
              type: 'number',
              value: this.stateLayout?.top_agents?.settings.listLentgh || 5
            }
          }
        },
        ticket_counts: {
          label: 'Ticket count',
          show: this.stateLayout?.ticket_counts?.show,
          visibleCounts: this.ticketCountsFromStatuses()
        }
      }
    },

    ticketCountsFromStatuses() {
      if (this.stateLayout?.ticket_counts?.visibleCounts) {
        let currentTicketCounts = Object.values(this.stateLayout?.ticket_counts?.visibleCounts)
        let visibleTicketCounts = Array()

        let optionKeys = [
          'All',
          'Unresolved',
          Object.values(this.statuses).map((status) => status['label'])
        ].flat()

        optionKeys?.forEach((option) => {
          if (currentTicketCounts.includes(option)) {
            visibleTicketCounts.push(option)
          }
        })

        return uniq(visibleTicketCounts)
      }
    },

    updateVisibleTicketCounts(statusLabel: String, show: false) {
      if (show) {
        this.layout.ticket_counts.visibleCounts.push(statusLabel)
      } else {
        this.layout.ticket_counts.visibleCounts = uniq(
          Object.values(this.layout.ticket_counts.visibleCounts).filter(
            (status) => status != statusLabel
          )
        )
      }

      this.$dashboard.layout.ticket_counts.visibleCounts = this.layout.ticket_counts?.visibleCounts
    },

    savePreferencesToState() {
      this.$dashboard?.saveCustomFieldsToStore(this.customFields)
      this.morphSectionSettingsForState()

      this.layout = this.buildLayoutFromStore()
      this.open = false
    },

    async morphSectionSettingsForState() {
      let ticketCounts = this.$dashboard.layout.ticket_counts.visibleCounts
      this.$dashboard.layout.ticket_counts.visibleCounts = uniq(ticketCounts)

      let topRequesters = this.layout.top_requesters?.settings
      this.layout.top_requesters.settings = {
        showTrophies: topRequesters?.showTrophies?.value,
        listLentgh: topRequesters?.listLentgh?.value
      }

      let topAgents = this.layout.top_agents?.settings
      this.layout.top_agents.settings = {
        showTrophies: topAgents?.showTrophies?.value,
        listLentgh: topAgents?.listLentgh?.value
      }

      this.$dashboard?.saveLayoutToStore(this.layout)
    },

    clearAllDashboardData() {
      this.$dashboard?.deleteStoreData()
      this.$store.resetAuth()
      this.$router.go(0)
    }
  }
})
</script>
