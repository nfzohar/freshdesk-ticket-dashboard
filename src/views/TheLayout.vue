<template>
  <div class="flex flex-col bg-secondary h-screen w-screen">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TheLayout',
})
</script>
