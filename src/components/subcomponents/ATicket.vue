<template>
  <div class="flex items-center p-3 bg-primary-500 border-primary-600 border-2 rounded-md shadow-primary-700 shadow-md">
    <div class="w-10/12">
      <span class="block font-bold text-lg">ID: Subject</span>
      <span class="block text-base">Ticket Author</span>
      <span class="block font-semibold mt-1">Tags:</span>
    </div>

    <div class="w-2/12">
      <span class="block w-max m-auto">Status</span>
    </div>

    <span class="block"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ATicket',

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
