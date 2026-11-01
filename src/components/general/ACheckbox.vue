<template>
  <label class="inline-flex items-center gap-2.5 my-1 cursor-pointer select-none">
    <input
      v-model="inputValue"
      type="checkbox"
      :checked="inputValue"
      class="h-4 w-4 shrink-0 rounded accent-primary-500 cursor-pointer"
      :class="inputClass"
    />
    <span class="text-sm" :class="labelClass" v-text="label" />
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ACheckbox',

  props: {
    theValue: {
      type: Boolean,
      required: false,
      default: false
    },
    label: {
      type: String,
      required: false,
      default: ''
    },
    inputClass: {
      type: String,
      required: false,
      default: ''
    },
    labelClass: {
      type: String,
      required: false,
      default: ''
    }
  },

  emits: ['changed'],

  data() {
    return {
      inputValue: false
    }
  },

  watch: {
    inputValue() {
      this.$emit('changed', this.inputValue)
    }
  },

  mounted() {
    this.inputValue = this.theValue
  }
})
</script>
