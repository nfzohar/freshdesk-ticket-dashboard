<template>
  <div @click="openDialog">
    <slot :name="'trigger'" />
  </div>

  <div v-if="open">
    <dialog
      class="bg-opacity-50 bg-secondary-500 w-screen h-screen -mt-10"
      :open="open"
      @close="closeDialog"
      @keydown.esc="closeDialog"
    >
      <div class="absolute right-0 top-10 cursor-pointer" @click="closeDialog">
        <div class="mx-5 -mt-5 bg-secondary-500 border border-primary-500 rounded-md">
          <cross-icon />
        </div>
      </div>

      <div class="m-auto w-12/12 pt-10 h-full opacity-1 rounded-md z-10">
        <slot :name="'content'" />
      </div>
    </dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CrossIcon from '@/components/icons/CrossIcon.vue'

export default defineComponent({
  name: 'ADialog',

  components: { CrossIcon },

  data() {
    return {
      open: false
    }
  },

  methods: {
    openDialog() {
      this.open = true
    },
    closeDialog() {
      this.open = false
    }
  }
})
</script>
