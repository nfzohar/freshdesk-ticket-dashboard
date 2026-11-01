<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-6 py-2">
    <div>
      <h3 class="text-base font-semibold" v-text="'Automatic refresh'" />
      <p class="mt-1 text-sm text-ink-muted" v-text="pageTitle" />
    </div>

    <div class="flex flex-col gap-5" :key="(Number(autoRefreshActive), perMinutes)">
      <a-checkbox
        :the-value="autoRefreshActive"
        :checked="autoRefreshActive"
        class="font-medium"
        :label="'Refresh dashboard every few minutes'"
        :title="'Toggle automatic refresh.'"
        @changed="(value) => (autoRefreshActive = value)"
      />

      <div
        v-if="autoRefreshActive"
        class="flex flex-col gap-5 rounded-xl border border-line bg-surface-2/60 p-5"
      >
        <div>
          <span class="field-label" v-text="'Refresh interval'" />
          <div :key="perMinutes" class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              v-for="(shortcut, s) in intervalShortcuts"
              :key="s"
              class="rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
              :class="
                shortcut.value == perMinutes
                  ? 'border-primary-500 bg-primary-500 text-on-primary'
                  : 'border-line bg-surface hover:bg-surface-2'
              "
              v-text="shortcut.label"
              @click="setAutorefreshViaShortcut(shortcut.value)"
            />
          </div>
        </div>

        <div>
          <label class="field-label" for="refresh-minutes" v-text="'Custom interval (minutes)'" />
          <div class="flex gap-2">
            <input
              id="refresh-minutes"
              v-model="perMinutes"
              type="number"
              min="1"
              :placeholder="'0'"
              :title="'Count of minutes in a refresh interval.'"
              class="input max-w-[10rem]"
            />
            <button class="btn-secondary" v-text="'Set'" @click="setNewAutoRefreshSettings()" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ACheckbox from '@/components/general/ACheckbox.vue'

export default defineComponent({
  name: 'AutoRefreshSettings',

  components: { ACheckbox },

  data() {
    return {
      pageTitle: `Do you want the dashboard to automatically refresh:`,
      autoRefreshActive: false,
      perMinutes: 5
    }
  },

  computed: {
    currentAutoRefreshSettings(): String {
      return this.$configuration.theAutoRefresh
    },
    intervalShortcuts(): Array {
      return this.$information.autoRefreshShortcuts
    }
  },

  mounted() {
    this.autoRefreshActive = this.currentAutoRefreshSettings?.active
    this.perMinutes = this.currentAutoRefreshSettings?.perMinutes
  },

  methods: {
    setAutorefreshViaShortcut(interval: number) {
      this.perMinutes = interval
      this.setNewAutoRefreshSettings()
    },

    setNewAutoRefreshSettings() {
      if (this.perMinutes <= 0) {
        this.$toast.error('Dashboard should be refreshed at least every few minutes.')
        return
      }

      let updatedSettings = {
        active: this.autoRefreshActive,
        perMinutes: this.perMinutes
      }
      this.$configuration.updateAutoRefreshSettings(updatedSettings)
      this.$toast.success('Dashboard configuration was updated.')
    }
  }
})
</script>
