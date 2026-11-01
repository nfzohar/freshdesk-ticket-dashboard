<template>
  <div @click="openDialog">
    <slot :name="'trigger'" />
  </div>

  <a-overlay
    v-if="open"
    closable
    :title="title"
    :subtitle="subtitle"
    :icon="icon"
    :size="size"
    :body-class="bodyClass"
    @close="closeDialog"
  >
    <slot :name="'content'" />

    <template v-if="$slots.headerActions" #headerActions>
      <slot name="headerActions" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </a-overlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AOverlay from '@/components/general/AOverlay.vue'

export default defineComponent({
  name: 'ADialog',

  components: { AOverlay },

  emits: ['open', 'close'],

  props: {
    manualOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    subtitle: {
      type: String,
      required: false,
      default: ''
    },
    icon: {
      type: String,
      required: false,
      default: ''
    },
    size: {
      type: String,
      required: false,
      default: 'lg'
    },
    bodyClass: {
      type: String,
      required: false,
      default: 'px-6 py-5'
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
