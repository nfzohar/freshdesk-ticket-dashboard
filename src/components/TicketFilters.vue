<template>
  <a-dialog :manual-open="true">
    <template #trigger>
      <button class="actions-button" :title="'Filters'" @click="open = true">
        <i class="fa fa-filter" />
      </button>
    </template>

    <template #content>
      <div
        class="m-auto w-8/12 bg-secondary-500 border-primary-500 border rounded-md p-5"
        :class="'text-white'"
      >
        <h1 class="text-xl font-bold cursor-pointer" v-text="'Filters'" />

        <div class="grid grid-cols-1 md:grid-cols-2">
          <!-- Created at -->
          <a-filter-section
            :section-title="'Created at:'"
            :body-class="'flex items-center justify-between p-2'"
          >
            <a-date-select
              :label="'From:'"
              :class="'w-full'"
              :label-class="'text-sm font-normal'"
              @changed="(value) => (createdAt.from = value)"
            />
            <span class="font-bold px-5" v-text="'-'" />
            <a-date-select
              :label="'To:'"
              :class="'w-full'"
              :label-class="'text-sm font-normal'"
              @changed="(value) => (createdAt.to = value)"
            />
          </a-filter-section>

          <!-- Updated at -->
          <a-filter-section
            :section-title="'Updated at:'"
            :body-class="'flex items-center justify-between p-2'"
          >
            <a-date-select
              :label="'From:'"
              :class="'w-full'"
              :label-class="'text-sm font-normal'"
              @changed="(value) => (updatedAt.from = value)"
            />
            <span class="font-bold px-5" v-text="'-'" />
            <a-date-select
              :label="'To:'"
              :class="'w-full'"
              :label-class="'text-sm font-normal'"
              @changed="(value) => (updatedAt.to = value)"
            />
          </a-filter-section>

          <!-- Closed at -->
          <a-filter-section :section-title="'Closed at'">
            <a-date-select
              :label="'From:'"
              :class="'w-full'"
              :label-class="'text-sm font-normal'"
              @changed="(value) => (closedAt.from = value)"
            />
            <span class="font-bold px-5" v-text="'-'" />
            <a-date-select
              :label="'To:'"
              :class="'w-full'"
              :label-class="'text-sm font-normal'"
              @changed="(value) => (closedAt.to = value)"
            />
          </a-filter-section>

          <!-- Resolved at -->
          <a-filter-section :section-title="'Resolved at'">
            <a-date-select
              :label="'From:'"
              :class="'w-full'"
              :label-class="'text-sm font-normal'"
              @changed="(value) => (resolvedAt.from = value)"
            />
            <span class="font-bold px-5" v-text="'-'" />
            <a-date-select
              :label="'To:'"
              :class="'w-full'"
              :label-class="'text-sm font-normal'"
              @changed="(value) => (resolvedAt.to = value)"
            />
          </a-filter-section>
        </div>

        <a-filter-section
          :body-class="'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 w-full gap-y-2 gap-x-5'"
        >
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
        </a-filter-section>

        <!-- --------------------------------------------------------------------------------------- -->

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
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import { fdate } from '@/helpers/CommonMethods'
import ADialog from '@/components/general/ADialog.vue'
import ASelect from '@/components/general/ASelect.vue'
import ADateSelect from '@/components/general/ADateSelect.vue'
import AFilterSection from '@/components/general/ASection.vue'

export default defineComponent({
  name: 'TicketFilterSection',

  components: { AFilterSection, ASelect, ADialog, ADateSelect },

  emits: ['filtersUpdated'],

  data() {
    return {
      open: true,
      values: [],
      filters: [],
      createdAt: {
        from: '',
        to: ''
      },
      updatedAt: {
        from: '',
        to: ''
      },
      closedAt: {
        from: '',
        to: ''
      },
      resolvedAt: {
        from: '',
        to: ''
      }
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
            filter['choices'] = this.$information?.storedAgents
          }
          if (filter.name == 'group') {
            filter['choices'] = this.$information?.storedGroups
          }
          if (filter.name == 'status') {
            filter['choices'] = this.$information?.storedStatuses
          }
          if (filter.name == 'source') {
            filter['choices'] = this.$information?.storedSources
          }
          if (filter.name == 'priority') {
            filter['choices'] = this.$information?.storedPriorities
          }
          if (filter.name == 'ticket_type') {
            filter.name = 'type'
          }
        }

        this.filters.push(filter)
      })
    },

    applyTicketFilters() {
      let urlFilters = Array()

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

      this.$information.setFilters([])
      this.$emit('filtersUpdated')
      this.open = false
    },

    resetTicketFilters() {
      this.$information.setFilters([])
      this.$emit('filtersUpdated')
      this.open = false
    },

    fdate(dateString) {
      return fdate(dateString, 'yyyy-MM-dd')
    }
  }
})
</script>
