<template>
  <a-dialog custom-class="-mt-28 md:-mt-14">
    <template #trigger>
      <button
        class="primary-button w-32 text-center bg-primary-500 hover:bg-primary-600 border-none py-2 px-10 shadow-md shadow-primary-600"
        v-text="'Filter'"
        :title="'Open filters modal'"
      />
    </template>

    <template #content>
      <div
        class="m-auto w-8/12 bg-secondary-500 border-primary-500 border rounded-md p-5"
        :class="'text-white'"
      >
        <h1
          class="text-xl font-bold cursor-pointer"
          v-text="'Filters'"
          @click.stop="showFilterSection = !showFilterSection"
        />
        <hr class="mb-3 border-t-primary-500" />

        <div v-if="showFilterSection" class="flex flex-col gap-5 p-3">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 w-full gap-y-2 gap-x-5">
            <template v-for="(filter, f) in filters" :key="f">
              <a-select
                v-if="filter?.choices?.length"
                :the-value="''"
                :label="filter?.label"
                :options="filter?.choices"
                :label-field="'label'"
                :value-field="'value'"
                label-class="font-semibold mb-1"
                :input-class="['h-10 mb-2 p-2', { 'bg-primary-600': true }]"
                @changed="(value) => test(value, filter?.name)"
              />
            </template>
          </div>

          <button
            class="bg-primary-500 hover:bg-primary-400 border border-primary-700 w-full py-2 px-5 rounded-md shadow-primary-600 font-semibold"
            v-text="'Apply'"
            @click="applyTicketFilters()"
          />
        </div>
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import ADialog from '@/components/General/ADialog.vue'
import ASelect from '@/components/General/ASelect.vue'

export default defineComponent({
  name: 'TicketFilterSection',

  components: { ASelect, ADialog },

  data() {
    return {
      values: [],
      filters: [],
      showFilterSection: true
    }
  },

  async created() {
    await this.fetchAllTicketFields()
  },

  methods: {
    test(value, index) {
      this.values[index] = value
      console.log(this.values)
    },

    applyTicketFilters() {
      let valueKeys = Object.keys(this.values)

      console.log(valueKeys)

      // run through all entries, add non null entries to route as variables
    },

    async fetchAllTicketFields() {
      await ApiCall.get('admin/ticket_fields').then((response) => {
        if (response) {
          Object.values(response)
            .map((filter) => filter.id)
            .forEach((filterId) => {
              this.fetchTicketFieldOptions(filterId)
            })
        }
      })
    },

    async fetchTicketFieldOptions(filterId) {
      await ApiCall.get('admin/ticket_fields/' + filterId + '?include=section').then((response) => {
        let filter = response

        if (filter) {
          if (filter.name == 'agent') {
            filter['choices'] = this.$dashboard?.storedAgents
          }
          if (filter.name == 'group') {
            filter['choices'] = this.$dashboard?.storedGroups
          }

          this.filters.push(filter)

          if (filter.name == 'status') {
            this.$dashboard.statuses = filter?.choices
            this.setTicketCountSettings(filter?.choices)
          }
        }
      })
    },

    setTicketCountSettings(statuses) {
      if (!this.$dashboard?.ticket_counts?.settings.length) {
        let newTicketCountSettings = Array()
        let storedTicketCounts = this.$dashboard?.ticket_counts?.settings

        newTicketCountSettings['All'] = storedTicketCounts?.All
        newTicketCountSettings['Unresolved'] = storedTicketCounts?.Unresolved

        statuses.forEach((status) => {
          if (!newTicketCountSettings[status?.label]) {
            newTicketCountSettings[status?.label] = storedTicketCounts[status?.label]
          }
        })

        this.$dashboard.layout.ticket_counts.settings = newTicketCountSettings
      }
    }
  }
})
</script>
