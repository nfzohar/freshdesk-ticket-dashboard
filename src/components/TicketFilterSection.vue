<template>
  <a-dialog>
    <template #trigger>
      <button
        class="primary-button w-32 text-center bg-primary-500 hover:bg-primary-600 border-none py-2 px-10 shadow-md shadow-primary-600"
        v-text="'Filter'"
        :title="'open filters modal'"
      />
    </template>

    <template #content>
      <div
        class="m-auto w-8/12 bg-secondary-500 border-primary-500 border rounded-md p-5 mt-10"
        :class="'text-white'"
      >
        <h1
          class="text-xl font-bold cursor-pointer"
          v-text="'Filters'"
          @click.stop="showFilterSection = !showFilterSection"
        />
        <hr class="mb-3 border-t-primary-500" />

        <div v-if="showFilterSection" class="flex flex-col gap-5 p-3">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 w-full gap-y-2 gap-x-5">
            <a-select
              v-for="(filter, f) in filteri"
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

          <button
            class="bg-primary-500 hover:bg-primary-400 border border-primary-700 w-full py-2 px-5 rounded-md shadow-primary-600 font-semibold"
            v-text="'Apply'"
          />
        </div>
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ADialog from './General/ADialog.vue'
import ASelect from '@/components/General/ASelect.vue'

export default defineComponent({
  name: 'TicketFilterSection',

  components: { ASelect, ADialog },

  props: {
    filtersList: {
      type: [Array, Object],
      required: false,
      default: () => []
    }
  },

  data() {
    return {
      showFilterSection: true,
      filters: [],
      filteri: [
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
    }
  },

  mounted() {},

  methods: {}
})
</script>
