<template>
  <div class="rounded-md w-full bg-primary-500 border-secondary-600 px-3 py-2">
    <span class="block font-bold">Tag name</span>
    <span class="block">Ticket s in tag count</span>

    <span class="block">Latets Ticket with tag count</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ATag',

  props: {
    tag: {
      type: [Object, Array],
      required: false,
      default: () => []
    }
  },

  data() {
    return {}
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {}
})
</script>
