<template>
  <a-dialog
    :manual-open="open"
    size="xl"
    icon="fa fa-filter"
    :title="'Filters'"
    :subtitle="'Narrow down the tickets shown on the dashboard.'"
    @open="$emit('open')"
    @close="$emit('close')"
  >
    <template #trigger>
      <button class="actions-button" :title="'Filters'" @click="open = true">
        <i class="fa fa-filter" />
      </button>
    </template>

    <template #content>
      <div class="flex flex-col gap-4" :class="{ 'is-loading': isLoading }">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div class="flex flex-col gap-4 lg:col-span-2">
            <a-filter-section
              v-for="(date, d) in dates"
              :key="d"
              :section-title="date?.title"
              :body-class="'grid grid-cols-2 gap-3'"
            >
              <a-date-select
                :the-value="date['from']"
                :label="'From'"
                @changed="(value) => (date.from = value)"
              />
              <a-date-select
                :the-value="date['to']"
                :label="'To'"
                @changed="(value) => (date.to = value)"
              />
            </a-filter-section>
          </div>

          <a-filter-section
            :key="filters?.length"
            class="lg:col-span-3"
            :section-title="'Ticket fields'"
            :body-class="'grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1'"
          >
            <template v-for="(filter, f) in filters" :key="f">
              <a-select
                v-if="filter?.choices?.length"
                :the-value="filter.value"
                :label="filter?.label"
                :options="filter?.choices"
                :show-null-value="true"
                :null-value-label="'All'"
                :label-field="ticketFieldsLabel(filter)"
                :value-field="ticketFieldsValue(filter)"
                @changed="(value) => (filter.value = value)"
              />
            </template>
          </a-filter-section>
        </div>

        <a-filter-section :section-title="'Saved presets'" :body-class="'flex flex-col gap-3'">
          <div class="flex gap-2">
            <input
              v-model="filterPresetName"
              class="input"
              type="text"
              :placeholder="'Name the current filters to save them as a preset…'"
              :aria-label="'Preset name'"
              @keydown.enter="addNewPreset(filters, dates)"
            />
            <button
              class="btn-secondary shrink-0"
              :title="'Save current filters as a preset.'"
              @click="addNewPreset(filters, dates)"
            >
              <i class="fa fa-bookmark" />
              <span v-text="'Save'" />
            </button>
          </div>

          <div :key="filters?.length" class="flex flex-wrap gap-2">
            <span
              v-if="!filterPresets?.length"
              class="text-sm text-ink-muted"
              v-text="'No presets created yet.'"
            />
            <div
              v-for="(preset, p) in filterPresets"
              :key="p"
              class="inline-flex items-center rounded-full border border-line bg-surface-2 text-sm"
            >
              <button
                class="pl-3 pr-1 py-1 font-medium hover:text-primary-500"
                :title="'Apply this preset'"
                @click="updateFilters(preset)"
                v-text="preset?.name"
              />
              <button
                class="grid place-items-center h-7 w-7 rounded-full text-ink-muted hover:text-ink hover:bg-surface"
                :title="`Delete preset ${preset?.name}`"
                @click.stop="removePreset(preset?.name)"
              >
                <i class="fa fa-xmark text-xs" />
              </button>
            </div>
          </div>
        </a-filter-section>
      </div>
    </template>

    <template #footer>
      <button class="btn-ghost" @click="updateFilters([])">
        <i class="fa fa-rotate-left" />
        <span v-text="'Reset filters'" />
      </button>
      <button class="btn-primary" @click="updateFilters(allCurrentFilters)">
        <i class="fa fa-check" />
        <span v-text="'Apply filters'" />
      </button>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ADialog from '@/components/general/ADialog.vue'
import ASelect from '@/components/general/ASelect.vue'
import ADateSelect from '@/components/general/ADateSelect.vue'
import AFilterSection from '@/components/general/ASection.vue'

export default defineComponent({
  name: 'TicketFilterSection',

  components: { AFilterSection, ASelect, ADialog, ADateSelect },

  emits: ['filtersUpdated', 'open', 'close'],

  data() {
    return {
      filters: new Array(),
      filterPresetName: '',
      isLoading: false,
      open: false,
      dates: {
        createdAt: {
          title: 'Created at',
          field: 'created_at',
          from: '',
          to: ''
        },
        updatedAt: {
          title: 'Updated at',
          field: 'updated_at',
          from: '',
          to: ''
        },
        closedAt: {
          title: 'Closed at',
          field: 'closed_at',
          from: '',
          to: ''
        },
        resolvedAt: {
          title: 'Resolved at',
          field: 'resolved_at',
          from: '',
          to: ''
        }
      },
      dateRangeShortcuts: ['today', 'this week', 'this month', 'this year']
    }
  },

  computed: {
    allCurrentFilters(): any {
      return {
        field_filters: this.filters,
        date_filters: this.dates
      }
    },
    filterPresets(): any {
      return this.$information?.savedFilterSets
    },
    primaryColorText(): string {
      return this.$information?.textOnPrimaryColor
    },
    secondaryColorText(): string {
      return this.$information?.textOnSecondaryColor
    },
    storedFilters(): Array<any> {
      return Object.values(this.$information?.storedFilters ?? [])
    },
    storedDateFilters(): Array<any> {
      return Object.values(this.$information?.storedDateFilters ?? this.dates)
    },
    storedTicketFields(): Array<any> {
      return Object.values(this.$information?.storedAdminTicketFields)
    }
  },

  mounted() {
    this.generateTicketFilters()
  },

  methods: {
    generateTicketFilters() {
      if (!this.storedFilters?.length) {
        let listOfFilters = this.storedTicketFields

        listOfFilters.map((filter) => {
          filter['value'] = ''
        })
        this.filters = listOfFilters
        this.dates = this.dates
        return
      }

      this.filters = this.storedFilters
      this.dates = this.storedDateFilters
    },

    updateFilters(filtersObject: any) {
      this.dates = filtersObject['date_filters']
      this.filters = filtersObject['field_filters']

      this.$information.setFilters(this.filters)
      this.$information.setDateFilters(this.dates)

      this.$emit('filtersUpdated')
      this.open = false
    },

    ticketFieldsLabel(filter: any) {
      let index = filter.label.toLocaleLowerCase()

      let fields = {
        agent: 'contact.name',
        group: 'name'
      }
      return fields[index] ?? 'label'
    },

    ticketFieldsValue(filter: any) {
      let index = filter.label.toLocaleLowerCase()

      let fields = {
        agent: 'id',
        group: 'id'
      }
      return fields[index] ?? 'value'
    },

    addNewPreset(filters: Array<any>, dates: any) {
      let presets = Object.values(this.filterPresets ?? [])
      let presetNames = presets.map((preset: any) => preset?.name)

      if (!this.filterPresetName || presetNames.includes(this.filterPresetName)) {
        this.$toast.error('A unique name is required for saved presets.')
        return
      }

      presets.push({
        name: this.filterPresetName,
        field_filters: filters,
        date_filters: dates
      })

      this.$information?.setFilterPresets(presets)
      this.filterPresetName = ''
    },

    removePreset(presetName: string) {
      let presets = Object.values(this.filterPresets ?? [])
      presets = presets.filter((preset: any) => preset?.name != presetName)

      this.$information?.setFilterPresets(presets)
    }
  }
})
</script>

<style>
.filters-action {
  @apply bg-primary-500 hover:bg-primary-400 border border-primary-700 w-max py-2 px-5 rounded-md shadow-primary-600 font-semibold;
}
</style>
