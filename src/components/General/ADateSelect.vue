<template>
  <div>
    <h1 class="font-semibold" v-text="label" />
    <div class="flex items-center gap-x-5 w-full">
      <div class="flex flex-col w-full">
        <label class="text-xs" :class="labelClass" v-text="'From'" />
        <input
          v-model="inputValueFrom"
          type="date"
          class="rounded-md bg-primary-600 shadow-md shadow-primary-800 p-1 w-full"
          :class="inputClass"
        />
      </div>
      <span v-text="'-'" />
      <div class="flex flex-col w-full">
        <label class="text-xs" :class="labelClass" v-text="'To'" />
        <input
          v-model="inputValueTo"
          type="date"
          class="rounded-md bg-primary-600 shadow-md shadow-primary-800 p-1 w-full"
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
      inputValueTo: null,
      inputValueFrom: null
    }
  },

  watch: {
    inputValue() {
      this.$emit('changed', { to: this.inputValueTo ?? null, from: this.inputValueFrom ?? null })
    }
  },

  mounted() {
    this.inputValueTo = this.theValue.to
    this.inputValueFrom = this.theValue.from
  }
})
</script>
