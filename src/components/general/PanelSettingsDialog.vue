<template>
  <a-overlay
    closable
    size="sm"
    icon="fa fa-sliders"
    :title="isNew ? 'Add panel' : 'Panel settings'"
    :subtitle="isNew ? 'Choose what this panel shows.' : `Panel #${panel?.id}`"
    @close="$emit('close')"
  >
    <div class="flex flex-col gap-4">
      <div>
        <label class="field-label" for="panel-type" v-text="'Panel type'" />
        <select id="panel-type" v-model="component" class="input cursor-pointer">
          <option :value="''" disabled v-text="'Select a panel…'" />
          <option
            v-for="option in availablePanelComponents"
            :key="option"
            :value="option"
            v-text="panelLabel(option)"
          />
        </select>
      </div>

      <template v-if="isCustomField">
        <div>
          <label class="field-label" for="panel-title" v-text="'Title'" />
          <input
            id="panel-title"
            v-model="customTitle"
            type="text"
            class="input"
            :placeholder="'e.g. Products'"
          />
        </div>
        <div>
          <label class="field-label" for="panel-field" v-text="'Ticket property'" />
          <select id="panel-field" v-model="customField" class="input cursor-pointer">
            <option :value="''" disabled v-text="'Select a ticket property…'" />
            <option
              v-for="field in availableTicketFields"
              :key="field"
              :value="field"
              v-text="fieldLabel(field)"
            />
          </select>
          <p
            v-if="!availableTicketFields?.length"
            class="mt-1.5 text-xs text-ink-muted"
            v-text="'Ticket properties appear once tickets have loaded.'"
          />
        </div>
      </template>
    </div>

    <template #footer>
      <button class="btn-danger" @click="$emit('remove', panel?.id)">
        <i class="fa fa-trash-can" />
        <span v-text="'Remove panel'" />
      </button>
      <button class="btn-primary" :disabled="!component" @click="save">
        <i class="fa fa-check" />
        <span v-text="isNew ? 'Add panel' : 'Apply'" />
      </button>
    </template>
  </a-overlay>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AOverlay from '@/components/general/AOverlay.vue'
import { getAvailablePanelComponents, panelLabel } from '@/helpers/CommonMethods'
import type { DashboardPanel } from '@/helpers/LayoutGrid'

export default defineComponent({
  name: 'PanelSettingsDialog',

  components: { AOverlay },

  emits: ['close', 'remove', 'save'],

  props: {
    panel: {
      type: Object as PropType<DashboardPanel>,
      required: true
    }
  },

  data() {
    return {
      component: this.panel?.component ?? '',
      customTitle: this.panel?.data?.custom_title ?? '',
      customField: this.panel?.data?.custom_field ?? ''
    }
  },

  computed: {
    isNew(): boolean {
      return !this.panel?.component
    },
    isCustomField(): boolean {
      return this.component == 'TicketCustomField'
    },
    availablePanelComponents(): string[] {
      return getAvailablePanelComponents()
    },
    availableTicketFields(): string[] {
      return this.$information?.listOfAvailableTicketFields ?? []
    }
  },

  methods: {
    panelLabel,

    fieldLabel(field: string) {
      return field.includes('.') ? field.split('.')[1] : field
    },

    save() {
      this.$emit('save', {
        component: this.component,
        data: this.isCustomField
          ? { custom_title: this.customTitle, custom_field: this.customField }
          : {}
      })
    }
  }
})
</script>
