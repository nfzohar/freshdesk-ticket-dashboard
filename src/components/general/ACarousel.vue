<template>
  <div class="flex items-center w-full h-full">
    <button class="p-5 text-5xl" @click="index--">
      <i class="fa fa-caret-left" />
    </button>

    <template v-for="(slideId, s) in slides" :key="s">
      <slot v-if="index == s" :id="slideId" :name="`slide_${s}`" />
    </template>

    <button class="p-5 text-5xl" @click="index++">
      <i class="fa fa-caret-right" />
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
      index: 0
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
    listenForKey('ArrowLeft', () => this.index--)
    listenForKey('ArrowRight', () => this.index++)
  },

  mounted() {
    let i = 0
    setInterval(() => {
      if (this.spinCarousel) {
        i > this.slides?.length - 1 ? (i = 0) : (this.index = i)
        i++
      }
    }, this.slideDuration)
  }
})
</script>
