<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-6 py-2">
    <div>
      <h3 class="text-base font-semibold" v-text="pageTitle" />
      <p
        class="mt-1 text-sm text-ink-muted"
        v-text="'Choose how the agent and requester leaderboards look.'"
      />
    </div>

    <div class="flex flex-col gap-5">
      <div>
        <label
          class="field-label"
          for="leaderboard-length"
          v-text="'Users shown on leaderboards'"
        />
        <input
          id="leaderboard-length"
          v-model="leaderboardLength"
          type="number"
          min="1"
          :placeholder="'0'"
          :title="'Count of users shown on each leaderboard.'"
          class="input max-w-[10rem]"
        />
      </div>

      <a-checkbox
        :key="Number(showTrophies)"
        :the-value="showTrophies"
        class="font-medium"
        :label="'Show trophies on leaderboards'"
        :title="'Toggle trophies on leaderboards.'"
        @changed="(value) => (showTrophies = value)"
      />

      <div
        v-if="showTrophies"
        class="flex flex-col gap-4 rounded-xl border border-line bg-surface-2/60 p-5"
      >
        <a-select
          :the-value="selectedTrophyIcon"
          :label="'Trophy icon'"
          :options="trophyIconOptions"
          :label-field="'label'"
          :value-field="'value'"
          :input-class="'capitalize'"
          @changed="(value) => (selectedTrophyIcon = value)"
        />

        <div v-if="selectedTrophyIcon" class="flex items-center gap-6">
          <i
            v-for="(color, c) in trophyColors"
            :key="c"
            :title="`${c + 1}. place`"
            class="text-3xl"
            :class="[selectedTrophyIcon, color]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ASelect from '@/components/general/ASelect.vue'
import ACheckbox from '@/components/general/ACheckbox.vue'
export default defineComponent({
  name: 'LeaderboardsSettings',

  components: { ACheckbox, ASelect },

  data() {
    return {
      pageTitle: 'Leaderboards settings',
      leaderboardLength: 5,
      showTrophies: false,
      selectedTrophyIcon: 'fa fa-trophy',
      icons: ['fa-trophy', 'fa-medal', 'fa-award', 'fa-star']
    }
  },

  computed: {
    leaderboarsSettings(): any {
      return this.$configuration.leaderboards
    },
    trophyColors(): Array<any> {
      return this.$information?.trophyColors
    },
    trophyIconOptions(): Array<any> {
      return this.$information.trophyIcons
    },
    inputBorder(): string {
      return this.$information?.conditionalPrimaryBorder
    },
    token() {
      return `${this.leaderboardLength}${Number(this.showTrophies)}${this.selectedTrophyIcon}`
    }
  },

  watch: {
    token() {
      let updatedSettings = {
        length: this.leaderboardLength,
        showThrophies: this.showTrophies,
        trophyIcon: this.selectedTrophyIcon,
        trophyColors: this.trophyColors
      }
      this.$configuration.updateLeaderboardSettings(updatedSettings)
      this.$toast.success('Dashboard configuration was updated.')
    }
  },

  mounted() {
    this.leaderboardLength = this.leaderboarsSettings.length
    this.showTrophies = this.leaderboarsSettings.showThrophies
    this.selectedTrophyIcon = this.leaderboarsSettings.trophyIcon
  }
})
</script>
