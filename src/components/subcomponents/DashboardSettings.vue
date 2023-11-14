<template>
  <default-tooltip>
    <template #trigger>
      <span class="text-2xl cursor-pointer" v-text="'⚙️'" />
    </template>

    <template #body>
      <div class="flex flex-col p-3 bg-secondary-500">
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
  </default-tooltip>
</template>

<script lang="ts">
import CheckBox from './CheckBox.vue'
import { defineComponent } from 'vue'
import DefaultTooltip from '../DefaultTooltip.vue'

export default defineComponent({
  name: 'DashboardSettings',

  components: { CheckBox, DefaultTooltip },

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
