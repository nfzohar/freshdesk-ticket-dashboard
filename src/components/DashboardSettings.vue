<template>
  <a-dialog :manual-open="open" custom-class="-mt-14">
    <template #trigger>
      <button class="actions-button" :title="'Settings'" @click="open = true">
        <i class="fa fa-cog" />
      </button>
    </template>

    <template #content>
      <div
        class="m-auto w-11/12 md:w-8/12 bg-secondary-500 border-primary-500 scrollbar-hide border rounded-md h-full md:h-auto p-5 overflow-y-scroll"
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
              @change="refreshIsActive = false"
            />
          </a-setting-section>

          <a-setting-section :section-title="'Autohide toolbar'">
            <a-checkbox
              class="w-auto font-bold pr-2 mb-2"
              :the-value="autoHideToolbar"
              :label="'Automatically hide the toolbar after a few seconds.'"
              :title="'Toggle autohide dashboard toolbar.'"
              @changed="(value) => (autoHideToolbar = value)"
            />
          </a-setting-section>

          <a-setting-section :section-title="'Visible ticket status counters'">
            <div class="w-full">
              <div class="flex items-center justify-between w-full py-1">
                <button
                  class="hover:text-primary-500 hover:underline"
                  :title="'Set all statuses as visible.'"
                  v-text="'Select all'"
                  @click="visibleStatusCounters = statusLabels"
                />
                <button
                  class="hover:text-primary-500 hover:underline"
                  :title="'Remove all visible statuses.'"
                  v-text="'Clear all'"
                  @click="visibleStatusCounters = []"
                />
              </div>

              <div class="flex flex-row w-full gap-2">
                <ul
                  class="border border-primary-500 w-1/2 rounded-md p-2 bg-secondary-700 min-h-52 max-h-96 overflow-y-scroll scrollbar-hide"
                >
                  <li class="font-bold border-b border-primary-500 mb-1" v-text="'All statuses'" />
                  <li
                    v-if="visibleStatusCounters?.length == statusLabels?.length"
                    v-text="'All selected.'"
                  />
                  <template v-for="(status, a) in statusLabels" :key="a">
                    <li
                      v-if="!visibleStatusCounters?.includes(status)"
                      class="p-1 cursor-pointer hover:text-primary-500"
                      v-text="status"
                      @click="toggleVisibleStatuses(status)"
                    />
                  </template>
                </ul>

                <ul
                  class="border border-primary-500 w-1/2 rounded-md p-2 bg-secondary-700 min-h-52 max-h-96 overflow-y-scroll scrollbar-hide"
                >
                  <li
                    class="font-bold border-b border-primary-500 mb-1"
                    v-text="'Visible statuses'"
                  />
                  <li v-if="!visibleStatusCounters?.length" v-text="'None selected.'" />
                  <li
                    v-for="(status, a) in visibleStatusCounters"
                    :key="a"
                    class="p-1 cursor-pointer hover:text-primary-500"
                    v-text="status"
                    @click="toggleVisibleStatuses(status)"
                  />
                </ul>
              </div>
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

        <div class="flex flex-col xl:flex-row justify-between md:items-center gap-4 px-5">
          <div class="flex gap-3">
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
            class="primary-button settings-button text-center"
            :class="`text-${primaryColorDark ? 'white' : 'black'}`"
            @click="open = false"
            v-text="'Save'"
          />
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
          title: 'Clear all stored information and logout.',
          icon: 'fa fa-sign-out-alt',
          function: () => this.logout()
        },
        {
          name: 'Configuration wizard',
          title: 'To edit layout, rerun the configuration wizard.',
          icon: 'fa fa-hat-wizard',
          function: () => this.$router.push('/setup')
        },
        {
          name: 'Refresh information',
          title: 'Refresh the whole page.',
          icon: 'fa fa-redo-alt',
          function: () => this.$router.replace('/loading')
        },
        {
          name: 'Reload',
          title: 'Manually reload entire dashboard.',
          icon: 'fa fa-repeat',
          function: () => this.$emit('reloadDashboard')
        }
      ]
    }
  },

  computed: {
    trophyiconOptions(): Array {
      return this.$information?.trophyIcons
    },
    visibleTicketCounters(): Object {
      return this.$configuration?.visibleTicketCounts
    },
    primaryColorDark(): String {
      return this.$information?.isPrimaryColorDark
    },
    secondaryColorDark(): String {
      return this.$information?.isSecondaryColorDark
    },
    refreshWatchToken(): String {
      return `${this.refreshPerMinutes}${Number(this.refreshIsActive)}`
    },
    leaderboardsWatchToken(): String {
      return `${Number(this.throphiesVisible)}${this.leaderboardsTrophyIcon}${
        this.leaderboardslength
      }`
    },
    statusLabels(): Array {
      let statuses = Object.values(this.$information?.statuses)
      let labels = statuses.map((status: { label: String }) => status?.label)

      labels.unshift('All', 'Unresolved')
      return labels.sort()
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
    },
    'visibleStatusCounters.length'() {
      this.$configuration?.updateVisibleStatuses(this.visibleStatusCounters)
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
    },

    logout() {
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
