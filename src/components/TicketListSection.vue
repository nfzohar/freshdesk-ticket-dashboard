<template>
  <div class="w-full">
    <h1 class="text-xl font-bold opacity-40" v-text="'Tickets'" />

    <div
      class="flex flex-col gap-y-4 md:flex-row-reverse items-start border border-primary-900 w-full rounded-lg p-3 shadow-md shadow-primary-600"
    >
      <div class="flex flex-col w-full md:w-3/12 md:ml-3 md:pl-3 md:border-l border-primary-700">
        <a-select
          v-for="(filter, f) in filters"
          :key="f"
          :the-value="''"
          :label="filter"
          :options="[1, 2, 3, 4, 5, 6]"
          :label-field="'1'"
          :value-field="'1'"
          input-class="h-8 mb-2"
          label-class="font-semibold mb-1"
        />

        <button
          v-if="activeFilters"
          class="bg-primary-600 hover:bg-primary-400 border border-primary-700 w-full my-4 py-2 px-5 rounded-md shadow-primary-600 font-semibold"
          v-text="'Apply'"
        />
        <button
          v-else
          class="bg-primary-600 hover:bg-primary-400 border border-primary-700 w-full my-4 py-2 px-5 rounded-md shadow-primary-600 font-semibold"
          v-text="'Refresh'"
          @click.stop="$router.go(-1)"
        />
      </div>

      <hr class="md:hidden border w-full border-primary-700 mb-4" />

      <div
        class="flex flex-col gap-y-4 w-full md:w-9/12 overflow-y-scroll scrollbar-hide"
        style="max-height: 44vh"
      >
        <a-ticket v-for="(ticket, t) in tickets" :key="t" :ticket="ticket" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import ASelect from '@/components/General/ASelect.vue'
import ATicket from '@/components/subcomponents/ATicket.vue'

export default defineComponent({
  name: 'TicketListSection',

  components: { ATicket, ASelect },

  data() {
    return {
      tickets: [1, 2, 3, 4, 5],
      filters: ['Tags', 'Type', 'Status', 'Priority', 'Groups', 'Created at']
    }
  },

  computed: {
    activeFilters() {
      return !this.filters.length > 0
    }
  },

  mounted() {
    this.getTicketGroups()
  },

  methods: {
    getTicketGroups() {}
  }
})
</script>
