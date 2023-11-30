<template>
  <div @click="openDialog">
    <slot :name="'trigger'" />
  </div>

  <div v-if="open">
    <dialog
      class="bg-opacity-50 bg-secondary-500 w-screen h-screen"
      :class="customClass"
      :open="open"
      @close="closeDialog"
      @keydown.esc="closeDialog"
    >
      <div class="absolute right-2 top-10 cursor-pointer" @click="closeDialog">
        <div class="mx-5 bg-secondary-500 border border-primary-500 rounded-md">
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

  emits: ['open', 'close'],

  props: {
    manualOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    customClass: {
      type: String,
      required: false,
      default: ''
    }
  },

  data() {
    return {
      open: false
    }
  },

  watch: {
    manualOpen() {
      this.open = this.manualOpen
    }
  },

  methods: {
    openDialog() {
      this.open = true
      this.$emit('open')
    },
    closeDialog() {
      this.open = false
      this.$emit('close')
    }
  }
})
</script>
