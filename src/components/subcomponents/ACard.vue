<template>
  <div class="flex flex-col rounded-md w-full bg-primary-500 border-secondary-600 px-3 py-2">
    <span class="font-bold" v-text="name" />
    <span v-if="subtitle" class="text-sm mb-2" v-text="subtitle" />

    <span class="text-sm">
      <span class="font-semibold" v-text="`${countLabel}: `" />
      <span v-text="count" />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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
  }
})
</script>
