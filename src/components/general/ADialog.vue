<template>
  <div @click="openDialog">
    <slot :name="'trigger'" />
  </div>

  <div v-if="open">
    <dialog
      class="absolute bg-opacity-50 bg-secondary-500 top-0 w-screen h-screen"
      :class="customClass"
      :open="open"
      @close="closeDialog"
    >
      <div class="absolute right-2 top-10 cursor-pointer">
        <div
          class="mx-5 bg-secondary-500 border border-primary-500 rounded-md"
          @click.stop="closeDialog"
        >
          <i class="fa fa-times text-3xl px-2 py-1 text-primary-500" />
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
import { listenForKey } from '@/helpers/CommonMethods'

export default defineComponent({
  name: 'ADialog',

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
      this.manualOpen ? this.openDialog() : this.closeDialog()
    }
  },

  mounted() {
    listenForKey('escKey', () => this.closeDialog())
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
