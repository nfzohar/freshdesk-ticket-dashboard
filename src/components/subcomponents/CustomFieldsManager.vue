<template>
  <div>
    <h1 class="w-full border-b border-primary-600 font-bold mt-5" v-text="'Manage custom fields'" />

    <div
      class="flex flex-col gap-y-2 gap-x-5 justify-between p-3"
      @keydown.enter="addNewCustomField()"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-3">
        <div>
          <label class="block" v-text="'Title'" />
          <input
            v-model="newCustomFieldTitle"
            type="text"
            class="w-full rounded-md border border-primary-700 px-1 text-black"
          />
        </div>
        <div>
          <label class="block" v-text="'Field'" />
          <select
            v-model="newCustomFieldField"
            class="w-full rounded-md border border-primary-700 px-1 text-black"
            :placeholder="'Select a field...'"
          >
            <option
              v-for="(option, o) in avaliableFields"
              :key="o"
              v-text="option"
              :value="option"
            />
          </select>
        </div>
      </div>
      <button
        v-text="'Add custom field'"
        class="primary-button px-2 mt-2 border-none"
        @click="addNewCustomField()"
      />
    </div>

    <template v-if="allCustomFields.length">
      <div v-for="(customField, cf) in allCustomFields" :key="cf">
        <div class="flex items-center justify-between hover:bg-secondary-600 px-2 rounded-md">
          <span><b v-text="customField?.title" />: {{ customField?.field }}</span>
          <cross-icon
            :title="'Remove this custom field.'"
            @click="removeCustomField(customField?.field)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CrossIcon from '@/components/icons/CrossIcon.vue'

export default defineComponent({
  name: 'CustomFieldManager',

  components: { CrossIcon },

  props: {
    customFields: {
      type: [Object, Array],
      required: false,
      default: () => []
    },
    aTicket: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  emits: ['newCustomFields'],

  data() {
    return {
      newCustomFieldTitle: '',
      newCustomFieldField: '',
      allCustomFields: Array()
    }
  },

  watch: {
    'allCustomFields.length'() {
      this.$emit('newCustomFields', this.allCustomFields)
    }
  },

  computed: {
    avaliableFields() {
      return [Object.keys(this.aTicket), Object.keys(this.aTicket.custom_fields)].flat().sort()
    }
  },

  mounted() {
    this.allCustomFields = this.customFields
  },

  methods: {
    addNewCustomField() {
      if (!this.newCustomFieldTitle || !this.newCustomFieldField) {
        this.$toast.error('Title and field are required.')
        return
      }

      let newCustomField = {
        title: this.newCustomFieldTitle,
        field: this.newCustomFieldField
      }
      this.allCustomFields.push(newCustomField)

      this.newCustomFieldTitle = ''
      this.newCustomFieldField = ''
    },

    removeCustomField(customField) {
      this.allCustomFields = this.allCustomFields.filter((cf) => cf.field != customField)
    }
  }
})
</script>
