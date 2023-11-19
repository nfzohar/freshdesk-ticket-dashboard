<template>
  <div class="w-full">
    <div class="flex items-center justify-between">
      <h1
        class="text-xl font-bold opacity-40 cursor-pointer"
        v-text="title"
        @click.stop="showFilterSection = !showFilterSection"
      />
      <button
        class="font-semibold hover:underline opacity-50 text-base"
        v-text="'Refresh'"
        @click.stop="$router.go(-1)"
      />
    </div>

    <div
      v-if="showFilterSection"
      class="flex items-center gap-x-3 rounded-md shadow-md shadow-primary-600 p-3"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 w-full gap-x-5">
        <a-select
          v-for="(filter, f) in filters"
          :key="f"
          :the-value="''"
          :label="filter"
          :options="[1, 2, 3, 4, 5, 6]"
          :label-field="'1'"
          :value-field="'1'"
          label-class="font-semibold mb-1"
          :input-class="['h-8 mb-2', { 'bg-primary-600': true }]"
        />
      </div>

      <div class="flex flex-col gap-y-5">
        <button
          class="bg-primary-500 hover:bg-primary-400 border border-primary-700 w-auto py-2 px-5 rounded-md shadow-primary-600 font-semibold"
          v-text="'Apply'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ASelect from '@/components/General/ASelect.vue'

export default defineComponent({
  name: 'TicketFilterSection',

  components: { ASelect },

  data() {
    return {
      showFilterSection: false,
      filters: [
        'Agents',
        'Groups',
        'Created at',
        'Status',
        'Priority',
        'Type',
        'Source',
        'Tags',
        'Companies',
        'Contacts'
      ]
    }
  },

  computed: {
    activeFilters() {
      return !this.filters
    },
    title() {
      if (this.activeFilters) {
        return 'Filters (' + this.activeFilters.length + ')'
      }
      return 'Filters'
    }
  }
})
</script>
