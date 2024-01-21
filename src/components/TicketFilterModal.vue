<template>
  <a-dialog custom-class="-mt-28 md:-mt-14" :manual-open="showFilterSection">
    <template #trigger>
      <button
        class="primary-button w-20 h-10 text-center bg-primary-500 hover:bg-primary-600 border-none py-2 shadow-md shadow-primary-600"
        v-text="'Filter'"
        :title="'Open filters modal'"
        @click="showFilterSection = true"
      />
    </template>

    <template #content>
      <div
        class="m-auto w-8/12 bg-secondary-500 border-primary-500 border rounded-md p-5"
        :class="'text-white'"
      >
        <h1 class="text-xl font-bold cursor-pointer" v-text="'Filters'" />
        <hr class="mb-3 border-t-primary-500" />

        <div v-if="showFilterSection" class="flex flex-col gap-5 p-3">
          <div class="grid grid-cols-1 lg:grid-cols-2 w-full gap-y-3 gap-x-5">
            <a-date-select :label="'Created at:'" @changed="(value) => (createdAt = value)" />
            <a-date-select :label="'Updated at:'" @changed="(value) => (updatedAt = value)" />
            <a-date-select :label="'Closed at:'" @changed="(value) => (createdAt = value)" />
            <a-date-select :label="'Resolved at:'" @changed="(value) => (updatedAt = value)" />
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
import { uniq } from 'lodash'
import format from 'date-fns/format'
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import ADialog from '@/components/General/ADialog.vue'
import ASelect from '@/components/General/ASelect.vue'
import ADateSelect from '@/components/General/ADateSelect.vue'

export default defineComponent({
  name: 'TicketFilterSection',

  components: { ASelect, ADialog, ADateSelect },

  emits: ['filtersApply', 'filtersReset'],

  data() {
    return {
      values: [],
      filters: [],
      showFilterSection: true,
      createdAt: { to: '', from: '' },
      updatedAt: { to: '', from: '' }
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
            this.$dashboard.statuses = filter?.choices
            this.setTicketCountSettings(filter?.choices)

            filter.choices = filter?.choices?.map((option) => {
              return { label: option?.label, value: option?.id }
            })
          }
        }
      })
    },

    setTicketCountSettings(statuses) {
      if (!this.$dashboard?.ticket_counts?.visibleCounts?.length) {
        let statusLabels = ['All', 'Unresolved']
        statuses.map((status) => statusLabels.push(status?.label))

        this.$dashboard.layout.ticket_counts.visibleCounts = uniq(statusLabels)
      }
    },

    applyTicketFilters() {
      let urlFilters = Array()

      urlFilters.push(
        this.createdAt?.from ? "created_at:>'" + this.fdate(this.createdAt?.from) + "'" : ''
      )
      urlFilters.push(
        this.createdAt?.to ? "created_at:<'" + this.fdate(this.createdAt?.to) + "'" : ''
      )
      urlFilters.push(
        this.updatedAt?.from ? "updated_at:>'" + this.fdate(this.updatedAt?.from) + "'" : ''
      )
      urlFilters.push(
        this.updatedAt?.to ? "updated_at:<'" + this.fdate(this.updatedAt?.to) + "'" : ''
      )

      Object.keys(this.values).forEach((value) => {
        if (this.values[value]) {
          if (typeof this.values[value] == 'string') {
            urlFilters.push(value + ':"' + this.values[value] + '"')
          } else {
            urlFilters.push(value + ':' + this.values[value])
          }
        }
      })

      this.$store.setApiFilters(urlFilters?.length ? urlFilters.join(' AND ').trim() : '')
      this.$emit('filtersApply')
      this.showFilterSection = false
    },

    resetTicketFilters() {
      this.$store.setApiFilters('')
      this.$emit('filtersReset')
      this.showFilterSection = false
    },

    fdate(dateString) {
      console.log(dateString)
      return format(new Date(dateString), 'yyyy-mm-dd')
    }
  }
})
</script>
