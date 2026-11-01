<template>
  <a-dialog
    :manual-open="open"
    size="lg"
    icon="fa fa-gear"
    :title="'Settings'"
    :subtitle="'Changes are saved automatically.'"
    @open="$emit('open')"
    @close="$emit('close')"
  >
    <template #trigger>
      <button class="actions-button" :title="'Settings'" @click="open = true">
        <i class="fa fa-gear" />
      </button>
    </template>

    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a-setting-section :section-title="'Appearance'" body-class="flex flex-col gap-2">
          <theme-toggle variant="segmented" />
          <p class="text-xs text-ink-muted" v-text="'System follows your device setting.'" />
        </a-setting-section>

        <a-setting-section :section-title="'Toolbar'" body-class="flex flex-col">
          <a-checkbox
            :the-value="autoHideToolbar"
            :label="'Hide the toolbar after a few seconds'"
            :title="'Toggle autohide dashboard toolbar.'"
            @changed="(value) => (autoHideToolbar = value)"
          />
        </a-setting-section>

        <a-setting-section :section-title="'Auto refresh'" body-class="flex flex-col gap-3">
          <a-checkbox
            :key="Number(refreshIsActive)"
            :the-value="refreshIsActive"
            :label="'Refresh tickets automatically'"
            :title="'Toggle automatic refresh.'"
            @changed="(value) => (refreshIsActive = value)"
          />
          <div>
            <label class="field-label" for="settings-refresh" v-text="'Interval (minutes)'" />
            <input
              id="settings-refresh"
              v-model="refreshPerMinutes"
              type="number"
              min="1"
              :title="'Count of minutes in a refresh interval.'"
              class="input max-w-[10rem]"
              @change="refreshIsActive = false"
            />
          </div>
        </a-setting-section>

        <a-setting-section :section-title="'Leaderboards'" body-class="flex flex-col gap-3">
          <a-checkbox
            :the-value="throphiesVisible"
            :label="'Show trophies on leaderboards'"
            :title="'Toggle trophy visibility on leaderboards.'"
            @changed="(value) => (throphiesVisible = value)"
          />
          <div class="grid grid-cols-2 gap-3">
            <a-select
              :the-value="leaderboardsTrophyIcon"
              :label="'Trophy icon'"
              :options="trophyiconOptions"
              :label-field="'label'"
              :value-field="'value'"
              :show-null-value="false"
              :input-class="'capitalize'"
              @changed="(value) => (leaderboardsTrophyIcon = value)"
            />
            <div>
              <label class="field-label" for="settings-leaderboard-length" v-text="'Length'" />
              <input
                id="settings-leaderboard-length"
                v-model="leaderboardslength"
                type="number"
                min="1"
                :title="'Count of entries shown on the leaderboards.'"
                class="input"
              />
            </div>
          </div>
        </a-setting-section>

        <a-setting-section
          class="md:col-span-2"
          :section-title="'Visible ticket status counters'"
          body-class="flex flex-col gap-3"
        >
          <div class="flex items-center justify-between gap-2 text-sm">
            <span
              class="text-ink-muted"
              v-text="`${visibleStatusCounters?.length ?? 0} of ${statusLabels?.length ?? 0} shown`"
            />
            <div class="flex gap-1">
              <button
                class="btn-ghost px-2 py-1"
                :title="'Set all statuses as visible.'"
                v-text="'Select all'"
                @click="visibleStatusCounters = statusLabels"
              />
              <button
                class="btn-ghost px-2 py-1"
                :title="'Remove all visible statuses.'"
                v-text="'Clear'"
                @click="visibleStatusCounters = []"
              />
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="(status, a) in statusLabels"
              :key="a"
              class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors"
              :class="
                visibleStatusCounters?.includes(status)
                  ? 'border-primary-500 bg-primary-500 text-on-primary'
                  : 'border-line bg-surface text-ink-muted hover:text-ink hover:bg-surface-2'
              "
              :aria-pressed="visibleStatusCounters?.includes(status)"
              @click="toggleVisibleStatuses(status)"
            >
              <i
                class="fa text-xs"
                :class="visibleStatusCounters?.includes(status) ? 'fa-check' : 'fa-plus'"
              />
              <span v-text="status" />
            </button>
          </div>
        </a-setting-section>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(action, a) in actions.filter((action) => action.side == 'left')"
          :key="a"
          :title="action.title"
          :class="action.variant"
          @click.stop="action.function"
        >
          <i :class="action.icon" />
          <span v-text="action.name" />
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(action, a) in actions.filter((action) => action.side == 'right')"
          :key="a"
          :title="action.title"
          :class="action.variant"
          @click.stop="action.function"
        >
          <i :class="action.icon" />
          <span v-text="action.name" />
        </button>
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
import ThemeToggle from '@/components/general/ThemeToggle.vue'

export default defineComponent({
  name: 'DashboardSettings',

  components: { ASettingSection, ACheckbox, ADialog, ASelect, ThemeToggle },

  emits: ['reloadDashboard', 'openWizard', 'refetch', 'editLayout', 'open', 'close'],

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
          name: 'Log out',
          title: 'Logout and delete your API credentials.',
          icon: 'fa fa-right-from-bracket',
          side: 'left',
          variant: 'btn-ghost',
          function: () => this.logout()
        },
        {
          name: 'Clear all data',
          title: 'Clear all stored information and log out.',
          icon: 'fa fa-broom',
          side: 'left',
          variant: 'btn-danger',
          function: () => this.clearSavedInfo()
        },
        {
          name: 'Edit layout',
          title: 'Move, resize, add and remove panels on the dashboard.',
          icon: 'fa fa-pen-ruler',
          side: 'right',
          variant: 'btn-secondary',
          function: () => this.runAndClose(() => this.$emit('editLayout'))
        },
        {
          name: 'Setup wizard',
          title: 'Rerun the setup wizard: refresh, leaderboards and layout type.',
          icon: 'fa fa-wand-magic-sparkles',
          side: 'right',
          variant: 'btn-secondary',
          function: () => this.runAndClose(() => this.$emit('openWizard'))
        },
        {
          name: 'Refetch',
          title: 'Refetch ticket fields, agents and groups from Freshdesk.',
          icon: 'fa fa-cloud-arrow-down',
          side: 'right',
          variant: 'btn-secondary',
          function: () => this.runAndClose(() => this.$emit('refetch'))
        },
        {
          name: 'Reload',
          title: 'Manually reload the entire dashboard.',
          icon: 'fa fa-rotate',
          side: 'right',
          variant: 'btn-secondary',
          function: () => this.$emit('reloadDashboard')
        },
        {
          name: 'Done',
          title: 'Close settings.',
          icon: 'fa fa-check',
          side: 'right',
          variant: 'btn-primary',
          function: () => (this.open = false)
        }
      ]
    }
  },

  computed: {
    trophyiconOptions(): Array {
      return this.$information?.trophyIcons
    },
    visibleTicketCounters(): Object {
      return this.$configuration?.visibleTicketCounts ?? []
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
      let statuses = Object.values(this.$information?.storedStatuses ?? [])
      let labels = statuses.map((status) => status?.label)

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

    runAndClose(action: Function) {
      this.open = false
      action()
    },

    // Logging out shows the login overlay; the dashboard watches the auth state.
    clearSavedInfo() {
      this.$configuration.$reset()
      this.$configuration.deleteStoredConfiguration()
      this.$information.deleteStoredConfiguration()
      this.$auth.logout()
    },

    logout() {
      this.$auth.logout()
    }
  }
})
</script>
