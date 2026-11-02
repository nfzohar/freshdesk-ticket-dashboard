<template>
  <nav :key="selectedTab" class="grid grid-cols-2 sm:grid-flow-col sm:auto-cols-fr gap-2 mb-6">
    <button
      v-for="(tabKeyword, i) in tabKeywords"
      :key="i"
      class="flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors"
      :class="[
        isCurrent(tabKeyword)
          ? 'border-primary-500 bg-primary/10 text-ink'
          : 'border-line text-ink-muted',
        selectTabOnClick ? 'hover:text-ink hover:bg-surface-2' : 'cursor-default'
      ]"
      :aria-current="isCurrent(tabKeyword) ? 'step' : undefined"
      @click="select(tabKeyword)"
    >
      <span
        class="grid place-items-center shrink-0 h-6 w-6 rounded-full text-xs font-semibold"
        :class="
          isCurrent(tabKeyword) ? 'bg-primary-500 text-on-primary' : 'bg-surface-2 text-ink-muted'
        "
        v-text="i + 1"
      />
      <span class="capitalize truncate" v-text="tabKeyword" />
    </button>
  </nav>

  <div class="block overflow-auto w-full">
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
    textClass(): string {
      return this.$information?.textOnPrimaryColor
    }
  },

  mounted() {
    this.selectedTab = this.slug(this.defaultSelectedTab)
  },

  methods: {
    slug(word: any) {
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
