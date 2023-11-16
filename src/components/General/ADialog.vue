<template>
  <div @click="openDialog">
    <slot :name="'trigger'" />
  </div>

  <div v-if="open">
    <dialog
      class="bg-opacity-50 bg-secondary-500 w-screen h-screen -mt-10"
      :open="open"
      @close="closeDialog"
    >
      <div class="absolute z-1000 right-10 top-10 cursor-pointer" @click="closeDialog">
        <span class="bg-secondary-500 border-primary-500 border rounded-md w-10 h-10 p-1">
          <cross-icon />
        </span>
      </div>

      <div class="m-auto w-11/12 pt-10 h-full opacity-1 rounded-md">
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

  props: {
    customClass: {
      type: String,
      required: false,
      default: 'text-sm w-auto text-left text-primary'
    }
  },

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
