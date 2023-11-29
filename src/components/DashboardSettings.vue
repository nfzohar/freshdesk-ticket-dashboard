<template>
  <a-dialog :manual-open="open">
    <template #trigger>
      <settings-icon class="cursor-pointer" @click="open = true" />
    </template>

    <template #content>
      <div
        class="m-auto w-8/12 bg-secondary-500 border-primary-500 border rounded-md p-5 mt-10"
        :class="'text-white'"
      >
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div class="bg-secondary-500 z-100 w-full p-4">
            <h1
              class="w-full border-b border-primary-600 font-bold mb-2"
              v-text="'Manage Dashboard Layout'"
            />

            <div v-for="(section, s) in layout" :key="s" class="w-full flex flex-col">
              <a-checkbox
                class="w-max font-bold pr-2 mb-2"
                :the-value="section.show"
                :label="'Show ' + section?.label"
                :title="'Toggle section visibility.'"
                @changed="(value) => (section.show = value)"
              />

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
            :custom-fields="customFields"
            @newCustomFields="(value) => (customFields = value)"
          />
        </div>

        <div class="flex items-center justify-between w-full">
          <div class="flex gap-x-4">
            <button
              class="primary-button w-auto text-center bg-primary-500 border-none hover:bg-primary-600 py-2 px-10 shadow-md shadow-primary-600"
              v-text="'Clear all data'"
              :title="'Logout and delete all current configuration data'"
              @click.stop="clearAllDashboardData()"
            />
            <button
              class="primary-button w-auto text-center bg-primary-500 border-none hover:bg-primary-600 py-2 px-10 shadow-md shadow-primary-600"
              v-text="'Logout'"
              :title="'Logout without deleting current configuration data.'"
              @click.stop="$router.push('/logout')"
            />
          </div>
          <button
            class="primary-button w-auto text-center bg-primary-500 border-none hover:bg-primary-600 py-2 px-10 shadow-md shadow-primary-600"
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
import { defineComponent } from 'vue'
import ADialog from '@/components/General/ADialog.vue'
import ACheckbox from '@/components/General/ACheckbox.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import CustomFieldsManager from '@/components/subcomponents/CustomFieldsManager.vue'

export default defineComponent({
  name: 'DashboardSettings',

  components: { ACheckbox, ADialog, SettingsIcon, CustomFieldsManager },

  data() {
    return {
      customFields: {},
      open: false,
      layout: {}
    }
  },

  computed: {
    statuses(): Object {
      return this.$dashboard?.statuses ?? []
    },
    stateLayout(): Object {
      return this.$dashboard?.dashboardLayout ?? []
    },
    stateCustomFields(): Object {
      return this.$dashboard?.storedCustomFields ?? []
    }
  },

  watch: {
    open() {
      this.layout = this.buildLayoutFromStore()

      console.log(this.$dashboard.layout)
    }
  },

  async mounted() {
    this.customFields = this.stateCustomFields
    this.layout = this.buildLayoutFromStore()
  },

  methods: {
    buildLayoutFromStore() {
      return {
        ticket_counts: {
          label: 'Ticket count',
          show: this.stateLayout?.ticket_counts?.show,
          settings: this.ticketCountsFromStatuses()
        },
        types: {
          label: 'Ticket types',
          show: this.stateLayout?.types?.show
        },
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
        }
      }
    },

    ticketCountsFromStatuses() {
      let options = {
        All: {
          label: 'All',
          type: 'boolean',
          value: this.stateLayout?.ticket_counts.settings['All']
        },
        Unresolved: {
          label: 'Unresolved',
          type: 'boolean',
          value: this.stateLayout?.ticket_counts.settings['Unresolved']
        }
      }

      Object.values(this.statuses)?.forEach((status) => {
        options[status.label] = {
          label: status.label,
          type: 'boolean',
          value: this.stateLayout?.ticket_counts?.settings[status.label]
        }
      })

      return options
    },

    savePreferencesToState() {
      this.$dashboard?.saveCustomFieldsToStore(this.customFields)
      this.morphSectionSettingsForState()

      this.open = false
      this.layout = this.buildLayoutFromStore()
    },

    async morphSectionSettingsForState() {
      this.morphTopRequesters()
      this.morphTopAgents()
      this.morphTicketCounts()

      this.$dashboard?.saveLayoutToStore(this.layout)
    },

    morphTicketCounts() {
      let ticketCountSettings = Array()

      Object.values(this.layout.ticket_counts.settings).forEach((setting) => {
        ticketCountSettings[setting.label] = setting.value ? true : false
      })

      this.layout.ticket_counts.settings = ticketCountSettings
    },

    morphTopRequesters() {
      let topRequesters = this.layout.top_requesters.settings
      this.layout.top_requesters.settings.showTrophies = topRequesters.showTrophies.value
      this.layout.top_requesters.settings.listLentgh = topRequesters.listLentgh.value
    },

    morphTopAgents() {
      let topAgents = this.layout.top_agents.settings
      this.layout.top_agents.settings.showTrophies = topAgents.showTrophies.value
      this.layout.top_agents.settings.listLentgh = topAgents.listLentgh.value
    },

    clearAllDashboardData() {
      this.$dashboard?.deleteStoreData()
      this.$store.resetAuth()
      this.$router.go(0)
    }
  }
})
</script>
