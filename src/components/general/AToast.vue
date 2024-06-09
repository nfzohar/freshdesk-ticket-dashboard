<template>
  <div class="grid grid-cols-2 grid-rows-1 p-0">
    <button class="text-sm font-semibold hover:underline uppercase" v-text="'Close'" />
    <button
      class="text-sm font-semibold hover:underline uppercase"
      @click.stop="closeAll()"
      v-text="'Close all'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'CustomToastCloseButton',

  methods: {
    closeAll() {
      useToast().clear()
    }
  }
})
</script>
