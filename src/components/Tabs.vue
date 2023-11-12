<template>
  <div :key="selectedTab" class="hidden lg:grid lg:grid-flow-col lg:auto-cols-auto gap-2 mb-2">
    <span v-for="(tabKeyword, i) in tabKeywords" :key="i"
      class="rounded-md px-2 py-1 w-full cursor-pointer transition-all h-full flex items-center justify-center" :class="[
        customClassTabs,
        isCurrent(tabKeyword)
          ? 'font-bold text-white bg-primary-500'
          : 'text-gray-700 dark:text-white bg-gray-200 dark:bg-dark-mode-600 hover:bg-gray-300  dark:hover:bg-dark-mode-500 ',
      ]" @click="select(tabKeyword)" v-text="tabKeyword" />
  </div>

  <div :key="selectedTab" class="block lg:hidden w-full mb-1">
    <select v-model="selectedTab" class="block w-full py-1 my-2 text-lg font-bold cursor-pointer basic-button h-10">
      <option v-for="(keyword, i) in tabKeywords" :key="i" class="option" :value="slug(keyword)" v-text="keyword" />
    </select>
  </div>

  <div class="block overflow-auto w-full sm:border-0">
    <template v-for="(tabKeyword, i) in tabKeywords" :key="i">
      <slot v-if="isCurrent(tabKeyword)" :name="slug(tabKeyword)" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    tabKeywords: {
      type: Array,
      required: true,
    },
    defSelectedTab: {
      type: [Number, String],
      required: false,
      default: 1,
    },
    customClassTabs: {
      type: String,
      required: false,
      default: '',
    },
  },

  emits: ['tabSwitched'],

  data() {
    return {
      selectedTab: '',
    }
  },

  computed: {
    defaultSelectedTab() {
      return this.tabKeywords.includes(this.defSelectedTab)
        ? this.defSelectedTab
        : this.tabKeywords[this.defSelectedTab - 1]
    },
  },

  mounted() {
    this.selectedTab = this.$route.query.tab
      ? String(this.$route.query.tab)
      : this.slug(this.defaultSelectedTab)

    this.setUrlTab()
  },

  methods: {
    slug(word) {
      return String(word).toLowerCase().replace(' ', '_')
    },

    select(value: string) {
      this.selectedTab = this.slug(value)

      this.setUrlTab()
      this.$emit('tabSwitched', this.selectedTab)
    },

    isCurrent(value: string) {
      return this.selectedTab == this.slug(value)
    },

    setUrlTab() {
      this.$router.push({
        query: { ...this.$route.query, tab: this.selectedTab },
      })
    },
  },
})
</script>
