<template>
  <a-dialog :manual-open="true">
    <template #trigger>
      <button class="actions-button" :title="'Filters'" @click="open = true">
        <i class="fa fa-filter" />
      </button>
    </template>

    <template #content>
      <div
        class="flex flex-col gap-5 m-auto w-9/12 bg-secondary-500 border-primary-500 border rounded-md p-5"
        :class="[secondaryColorText, { 'is-loading': isLoading }]"
        @keydown.esc="open = false"
      >
        <div class="flex items-center justify-between w-full">
          <h1 class="text-3xl font-bold cursor-pointer" v-text="'Filters'" />
          <div class="flex gap-5">
            <button
              :class="`filters-action ${primaryColorText}`"
              v-text="'Reset filters'"
              @click="updateFilters([])"
            />
            <button
              :class="`filters-action ${primaryColorText}`"
              v-text="'Apply filters'"
              @click="updateFilters(allSetFilters)"
            />
          </div>
        </div>

        <div class="flex items-center p-0 m-0">
          <div class="grid grid-cols-1 w-full h-full overflow-y-scroll scrollbar-hide p-2">
            <!-- Created at -->
            <a-filter-section
              v-for="(date, d) in dates"
              :key="d"
              :section-title="date?.title"
              :body-class="'flex flex-col lg:flex-row items-center justify-between p-2'"
            >
              <a-date-select
                :the-value="date['from']"
                :label="'From:'"
                :class="'w-full'"
                :label-class="'text-sm font-normal'"
                @changed="(value) => (date.from = value)"
              />
              <span class="hidden lg:block font-bold text-2xl px-4" v-text="'-'" />
              <a-date-select
                :the-value="date['to']"
                :label="'To:'"
                :class="'w-full'"
                :label-class="'text-sm font-normal'"
                @changed="(value) => (date.to = value)"
              />
            </a-filter-section>
          </div>

          <a-filter-section
            :key="filters?.length"
            :section-title="'Ticket fields'"
            :body-class="'grid grid-cols-1 xl:grid-cols-2 gap-5 w-full h-50vh overflow-y-scroll scrollbar-hide p-2'"
          >
            <template v-for="(filter, f) in filters" :key="f">
              <a-select
                v-if="filter?.choices?.length"
                :the-value="filter.value"
                :label="filter?.label"
                :options="filter?.choices"
                :show-null-value="true"
                :null-value-label="'All'"
                :input-class="'bg-primary-500'"
                :label-field="ticketFieldsLabel(filter)"
                :value-field="ticketFieldsValue(filter)"
                @changed="(value) => (filter.value = value)"
              />
            </template>
          </a-filter-section>
        </div>

        <div class="bg-secondary-500 w-full p-4 h-full">
          <div class="flex items-center justify-between border-b border-primary-600 py-1">
            <h1 class="w-full text-lg font-bold capitalize" v-text="'Saved filter presets'" />
            <div class="flex items-center w-min">
              <input
                class="bg-transparent border border-primary-500 rounded-l-md px-2 outline-none"
                :placeholder="'New filter preset name...'"
                type="text"
                v-model="filterPresetName"
                @keydown.enter="addNewPreset()"
              />
              <button
                class="w-max px-1 font-bold border capitalize border-primary-500 rounded-r-md hover:bg-primary-500"
                :title="'Save current filters as a preset.'"
                v-text="'Save'"
                @click="addNewPreset()"
              />
            </div>
          </div>

          <div
            :key="filters?.length"
            class="grid gap-5 items-center p-3 bg-secondary-600 rounded-md"
            :class="{ 'grid-cols-5': filterPresets?.length }"
          >
            <span
              v-if="!filterPresets?.length"
              class="block opacity-50 w-full"
              v-text="'No presets created yet.'"
            />
            <button
              v-for="(preset, p) in filterPresets"
              :key="p"
              class="flex justify-between items-center w-full px-2 border border-primary-500 rounded-md bg-primary-500 hover:bg-primary-600"
              :class="primaryColorText"
              @click="updateFilters(preset?.value)"
            >
              <span v-text="preset?.name" />
              <button
                @click.stop="removePreset(preset?.name)"
                v-html="`<i class='fa fa-times'/>`"
              />
            </button>
          </div>
        </div>
      </div>
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

  emits: ['filtersUpdated'],

  data() {
    return {
      filters: new Array(),
      filterPresetName: '',
      isLoading: false,
      open: true,
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
      }
    }
  },

  computed: {
    filterPresets(): Object {
      return this.$information?.savedFilterSets
    },
    primaryColorText(): String {
      return this.$information?.textOnPrimaryColor
    },
    secondaryColorText(): String {
      return this.$information?.textOnSecondaryColor
    },
    allSetFilters() {
      let list = Object.values(this.filters)
      list.push({ name: 'date_filters', value: this.dates })
      return list
    },
    storedFilters(): Array {
      return Object.values(this.$information?.storedFilters)
    },
    storedTicketFields(): Array {
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
        return
      }

      this.dates = this.storedFilters.filter((filter) => filter?.name == 'date_filters')[0].value

      let filtersInStore = this.storedFilters.filter((filter) => filter?.name != 'date_filters')
      this.filters = filtersInStore
    },

    updateFilters(filterlist: Array) {
      this.$information.setFilters(filterlist)

      this.filters = filterlist.filter((filter) => filter?.name != 'date_filters')
      if (filterlist?.length) {
        this.dates = filterlist.filter((filter) => filter?.name == 'date_filters')[0].value
      }

      this.$emit('filtersUpdated')
      this.open = false
    },

    ticketFieldsLabel(filter) {
      let index = filter.label.toLocaleLowerCase()

      let fields = {
        agent: 'contact.name',
        group: 'name'
      }
      return fields[index] ?? 'label'
    },

    ticketFieldsValue(filter) {
      let index = filter.label.toLocaleLowerCase()

      let fields = {
        agent: 'id',
        group: 'id'
      }
      return fields[index] ?? 'value'
    },

    addNewPreset() {
      let presets = Object.values(this.filterPresets ?? [])
      let presetNames = presets.map((preset) => preset?.name)

      if (!this.filterPresetName || presetNames.includes(this.filterPresetName)) {
        this.$toast.error('A unique name is required for saved presets.')
        return
      }

      presets.push({
        name: this.filterPresetName,
        value: this.allSetFilters
      })

      this.$information?.setFilterPresets(presets)
      this.filterPresetName = ''
    },

    removePreset(presetName: String) {
      let presets = Object.values(this.filterPresets ?? [])
      presets = presets.filter((preset) => preset?.name != presetName)

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
