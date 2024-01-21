<template>
  <div class="cursor-pointer">
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :width="ptWidth"
      :height="ptHeight"
      viewBox="0 0 118.04 122.88"
      xml:space="preserve"
      :fill="fillColor"
    >
      <path
        d="M16.08,59.26A8,8,0,0,1,0,59.26a59,59,0,0,1,97.13-45V8a8,8,0,1,1,16.08,0V33.35a8,8,0,0,1-8,8L80.82,43.62a8,8,0,1,1-1.44-15.95l8-.73A43,43,0,0,0,16.08,59.26Zm22.77,19.6a8,8,0,0,1,1.44,16l-10.08.91A42.95,42.95,0,0,0,102,63.86a8,8,0,0,1,16.08,0A59,59,0,0,1,22.3,110v4.18a8,8,0,0,1-16.08,0V89.14h0a8,8,0,0,1,7.29-8l25.31-2.3Z"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { colorIsDark } from '@/helpers/CommonMethods'

export default defineComponent({
  name: 'LogoIcon',

  props: {
    ptWidth: {
      type: String,
      required: false,
      default: '20pt'
    },
    ptHeight: {
      type: String,
      required: false,
      default: '20pt'
    }
  },

  computed: {
    fillColor() {
      return colorIsDark(import.meta.env.VITE_THEME_SECONDARY_COLOR) ? '#ffffff' : '#000000'
    }
  }
})
</script>
