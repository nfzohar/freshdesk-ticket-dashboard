<template>
  <div class="flex items-center my-1">
    <input
      v-model="inputValue"
      type="checkbox"
      :checked="inputValue"
      class="rounded-md w-5 h-5 mr-2"
      :class="inputClass"
    />
    <label :class="labelClass" v-text="label" />
  </div>
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
