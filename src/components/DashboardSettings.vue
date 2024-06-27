<template>
  <a-dialog :manual-open="open" custom-class="-mt-14">
    <template #trigger>
      <button class="actions-button" :title="'Settings'" @click="open = true">
        <i class="fa fa-cog" />
      </button>
    </template>

    <template #content>
      <div
        class="m-auto w-11/12 md:w-8/12 bg-secondary-500 border-primary-500 border rounded-md h-full md:h-auto p-5 overflow-y-scroll" 
        :class="`text-${secondaryColorDark ? 'white' : 'black'}`"
      >
        <div class="grid grid-cols-1 md:grid-cols-2">
          <a-setting-section :section-title="'Manage dashboard layout'">
            <a-checkbox
              :key="Number(refreshIsActive)"
              class="w-9/12 font-bold pr-2 mb-2"
              :the-value="refreshIsActive"
              :label="'Refresh per minutes'"
              :title="'Toggle automatic refresh.'"
              @changed="(value) => (refreshIsActive = value)"
            />
            <input
              v-model="refreshPerMinutes"
              type="number"
              :title="'Count of minutes in a refresh interval.'"
              class="w-3/12 rounded-md text-black px-1"
              @change="refreshIsActive=false"
            />
          </a-setting-section>

          <a-setting-section :section-title="'Autohide toolbar'">
            <a-checkbox
              class="w-auto font-bold pr-2 mb-2"
              :the-value="autoHideToolbar"
              :label="'The toolbar is hidden after 10 seconds.'"
              :title="'Toggle autohide dashboard toolbar.'"
              @changed="(value) => (autoHideToolbar = value)"
            />
          </a-setting-section>

          <a-setting-section :section-title="'Visible ticket counters'">
            <div class="flex flex-col w-full gap-y-2">
              <div
                class="grid grid-cols-2 lg:grid-cols-3 gap-5 p-3 w-full overflow-y-scroll scrollbar-hide border border-primary-500 rounded-md bg-secondary-500"
                :key="visibleStatusCounters?.length"
              >
                <button
                  v-for="(status, s) in statusLabels"
                  :key="s"
                  class="hover:text-primary-500"
                  :class="{ 'text-primary-500': visibleStatusCounters.includes(status) }"
                  :title="status"
                  v-text="status"
                  @click="toggleVisibleStatuses(status)"
                />
              </div>

              <div class="flex items-center justify-between border-b border-primary-500 w-full">
                <span class="font-bold w-full" v-text="'Visible counters:'" />
                <button
                  class="block w-28 hover:text-primary-500"
                  :title="'Clear all visible counters.'"
                  v-text="'Clear all'"
                  @click="visibleStatusCounters = []"
                />
              </div>
              <span
                v-text="
                  visibleStatusCounters.length
                    ? visibleStatusCounters.join(', ')
                    : 'No visible status counters found.'
                "
              />
            </div>
          </a-setting-section>

          <a-setting-section :section-title="'Leaderboards settings'">
            <div class="flex items-center flex-col gap-y-5">
              <a-checkbox
                class="w-full font-bold pr-2 mb-2"
                :the-value="throphiesVisible"
                :label="'Show trophies on leaderboars.'"
                :title="'Toggle trophy visibility on leaderboards.'"
                @changed="(value) => (throphiesVisible = value)"
              />
              <a-select
                :the-value="leaderboardsTrophyIcon"
                :label="'Trophy icon:'"
                :options="trophyiconOptions"
                :label-field="'label'"
                :value-field="'value'"
                label-class="w-full font-semibold mb-1 bg-none"
                :input-class="`w-full capitalize text-${primaryColorDark ? 'white' : 'black'}`"
                @changed="(value) => (leaderboardsTrophyIcon = value)"
              />
              <div class="flex flex-col w-full">
                <span class="block w-full" v-text="'Leaderbords length:'" />
                <input
                  v-model="leaderboardslength"
                  type="number"
                  :title="'Count of entries, shown on the leaderbords.'"
                  class="w-full rounded-md text-black px-1"
                />
              </div>
            </div>
          </a-setting-section>
        </div>

        <div class="flex flex-col xl:flex-row md:items-center justify-between gap-4 px-5">
          <div class="grid grid-cols-2 xl:flex items-center gap-5">
            <button
              v-for="(action, a) in actions"
              :key="a"
              :title="action.title"
              class="flex items-center gap-x-1 primary-button settings-button text-center"
              :class="`text-${primaryColorDark ? 'white' : 'black'}`"
              @click.stop="action.function"
            >
              <i :class="action.icon" />
              <span v-text="action.name" />
            </button>
          </div>

          <button
            class="flex items-center gap-x-1 primary-button settings-button align-middle"
            :class="`text-${primaryColorDark ? 'white' : 'black'}`"
            @click.stop="open = false"
          >
            <i class="fa fa-save" />
            <span v-text="'Save'" />
          </button>
        </div>
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ASelect from '@/components/general/ASelect.vue'
import ADialog from '@/components/general/ADialog.vue'
import ACheckbox from '@/components/general/ACheckbox.vue'
import ASettingSection from '@/components/general/ASection.vue'

export default defineComponent({
  name: 'DashboardSettings',

  components: { ASettingSection, ACheckbox, ADialog, ASelect },

  emits: ['reloadDashboard'],

  data() {
    return {
      open: false,
      autoHideToolbar: false,
      visibleStatusCounters: [],

      refreshPerMinutes: 0,
      refreshIsActive: false,

      leaderboardslength: 5,
      throphiesVisible: true,
      leaderboardsTrophyIcon: 'fa fa-trophy',

      actions: [
        {
          name: 'Logout',
          title: 'Logout from the dashboard.',
          icon: 'fa fa-sign-out-alt',
          function: () => this.$router.push('/logout')
        },
        {
          name: 'Clear all data',
          title: 'Clear all stored information and logout.',
          icon: 'fa fa-broom',
          function: () => this.clearStoredInformation()
        },
        {
          name: 'Reload information',
          title: 'Reload the whole dashboard.',
          icon: 'fa fa-redo-alt',
          function: () => this.$router.replace('/loading')
        },
        {
          name: 'Configuration wizard',
          title: 'To edit layout, rerun the configuration wizard.',
          icon: 'fa fa-hat-wizard',
          function: () => this.$router.push('/setup')
        }
      ]
    }
  },

  computed: {
    trophyiconOptions() {
      return this.$information?.trophyIcons
    },
    visibleTicketCounters() {
      return this.$configuration?.visibleTicketCounts
    },
    statusLabels() {
      let statuses = Object.values(this.$information?.statuses)
      let labels = statuses.map((status: { label: String }) => status?.label)

      labels.unshift('All', 'Unresolved')
      return labels.sort()
    },
    refreshWatchToken() {
      return `${this.refreshPerMinutes}${Number(this.refreshIsActive)}`
    },
    leaderboardsWatchToken() {
      return `${Number(this.throphiesVisible)}${this.leaderboardsTrophyIcon}${
        this.leaderboardslength
      }`
    },
    primaryColorDark() {
      return this.$information?.isPrimaryColorDark
    },
    secondaryColorDark() {
      return this.$information?.isSecondaryColorDark
    }
  },

  watch: {
    autoHideToolbar() {
      this.updateAutohideToolbar()
    },
    refreshWatchToken() {
      this.updateDashboardRefresh()
    },
    leaderboardsWatchToken() {
      this.updateLeaderboardsSettings()
    }
  },

  async mounted() {
    this.loadSettingsFromConfiguration()
  },

  methods: {
    loadSettingsFromConfiguration() {
      this.autoHideToolbar = this.$configuration?.autoHideToolbar
      this.visibleStatusCounters = this.$configuration?.visibleTicketCounts

      this.refreshPerMinutes = this.$configuration?.theAutoRefresh.perMinutes
      this.refreshIsActive = this.$configuration?.theAutoRefresh.active

      this.throphiesVisible = this.$configuration?.showTrophies
      this.leaderboardsTrophyIcon = this.$configuration?.trophyIcon
      this.leaderboardslength = this.$configuration?.leaderboardsLength
    },

    updateDashboardRefresh() {
      let newSettings = {
        active: this.refreshIsActive,
        perMinutes: this.refreshPerMinutes
      }
      this.$configuration.updateAutoRefreshSettings(newSettings)
    },

    updateAutohideToolbar() {
      let layout = this.$configuration.theLayout

      if (layout) {
        layout.autoHideToolbar = this.autoHideToolbar
        this.$configuration.updateLayout(layout)
      }
    },

    updateLeaderboardsSettings() {
      let newSettings = {
        length: this.leaderboardslength,
        showThrophies: this.throphiesVisible,
        trophyIcon: this.leaderboardsTrophyIcon
      }
      this.$configuration.updateLeaderboardSettings(newSettings)
    },

    toggleVisibleStatuses(status: String) {
      !this.visibleStatusCounters.includes(status)
        ? this.visibleStatusCounters.push(status)
        : (this.visibleStatusCounters = this.visibleStatusCounters.filter((s) => s != status))

      this.$configuration.updateVisibleStatuses(this.visibleStatusCounters)
    },

    clearStoredInformation() {
      this.$configuration.deleteStoredConfiguration()
      this.$information.deleteStoredConfiguration()

      this.$router.push('/logout')
    }
  }
})
</script>

<style scoped>
.settings-button {
  @apply text-center bg-primary-500 border-none hover:bg-primary-600 p-2 xl:py-2 xl:px-5 shadow-primary-600;
}
</style>
