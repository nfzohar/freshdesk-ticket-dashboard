<template>
  <div :key="Number(theValue)">
    <label class="field-label" :class="labelClass" v-text="label" />
    <input v-model="inputValue" type="date" class="input" :class="inputClass" :aria-label="label" />
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
