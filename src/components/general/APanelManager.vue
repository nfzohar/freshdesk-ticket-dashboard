<template>
  <div
    class="flex flex-col items-center gap-3 w-full h-max border border-primary-500 rounded-md p-3"
    :class="`${accentSecondaryBg} ${textPrimaryClass}`"
  >
    <div class="flex items-center justify-between w-full">
      <span
        :class="`border w-auto p-1 rounded-md ${textSecondaryClass}`"
        :title="'Panel Layout ID'"
        v-text="panel?.id"
      />
      <button
        :class="'bg-red-500 text-white py-1 px-2 rounded-md font-bold'"
        :title="'Remove this panel'"
        @click="$emit('removePanel', panel?.id)"
      >
        <i class="fa fa-times" />
      </button>
    </div>

    <select v-model="panelComponent" class="w-full p-1 rounded-md">
      <option :value="''" v-text="'Select a panel...'" />
      <option
        v-for="(panel, p) in availablePanelComponents"
        :key="p"
        :value="panel"
        v-text="label(panel)"
      />
    </select>

    <template v-if="selectedPanelIsCustomField">
      <input
        v-model="customPanelTitle"
        type="text"
        class="w-full rounded-md p-1"
        :placeholder="'Add a title for the panel...'"
      />
      <select v-model="panelCustomField" class="w-full p-1 rounded-md">
        <option :value="''" v-text="'Select a custom ticket property...'" />
        <option
          v-for="(field, f) in availableTicketFields"
          :key="f"
          :value="field"
          v-text="field"
        />
      </select>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getAvailablePanelComponents } from '@/helpers/CommonMethods'

export default defineComponent({
  name: 'APanelManager',

  emits: ['panelUpdated', 'removePanel'],

  props: {
    panel: {
      type: [Array, Object],
      required: false,
      default: () => []
    }
  },

  data() {
    return {
      panelComponent: '',
      customPanelTitle: '',
      panelCustomField: ''
    }
  },

  computed: {
    textPrimaryClass(): String {
      return this.$information?.textOnPrimaryColor
    },
    textSecondaryClass(): String {
      return this.$information?.textOnSecondaryColor
    },
    accentSecondaryBg(): String {
      return this.$information?.bgAccentSecondaryColor
    },
    selectedPanelIsCustomField() {
      return this.panelComponent == 'TicketCustomField'
    },
    availablePanelComponents() {
      return getAvailablePanelComponents()
    },
    availableTicketFields() {
      return this.$information.listOfAvailableTicketFields
    },
    updateToken() {
      return `${this.panelComponent}${this.customPanelTitle}${this.panelCustomField}`
    }
  },

  watch: {
    panelComponent() {
      if (this.selectedPanelIsCustomField) {
        this.customPanelTitle = ''
        this.panelCustomField = ''
      }
    },
    updateToken() {
      this.updateComponentData()
    }
  },

  created() {
    this.panelComponent = this.panel?.component ?? ''
    this.panelCustomField = this.panel.data['custom_field'] ?? ''
    this.customPanelTitle = this.panel?.data['custom_title'] ?? ''
  },

  methods: {
    label(label: String) {
      return label?.split(/(?=[A-Z])/)?.join(' ')
    },

    updateComponentData() {
      let updatedComponent = {
        id: this.panel?.id,
        visible: this.panel?.visible,
        displayType: this.panel?.displayType,
        component: this.panelComponent,
        data: {
          custom_title: this.customPanelTitle,
          custom_field: this.panelCustomField
        }
      }

      updatedComponent.data = this.selectedPanelIsCustomField ? updatedComponent.data : {}
      this.$emit('panelUpdated', updatedComponent)
    }
  }
})
</script>
