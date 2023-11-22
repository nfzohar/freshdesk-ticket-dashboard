<template>
  <svg
    v-if="[1, 2, 3].includes(spot)"
    class="stroke-primary-700"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    :width="ptWidth"
    :height="ptHeight"
    :fill="trophyColor"
    viewBox="0 0 24 24"
    style="enable-background: new 0 0 24 24"
    xml:space="preserve"
  >
    <g>
      <path
        d="M18,5.062V3H6v2.062H2V8c0,2.525,1.889,4.598,4.324,4.932C7.024,14.99,8.809,16.542,11,16.91V18c0,1.105-0.895,2-2,2H8v2h1    h2h2h2h1v-2h-1c-1.105,0-2-0.895-2-2v-1.09c2.191-0.368,3.976-1.92,4.676-3.978C20.111,12.598,22,10.525,22,8V5.062H18z M4,8V7.062    h2v3.766C4.836,10.416,4,9.304,4,8z M20,8c0,1.304-0.836,2.416-2,2.829V7.062h2V8z"
      />
    </g>
    <g id="Layer_1"></g>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TrophyIcon',

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
    },
    spot: {
      type: Number,
      requried: false,
      default: 1
    }
  },

  computed: {
    trophyColor() {
      switch (this.spot) {
        case 1: {
          return '#e8b923'
        }
        case 2: {
          return '#c0c0c0'
        }
        case 3: {
          return '#cd7f32'
        }
        default: {
          return '#ffffff'
        }
      }
    },
    trophyOutlineColor() {
      return import.meta.env.VITE_THEME_PRIMARY_COLOR ?? '#000000'
    }
  }
})
</script>
