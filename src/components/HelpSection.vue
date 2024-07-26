<template>
  <a-dialog :manual-open="open">
    <template #trigger>
      <button class="actions-button" :title="'Help'" @click="open = true">
        <i class="fa fa-question-circle" />
      </button>
    </template>

    <template #content>
      <div
        class="m-auto w-8/12 bg-secondary-500 border-primary-500 border rounded-md p-5"
        :class="'text-white'"
      >
        <h1 class="text-xl font-bold cursor-pointer" v-text="'Help'" />
        <hr class="mb-3 border-t-primary-500" />

        <div class="flex fle-col gap-5">
          <a-filter-section :section-title="'Leaderboards settings'">
            <span>1</span>
          </a-filter-section>

          <a-filter-section :section-title="'Leaderboards settings'">
            <span>1</span>
          </a-filter-section>
        </div>
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ADialog from '@/components/general/ADialog.vue'

export default defineComponent({
  name: 'HelpSection',

  components: { ADialog },

  data() {
    return { open: true }
  }
})
</script>
