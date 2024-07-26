<template>
  <div :key="Number(theValue)">
    <h1 class="font-semibold" :class="labelClass" v-text="label" />
    <div class="flex items-center gap-x-5 w-full">
      <div class="flex flex-col w-full">
        <input
          v-model="inputValue"
          type="date"
          class="rounded-md bg-primary-600 shadow-primary-800 p-1 w-full"
          :class="(inputClass, primaryColorText)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ADateSelect',

  props: {
    theValue: {
      type: [String, Date],
      required: false,
      default: ''
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

  computed: {
    primaryColorText(): String {
      return this.$information?.textOnPrimaryColor
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
