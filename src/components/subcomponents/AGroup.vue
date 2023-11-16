<template>
  <div class="rounded-md w-full bg-primary-500 border-secondary-600 px-3 py-2">
    <span class="block font-bold">Group name</span>
    <span class="block">Ticket s in group count</span>

    <span class="block">Latets Ticket in group count</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AGroup',

  props: {
    gruop: {
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
