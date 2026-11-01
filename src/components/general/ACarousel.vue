<template>
  <div class="flex items-center w-full h-full">
    <button class="carousel-nav" :title="'Previous panel'" @click="index--">
      <i class="fa fa-chevron-left" />
    </button>

    <template v-for="(slideId, s) in slides" :key="s">
      <slot v-if="index == s" :id="slideId" :name="`slide_${s}`" />
    </template>

    <button class="carousel-nav" :title="'Next panel'" @click="index++">
      <i class="fa fa-chevron-right" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { listenForKey } from '@/helpers/CommonMethods'

export default defineComponent({
  name: 'ACarousel',

  props: {
    spinCarousel: {
      type: Boolean,
      requred: true,
      default: true
    },
    slides: {
      type: Array,
      requred: true,
      default: () => []
    },
    slideDurationMinutes: {
      type: Number,
      requred: true,
      default: 2
    }
  },

  data() {
    return {
      index: 0,
      intervalId: undefined as ReturnType<typeof setInterval> | undefined,
      removeKeyListeners: [] as (() => void)[]
    }
  },

  computed: {
    slideDuration() {
      return this.slideDurationMinutes * 1000 * 60
    }
  },

  watch: {
    index() {
      let lastIndex = this.slides?.length - 1

      if (this.index < 0) {
        this.index = lastIndex
      }
      if (this.index > lastIndex) {
        this.index = 0
      }
    }
  },

  created() {
    this.removeKeyListeners = [
      listenForKey('ArrowLeft', () => this.index--),
      listenForKey('ArrowRight', () => this.index++)
    ]
  },

  mounted() {
    let i = 0
    this.intervalId = setInterval(() => {
      if (this.spinCarousel) {
        i > this.slides?.length - 1 ? (i = 0) : (this.index = i)
        i++
      }
    }, this.slideDuration)
  },

  beforeUnmount() {
    clearInterval(this.intervalId)
    this.removeKeyListeners.forEach((removeListener) => removeListener())
  }
})
</script>

<style scoped>
.carousel-nav {
  @apply grid place-items-center shrink-0 m-4 h-12 w-12 rounded-full border border-line bg-surface text-lg text-ink-muted shadow-sm transition-colors hover:text-ink hover:bg-surface-2;
}
</style>
