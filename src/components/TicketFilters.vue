<template>
  <a-dialog :manual-open="true">
    <template #trigger>
      <button class="actions-button" :title="'Filters'" @click="open = true">
        <i class="fa fa-filter" />
      </button>
    </template>

    <template #content>
      <div
        class="flex flex-col m-auto w-9/12 bg-secondary-500 border-primary-500 border rounded-md p-5"
        :class="[secondaryColorText, { 'is-loading': isLoading }]"
      >
        <h1 class="text-xl font-bold cursor-pointer" v-text="'Filters'" />

        <div class="grid grid-cols-2 md:flex items-center">
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
          <a-filter-section
            :section-title="'Closed at'"
            :body-class="'flex items-center justify-between p-2'"
          >
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
          <a-filter-section
            :section-title="'Resolved at'"
            :body-class="'flex items-center justify-between p-2'"
          >
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

        <div class="grid grid-cols-4">
          <template v-for="(filter, f) in filters" :key="f">
            <a-filter-section
              v-if="filter?.choices?.length"
              :section-title="filter?.label"
              :body-class="'w-full h-auto p-2'"
            >
              <a-select
                :the-value="''"
                :options="filter?.choices"
                :value-field="filter?.label_field ?? 'value'"
                :label-field="filter?.value_field ?? 'label'"
                :input-class="'bg-primary-600'"
                @changed="(value) => (values[filter?.name] = value)"
              />
            </a-filter-section>
          </template>
        </div>

        <div class="flex items-center justify-between w-full">
          <button
            :class="`filters-action ${primaryColorText}`"
            v-text="'Reset'"
            @click="resetTicketFilters()"
          />
          <button
            :class="`filters-action ${primaryColorText}`"
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
      },
      isLoading: false
    }
  },

  computed: {
    primaryColorText(): String {
      return this.$information?.textOnPrimaryColor
    },
    secondaryColorText(): String {
      return this.$information?.textOnSecondaryColor
    }
  },

  async created() {
    await this.fetchAllTicketFields()
  },

  methods: {
    async fetchAllTicketFields() {
      this.isLoading = true

      await ApiCall.get('admin/ticket_fields')
        .then((response) => {
          if (response) {
            Object.values(response)
              .map((filter) => filter?.id)
              .forEach((filterId) => {
                this.fetchTicketFieldOptions(filterId)
              })
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    async fetchTicketFieldOptions(filterId) {
      await ApiCall.get('admin/ticket_fields/' + filterId + '?include=section').then((response) => {
        let filter = response

        if (filter) {
          if (filter.name == 'agent') {
            filter['choices'] = this.$information?.storedAgents
            filter['label_field'] = 'contact.name'
            filter['value_field'] = ''
          }
          if (filter.name == 'group') {
            filter['choices'] = this.$information?.storedGroups
            filter['label_field'] = ''
            filter['value_field'] = ''
          }
          if (filter.name == 'status') {
            filter['choices'] = this.$information?.storedStatuses
            filter['label_field'] = ''
            filter['value_field'] = ''
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

          this.filters.push(filter)
        }
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

<style>
.filters-action {
  @apply bg-primary-500 hover:bg-primary-400 border border-primary-700 w-max py-2 px-5 rounded-md shadow-primary-600 font-semibold;
}
</style>
