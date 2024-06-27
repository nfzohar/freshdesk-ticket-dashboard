<template>
  <div class="flex flex-col items-center text-center gap-10 m-10">
    <h2 class="w-full font-bold text-base lg:text-lg xl:text-2xl" v-text="pageTitle" />

    <div class="flex flex-col items-center w-full rounded-md text-lg gap-5">
      <div class="flex items-center gap-x-3">
        <span class="h-full w-full" v-html="'Shown users on leaderboards:'" />
        <input
          v-model="leaderboardLength"
          type="number"
          :placeholder="'0'"
          :title="'Count of minutes in a refresh interval.'"
          class="w-20 h-10 rounded-md text-black text-xl px-1"
        />
      </div>

      <a-checkbox
        :key="Number(showTrophies)"
        :the-value="showTrophies"
        class="font-bold m-auto"
        :label="'Show trophies on leaderbords'"
        :title="'Toggle automatic refresh.'"
        @changed="(value) => (showTrophies = value)"
      />

      <div v-if="showTrophies" class="bg-secondary-600 w-full sm:w-1/3 px-4 py-3 rounded-md">
        <a-select
          :the-value="selectedTrophyIcon"
          :label="'Trophy icon:'"
          :options="trophyIconOptions"
          :label-field="'label'"
          :value-field="'value'"
          label-class="font-semibold mb-1 bg-none"
          :input-class="'w-full capitalize'"
          @changed="(value) => (selectedTrophyIcon = value)"
        />

        <div v-if="selectedTrophyIcon" class="flex items-center justify-between">
          <i
            v-for="(color, c) in trophyColors"
            :key="c"
            :title="`${c + 1}. place`"
            class="text-3xl p-6"
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
    leaderboarsSettings(): String {
      return this.$configuration.leaderboards
    },
    trophyColors(): Array {
      return this.$information?.trophyColors
    },
    trophyIconOptions(): Array {
      return this.$information.trophyIcons
    },
    token() {
      return `${this.leaderboardLength}${Number(this.showTrophies)}${this.selectedTrophyIcon}`
    },
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
