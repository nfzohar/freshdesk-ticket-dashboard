<template>
  <div class="flex flex-col items-start w-full">
    <label :class="labelClass" v-text="label" />
    <select
      v-model="inputValue"
      class="rounded-md w-full bg-primary-500 border-primary-700 shadow-primary-700 shadow-md p-1 cursor-pointer"
      :class="inputClass"
    >
      <option :value="''" v-text="'All'" />
      <option
        v-for="(option, o) in options"
        :key="o"
        class="bg-secondary-500 border-primary-500 hover:bg-primary-500 hover:text-secondary-500"
        :value="option[valueField]"
        v-text="option[labelField]"
      />
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ASelect',

  props: {
    theValue: {
      type: String,
      required: false,
      default: ''
    },
    label: {
      type: String,
      required: false,
      default: ''
    },
    options: {
      type: [Object, Array],
      required: false,
      default: () => []
    },
    labelField: {
      type: String,
      required: false,
      default: ''
    },
    valueField: {
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
