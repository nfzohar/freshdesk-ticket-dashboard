<template>
  <div class="flex flex-col items-start w-full">
    <label :class="[labelClass, textSecondaryClass]" v-text="label" />
    <select
      v-model="inputValue"
      class="rounded-md w-full bg-primary-500 border-primary-700 shadow-primary-700 p-1 cursor-pointer"
      :class="[inputClass, textPrimaryClass]"
    >
      <option v-if="showNullValue" :value="''" v-text="nullValueLabel" />
      <option
        v-for="(option, o) in options"
        :key="o"
        class="bg-primary-500 border-primary-500 hover:bg-primary-500 hover:font-bold hover:text-secondary-500"
        :value="valueField ? get(option, valueField) : option"
        v-text="labelField ? get(option, labelField) : option"
      />
    </select>
  </div>
</template>

<script lang="ts">
import { get } from 'lodash'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ASelect',

  props: {
    theValue: {
      type: [String, Number],
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
      type: [String, Array],
      required: false,
      default: ''
    },
    labelClass: {
      type: String,
      required: false,
      default: ''
    },
    showNullValue: {
      type: Boolean,
      required: false,
      default: true
    },
    nullValueLabel: {
      type: String,
      required: false,
      default: 'All'
    }
  },

  emits: ['changed'],

  data() {
    return {
      inputValue: ''
    }
  },

  watch: {
    inputValue() {
      this.$emit('changed', this.inputValue)
    }
  },

  computed: {
    textPrimaryClass(): String {
      return this.$information?.textOnPrimaryColor
    },
    textSecondaryClass(): String {
      return this.$information?.textOnSecondaryColor
    }
  },

  mounted() {
    this.inputValue = this.theValue
  },

  methods: { get }
})
</script>
