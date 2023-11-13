<template>
  <div class="grid grid-cols-2 p-5">
    <div class="flex flex-col border-2 rounded-l-lg">
      <span
        style="background-color: black; color: white; margin-bottom: 16px; margin-left: 3px"
        v-text="'PRIMARY COLOR PALETE:'"
      />
      <span class="h-10 text-black px-4 w-full bg-primary-100" v-text="100" />
      <span class="h-10 text-black px-4 w-full bg-primary-200" v-text="200" />
      <span class="h-10 text-black px-4 w-full bg-primary-300" v-text="300" />
      <span class="h-10 text-black px-4 w-full bg-primary-400" v-text="400" />
      <span class="h-10 text-white px-4 w-full bg-primary-500" v-text="500" />
      <span class="h-10 text-white px-4 w-full bg-primary-600" v-text="600" />
      <span class="h-10 text-white px-4 w-full bg-primary-700" v-text="700" />
      <span class="h-10 text-white px-4 w-full bg-primary-800" v-text="800" />
    </div>
    <div class="flex flex-col border-2 rounded-r-lg">
      <span
        style="background-color: black; color: white; margin-bottom: 16px; margin-left: 3px"
        v-text="'SECONDARY COLOR PALETE:'"
      />
      <span class="h-10 text-black px-4 w-full bg-secondary-100" v-text="100" />
      <span class="h-10 text-black px-4 w-full bg-secondary-200" v-text="200" />
      <span class="h-10 text-black px-4 w-full bg-secondary-300" v-text="300" />
      <span class="h-10 text-black px-4 w-full bg-secondary-400" v-text="400" />
      <span class="h-10 text-white px-4 w-full bg-secondary-500" v-text="500" />
      <span class="h-10 text-white px-4 w-full bg-secondary-600" v-text="600" />
      <span class="h-10 text-white px-4 w-full bg-secondary-700" v-text="700" />
      <span class="h-10 text-white px-4 w-full bg-secondary-800" v-text="800" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NewComponentTemplate',

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
