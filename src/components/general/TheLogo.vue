<template>
  <div class="m-auto h-max w-max rounded-2xl bg-primary/10 p-2.5">
    <img
      v-if="customLoginImage"
      :src="customLoginImage"
      :style="{ width: `${ptWidth}pt`, height: `${ptHeight}pt` }"
      class="m-auto rounded-xl object-contain"
      alt=""
    />
    <svg
      v-else
      class="fill-primary-500"
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      :width="`${ptWidth}pt`"
      :height="`${ptHeight}pt`"
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M65,160 h470 a25,25 0 0 1 25,25 v65 a40,40 0 0 0 0,80 v65 a25,25 0 0 1 -25,25
        h-470 a25,25 0 0 1 -25,-25 v-65 a40,40 0 0 0 0,-80 v-65 a25,25 0 0 1 25,-25 z"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LogoIcon',

  props: {
    ptWidth: {
      type: [String, Number],
      required: false,
      default: 100
    },
    ptHeight: {
      type: [String, Number],
      required: false,
      default: 100
    }
  },

  computed: {
    customLoginImage(): string {
      return import.meta.env.VITE_LOGIN_ICON_URL
    }
  }
})
</script>
