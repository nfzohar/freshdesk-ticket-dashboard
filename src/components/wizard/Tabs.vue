<template>
  <div :key="selectedTab" class="grid sm:grid-flow-col lg:auto-cols-auto gap-2 mb-2">
    <button
      v-for="(tabKeyword, i) in tabKeywords"
      :key="i"
      class="capitalize rounded-md px-2 py-1 w-full h-full text-center bg-primary-500"
      :class="{ 'bg-primary-600': isCurrent(tabKeyword) }"
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
  props: {
    tabKeywords: {
      type: Array,
      required: true
    },
    defSelectedTab: {
      type: [Number, String],
      required: false,
      default: 1
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
    }
  },

  mounted() {
    this.selectedTab = this.$route.query.tab
      ? String(this.$route.query.tab)
      : this.slug(this.defaultSelectedTab)

    this.setUrlTab()
  },

  methods: {
    slug(word) {
      return toLower(word).replaceAll(' ', '_')
    },

    select(value: string) {
      this.selectedTab = this.slug(value)
    },

    isCurrent(value: string) {
      return this.selectedTab == this.slug(value)
    },

    setUrlTab() {
      if (this.modifyUrl) {
        this.$router.push({
          query: { ...this.$route.query, tab: this.selectedTab }
        })
      }
    }
  }
})
</script>
