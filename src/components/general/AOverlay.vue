<template>
  <!-- Teleported so a parent's .is-loading (pointer-events: none) or transform can't affect it. -->
  <teleport to="body">
    <div
      class="fixed inset-0 z-[200] flex p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      :aria-label="title || undefined"
    >
      <div
        class="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm motion-safe:animate-fade-in"
        aria-hidden="true"
        @click="closable && $emit('close')"
      />

      <section
        class="card relative m-auto w-full max-h-full flex flex-col shadow-2xl motion-safe:animate-dialog-in"
        :class="sizeClass"
      >
        <header
          v-if="title || closable || $slots.headerActions"
          class="flex items-start gap-4 shrink-0 px-6 pt-5 pb-4"
          :class="{ 'border-b border-line': title }"
        >
          <div
            v-if="icon"
            class="grid place-items-center shrink-0 h-10 w-10 rounded-xl bg-primary/10 text-primary-500"
          >
            <i :class="icon" />
          </div>

          <div class="flex-1 min-w-0">
            <h2 v-if="title" class="text-lg font-semibold leading-6" v-text="title" />
            <p v-if="subtitle" class="mt-0.5 text-sm text-ink-muted" v-text="subtitle" />
          </div>

          <slot name="headerActions" />

          <button
            v-if="closable"
            class="actions-button -mr-2 -mt-1"
            :title="'Close (Esc)'"
            @click.stop="$emit('close')"
          >
            <i class="fa fa-xmark text-lg" />
          </button>
        </header>

        <!-- Header and footer stay put; the body scrolls when the dialog is taller than the viewport. -->
        <div class="flex-1 min-h-0 overflow-y-auto" :class="bodyClass">
          <slot />
        </div>

        <footer
          v-if="$slots.footer"
          class="flex flex-wrap items-center justify-between gap-3 shrink-0 px-6 py-4 border-t border-line bg-surface-2/50 rounded-b-xl"
        >
          <slot name="footer" />
        </footer>
      </section>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { listenForKey } from '@/helpers/CommonMethods'

const sizes: Record<string, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-[min(96vw,1600px)]'
}

export default defineComponent({
  name: 'AOverlay',

  emits: ['close'],

  props: {
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
      default: 'md'
    },
    bodyClass: {
      type: String,
      required: false,
      default: 'px-6 py-5'
    },
    closable: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      removeEscListener: undefined as (() => void) | undefined
    }
  },

  computed: {
    sizeClass(): string {
      return sizes[this.size] ?? sizes.md
    }
  },

  mounted() {
    if (this.closable) {
      this.removeEscListener = listenForKey('Escape', () => this.$emit('close'))
    }
  },

  beforeUnmount() {
    this.removeEscListener?.()
  }
})
</script>
