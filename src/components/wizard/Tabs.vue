<template>
  <div :key="selectedTab" class="grid sm:grid-flow-col lg:auto-cols-auto gap-2 mb-2">
    <button
      v-for="(tabKeyword, i) in tabKeywords"
      :key="i"
      class="capitalize rounded-md px-2 py-1 w-full h-full text-center bg-primary-500"
      :class="[{ 'bg-primary-600': isCurrent(tabKeyword) }, textClass]"
      @click="select(tabKeyword)"
      v-text="tabKeyword"
    />
  </div>

  <div class="block overflow-auto w-full sm:border-0">
    <template v-for="(tabKeyword, i) in tabKeywords" :key="i">
      <template v-if="isCurrent(tabKeyword)">
        <slot v-if="$slots[`tab_${i + 1}`]" :name="`tab_${i + 1}`" />
        <slot v-if="$slots[slug(tabKeyword)]" :name="slug(tabKeyword)"
      /></template>
    </template>
  </div>
</template>

<script lang="ts">
import { toLower } from 'lodash'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TheTabs',

  props: {
    tabKeywords: {
      type: Array,
      required: true
    },
    defSelectedTab: {
      type: [Number, String],
      required: false,
      default: 1
    },
    selectTabOnClick: {
      type: Boolean,
      required: true,
      default: true
    }
  },

  data() {
    return {
      selectedTab: ''
    }
  },

  computed: {
    defaultSelectedTab() {
      return this.tabKeywords.includes(this.defSelectedTab)
        ? this.defSelectedTab
        : this.tabKeywords[this.defSelectedTab - 1]
    },
    textClass(): String {
      return this.$information?.textOnPrimaryColor
    }
  },

  mounted() {
    this.selectedTab = this.slug(this.defaultSelectedTab)
  },

  methods: {
    slug(word) {
      return toLower(word).replaceAll(' ', '_')
    },

    select(value: string) {
      if (this.selectTabOnClick) {
        let selectedSlug = this.slug(value)
        this.selectedTab = selectedSlug

        for (let i = 0; i < this.tabKeywords?.length; i++) {
          if (selectedSlug == this.slug(this.tabKeywords[i])) {
            this.$emit('selectedTabIndex', i + 1)
          }
        }
      }
    },

    isCurrent(value: string) {
      return this.selectedTab == this.slug(value)
    }
  }
})
</script>
