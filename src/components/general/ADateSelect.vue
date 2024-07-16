<template>
  <div>
    <h1 class="font-semibold" :class="labelClass" v-text="label" />
    <div class="flex items-center gap-x-5 w-full">
      <div class="flex flex-col w-full">
        <input
          v-model="inputValue"
          type="date"
          class="rounded-md bg-primary-600 shadow-primary-800 p-1 w-full"
          :class="inputClass"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ACheckbox',

  props: {
    theValue: {
      type: Object,
      required: false,
      default: () => {
        return {
          to: new Date(),
          from: new Date()
        }
      }
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
      inputValue: null
    }
  },

  watch: {
    inputValue() {
      this.emitSelectedDateRange()
    }
  },

  mounted() {
    this.inputValueTo = this.theValue
  },

  methods: {
    emitSelectedDateRange() {
      this.$emit('changed', this.inputValue ?? null)
    }
  }
})
</script>
