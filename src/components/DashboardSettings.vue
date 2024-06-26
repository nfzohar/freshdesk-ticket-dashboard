<template>
  <a-dialog :manual-open="open" custom-class="-mt-14">
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
          <a-setting-section :section-title="'Manage dashboard layout'">
            <a-checkbox
              :key="refreshPerMinutes"
              class="w-9/12 font-bold pr-2 mb-2"
              :the-value="refreshIsActive"
              :label="'Refresh per minutes'"
              :title="'Toggle automatic refresh.'"
              @changed="(value) => (refreshIsActive = value)"
            />
            <input
              v-model="refreshPerMinutes"
              type="number"
              :disabled="!refreshIsActive"
              :title="'Count of minutes in a refresh interval.'"
              class="w-3/12 rounded-md text-black px-1"
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
                <span
                  class="font-bold w-full"
                  v-text="'Visible counters:'"
                />
                <button
                  class="block w-28 hover:text-primary-500"
                  :title="'Clear all visible counters.'"
                  v-text="'Clear all'"
                  @click="visibleStatusCounters = []"
                />
              </div>
              <span 
                v-text="visibleStatusCounters.length 
                ? visibleStatusCounters.join(', ') 
                : 'No visible status counters found.'"
              />
            </div>
          </a-setting-section>

          <a-setting-section :section-title="'Leaderboards settings'">
            <div class="flex items-center flex-col gap-y-5">
              <a-checkbox
                class="w-full font-bold pr-2 mb-2"
                :the-value="autoHideToolbar"
                :label="'Show trophies on leaderboars.'"
                :title="'Toggle trophy visibility on leaderboards.'"
                @changed="(value) => (autoHideToolbar = value)"
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
          <div class="grid grid-cols-3 xl:flex items-center gap-x-5">
            <button
              class="primary-button settings-button"
              :class="`text-${primaryColorDark ? 'white' : 'black'}`"
              v-text="'Logout'"
              @click.stop="$router.push('/logout')"
            />
            <button
              class="primary-button settings-button"
              :class="`text-${primaryColorDark ? 'white' : 'black'}`"
              v-text="'Clear all data'"
              @click.stop="clearStoredInformation()"
            />
            <button
              class="primary-button settings-button"
              :class="`text-${primaryColorDark ? 'white' : 'black'}`"
              v-text="'Reload information'"
              @click.stop="$router.replace('/loading')"
            />
          </div>

          <button
            class="primary-button settings-button w-full xl:w-auto"
            :class="`text-${primaryColorDark ? 'white' : 'black'}`"
            v-text="'Save'"
            @click.stop="open = false"
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
import ASettingSection from '@/components/general/ASettingSection.vue'

export default defineComponent({
  name: 'DashboardSettings',

  components: { ASettingSection, ACheckbox, ADialog, ASelect },

  emits: ['reloadDashboard'],

  props: {
    aTicket: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  data() {
    return {
      open: false,
      autoHideToolbar: false,
      visibleStatusCounters: [],

      refreshPerMinutes: 0,
      refreshIsActive: false,

      leaderboardslength: 5,
      throphiesVisible: true,
      leaderboardsTrophyIcon: 'fa fa-trophy'
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
      return this.$information?.primaryColorDark
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
  @apply text-center bg-primary-500 border-none hover:bg-primary-600 p-2 xl:py-2 xl:px-10 shadow-primary-600;
}
</style>
