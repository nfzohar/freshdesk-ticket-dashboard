<template>
  <div class="flex flex-col items-center text-center gap-10 m-10">
    <h2 class="w-full font-bold text-base lg:text-lg xl:text-2xl" v-text="pageTitle" />

    <div class="flex items-center justify-between w-full">
      <button
        v-for="(option, o) in orientations"
        :key="o"
        title="Select layout"
        class="flex flex-col items-center border-4 rounded-md py-5 px-10 m-auto font-bold hover:bg-primary-600 hover:border-primary-500"
        :class="
          currentlySelectedLayout == option.value
            ? 'bg-primary-600 border-primary-500'
            : 'border-primary-600 bg-secondary-500'
        "
        @click="setLayoutOrientation(option.value)"
      >
        <i class="text-7xl p-5" :class="[option?.icon, option.iconClass]" />
        <span v-text="option?.label" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LayoutOrientation',

  data() {
    return {
      pageTitle: `Select your dashboard's layout:`,
      orientations: [
        {
          icon: 'fa fa-bars',
          iconClass: '',
          label: 'Rows',
          value: 'rows-layout'
        },
        {
          icon: 'fa fa-bars',
          iconClass: 'rotate-90',
          label: 'Columns',
          value: 'columns-layout'
        },
        {
          icon: 'fa fa-square',
          iconClass: '',
          label: 'Carousel',
          value: 'spin-layout'
        }
      ]
    }
  },

  computed: {
    currentlySelectedLayout(): String {
      return this.$configuration?.layoutComponent
    }
  },

  methods: {
    setLayoutOrientation(value: String) {
      let newLayout = this.$configuration.theLayout
      newLayout.component = value

      this.$configuration.updateLayout(newLayout)
      this.$toast.success('Dashboard configuration was updated.')
    }
  }
})
</script>
