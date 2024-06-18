<template>
  <div class="flex flex-col items-center text-center gap-10 m-10">
    <h2 class="w-full font-bold text-base lg:text-lg xl:text-2xl" v-text="pageTitle" />

    <div class="flex flex-col items-center w-full rounded-md text-lg gap-5">
      <a-checkbox
        :key="(Number(autoRefreshActive), perMinutes)"
        :the-value="autoRefreshActive"
        :checked="autoRefreshActive"
        class="font-bold m-auto"
        :label="'Refresh dashboard every few minutes'"
        :title="'Toggle automatic refresh.'"
        @changed="(value) => (autoRefreshActive = value)"
      />

      <div v-if="autoRefreshActive" class="bg-secondary-600 p-5 rounded-md">
        <div>
          <span v-text="'Set refresh interval with shortcuts:'" />
          <div :key="perMinutes" class="grid grid-cols-3 gap-5 my-5">
            <button
              v-for="(shortcut, s) in intervalShortcuts"
              :key="s"
              class="border border-primary-600 bg-primary-500 py-2 px-3 rounded-md hover:bg-primary-600 hover:border-primary-500"
              :class="{ 'border-primary-500 bg-primary-600': shortcut.value == perMinutes }"
              v-text="shortcut.label"
              @click="setAutorefreshViaShortcut(shortcut.value)"
            />
          </div>
        </div>

        <div>
          <span class="block w-full mb-5" v-html="'or set a custom (minutes) refresh interval:'" />
          <input
            v-model="perMinutes"
            type="number"
            :placeholder="'0'"
            :title="'Count of minutes in a refresh interval.'"
            class="w-52 h-14 rounded-md text-black text-2xl px-1"
          />
          <button
            class="border border-primary-600 bg-primary-500 p-3 mx-2 rounded-md text-2xl hover:bg-primary-600 hover:border-primary-500"
            v-text="'Set'"
            @click="setNewAutoRefreshSettings()"
          />
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
    }
  }
})
</script>
