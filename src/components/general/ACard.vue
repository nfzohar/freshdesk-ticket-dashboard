<template>
  <div
    class="flex items-center justify-between rounded-md w-full h-full bg-primary-500 border-secondary-600 px-3 py-2"
    :class="`text-${primaryColorIsDark ? 'white' : 'black'}` "
  >
    <div class="flex flex-col w-full h-full">
      <span class="font-bold" v-text="name" />
      <span v-if="subtitle" class="text-sm mb-2" v-text="subtitle" />

      <span class="text-sm" v-html="`<b>${countLabel}:</B> ${count}`" />
    </div>

    <slot v-if="$slots['card-icon']" :name="'card-icon'" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { colorIsDark } from '@/helpers/CommonMethods';

export default defineComponent({
  name: 'ACard',

  props: {
    name: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: false,
      default: ''
    },
    count: {
      type: [Number, String],
      required: false,
      default: 0
    },
    countLabel: {
      type: String,
      required: false,
      default: 'Count of tickets'
    }
  },

  computed:{
    primaryColorIsDark(): Boolean{
      return Boolean(colorIsDark(import.meta.env.VITE_THEME_PRIMARY_COLOR))
    }
  }

})
</script>
