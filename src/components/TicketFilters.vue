<template>
  <a-dialog :manual-open="open">
    <template #trigger>
      <button
        class="actions-button"
        :title="'Filters'"
        @click="open = true"
      >
        <i class="fa fa-filter" />
      </button>
    </template>

    <template #content>
      <div
        class="m-auto w-8/12 bg-secondary-500 border-primary-500 border rounded-md p-5"
        :class="'text-white'"
      >
        <h1 class="text-xl font-bold cursor-pointer" v-text="'Filters'" />
        <hr class="mb-3 border-t-primary-500" />

        <div class="grid grid-cols-1 md:grid-cols-2">
          <a-filter-section :section-title="'Leaderboards settings'">
            <span>1</span>
          </a-filter-section>

          <a-filter-section :section-title="'Leaderboards settings'">
            <span>1</span>
          </a-filter-section>
        </div>

        <div class="flex flex-col gap-5 p-3">
          <div class="grid grid-cols-1 lg:grid-cols-2 w-full gap-y-3 gap-x-5">
            <div class="grid grid-cols-2 gap-x-5">
              <a-date-select
                :label="'Created at (from):'"
                @changed="(value) => (createdAtFrom = value)"
              />
              <a-date-select
                :label="'Created at (to):'"
                @changed="(value) => (createdAtTo = value)"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5">
              <a-date-select
                :label="'Updated at (from):'"
                @changed="(value) => (updatedAtFrom = value)"
              />
              <a-date-select
                :label="'Updated at (to):'"
                @changed="(value) => (updatedAtTo = value)"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5">
              <a-date-select
                :label="'Closed at (from):'"
                @changed="(value) => (closedAtFrom = value)"
              />
              <a-date-select
                :label="'Closed at (to):'"
                @changed="(value) => (closedAtTo = value)"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5">
              <a-date-select
                :label="'Resolved at (from):'"
                @changed="(value) => (resolvedAtFrom = value)"
              />
              <a-date-select
                :label="'Resolved at (to):'"
                @changed="(value) => (resolvedAtTo = value)"
              />
            </div>
          </div>

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
                @changed="(value) => (values[filter?.name] = value)"
              />
            </template>
          </div>

          <div class="grid grid-cols-2 gap-16">
            <button
              class="bg-primary-500 hover:bg-primary-400 border border-primary-700 w-full py-2 px-5 rounded-md shadow-primary-600 font-semibold"
              v-text="'Reset'"
              @click="resetTicketFilters()"
            />

            <button
              class="bg-primary-500 hover:bg-primary-400 border border-primary-700 w-full py-2 px-5 rounded-md shadow-primary-600 font-semibold"
              v-text="'Apply'"
              @click="applyTicketFilters()"
            />
          </div>
        </div>
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import format from 'date-fns/format'
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import ADialog from '@/components/general/ADialog.vue'
import ASelect from '@/components/general/ASelect.vue'
import ADateSelect from '@/components/general/ADateSelect.vue'
import AFilterSection from '@/components/general/ASection.vue'

export default defineComponent({
  name: 'TicketFilterSection',

  components: { AFilterSection, ASelect, ADialog, ADateSelect },

  emits: ['filtersApply', 'filtersReset'],

  data() {
    return {
      values: [],
      filters: [],
      createdAtTo: '',
      createdAtFrom: '',
      updatedAtTo: '',
      updatedAtFrom: '',
      closedAtTo: '',
      closedAtFrom: '',
      resolvedAtTo: '',
      resolvedAtFrom: '',
      open: true
    }
  },

  async created() {
    await this.fetchAllTicketFields()
  },

  methods: {
    async fetchAllTicketFields() {
      await ApiCall.get('admin/ticket_fields').then((response) => {
        if (response) {
          Object.values(response)
            .map((filter) => filter?.id)
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
            this.$information.statuses = filter?.choices

            filter.choices = filter?.choices?.map((option) => {
              return { label: option?.label, value: option?.id }
            })
          }

          if (filter.name == 'ticket_type') {
            filter.name = 'type'
          }
        }
      })
    },

    applyTicketFilters() {
      let urlFilters = Array()

      console.log(this.values)

      if (this.createdAtFrom) {
        urlFilters.push("created_at:>'" + this.fdate(this.createdAtFrom) + "'")
      }
      if (this.createdAtTo) {
        urlFilters.push("created_at:<'" + this.fdate(this.createdAtTo) + "'")
      }
      if (this.updatedAtFrom) {
        urlFilters.push("updated_at:>'" + this.fdate(this.updatedAtFrom) + "'")
      }
      if (this.updatedAtTo) {
        urlFilters.push("updated_at:<'" + this.fdate(this.updatedAtTo) + "'")
      }
      if (this.closedAtFrom) {
        urlFilters.push("closed_at:>'" + this.fdate(this.closedAtFrom) + "'")
      }
      if (this.closedAtTo) {
        urlFilters.push("closed_at:<'" + this.fdate(this.closedAtTo) + "'")
      }
      if (this.resolvedAtFrom) {
        urlFilters.push("resolved_at:>'" + this.fdate(this.resolvedAtFrom) + "'")
      }
      if (this.resolvedAtTo) {
        urlFilters.push("resolved_at:<'" + this.fdate(this.resolvedAtTo) + "'")
      }

      Object.keys(this.values).forEach((value) => {
        if (this.values[value]) {
          if (typeof this.values[value] == 'string') {
            urlFilters.push(value + ":'" + this.values[value] + "'")
          } else {
            urlFilters.push(value + ':' + this.values[value])
          }
        }
      })

      this.$auth.setApiFilters(urlFilters?.length ? urlFilters.join(' AND ').trim() : '')
      this.$emit('filtersApply')
      this.open = false
    },

    resetTicketFilters() {
      this.$auth.setApiFilters('')
      this.$emit('filtersReset')
      this.open = false
    },

    fdate(dateString) {
      console.log(dateString)
      return format(new Date(dateString), 'yyyy-MM-dd')
    }
  }
})
</script>
