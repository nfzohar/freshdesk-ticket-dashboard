<template>
  <span v-text="'This is a Dashboard.'" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TheDashboard',

  props: {
    customClass: {
      type: String,
      required: false,
      default: 'text-sm w-auto text-left text-primary'
    }
  },

  emits: [],

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
