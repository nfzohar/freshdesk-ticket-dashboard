<template>
  <a-dialog>
    <template #trigger>
      <span class="absolute right-5 top-5 text-2xl cursor-pointer">
        <settings-icon />
      </span>
    </template>

    <template #content>
      <div class="m-auto w-8/12 bg-secondary-500 border-primary-500 border rounded-md p-5">
        <h4 class="font-semibold w-full border-b mb-2" v-text="'Manage visible statistics:'" />

        <check-box
          v-for="(stat, sc) in [1, 2, 3]"
          :key="sc"
          :the-value="stat.show"
          :label="stat.label"
          @changed="(value) => (stat.show = value)"
        />
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SettingsIcon from './icons/SettingsIcon.vue'
import ADialog from '@/components/General/ADialog.vue'
import CheckBox from '@/components/General/CheckBox.vue'

export default defineComponent({
  name: 'DashboardSettings',

  components: { CheckBox, ADialog, SettingsIcon },

  props: {
    customClass: {
      type: String,
      required: false,
      default: 'text-sm w-auto text-left text-primary'
    }
  },

  emits: [],

  data() {
    return {}
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {}
})
</script>
