<template>
  <div
    class="flex flex-col w-screen min-h-screen py-5 px-10"
    style="z-index: 0"
    @mousemove="tempStop = true"
  >
    <div class="w-full h-auto mb-5">
      <ticket-counters :tickets="allTickets" />
    </div>

    <div class="block m-auto" :class="graphDimensions">
      <a-carousel
        :slides="panelIds"
        :spin-carousel="tempStop ? false : active"
        :slide-duration-minutes="singleSlideTime"
      >
        <template v-for="(panel, p) in panels" :key="p" #[`slide_${p}`]>
          <div :class="`m-auto ${setGraphWidth(panel)}`">
            <component
              :id="panel.id"
              :tickets="allTickets"
              :is="panel?.component"
              :is-open="panel.visible"
              :sort-by="panel?.sortBy"
              :additional-data="panel?.data"
              :display-type="panel?.displayType"
              @updatedGraphSort="(value: any) => updatePanel(value, panel?.id, 'sortBy')"
              @toggleVisibility="(value: any) => updatePanel(value, panel?.id, 'visible')"
              @updatedDisplayType="(value: any) => updatePanel(value, panel?.id, 'displayType')"
            />
          </div>
        </template>
      </a-carousel>
    </div>

    <div
      v-if="tempStop"
      class="card flex flex-wrap items-center justify-between gap-x-10 gap-y-3 m-auto w-11/12 px-5 py-3 -mt-10"
    >
      <span
        class="text-xs font-semibold uppercase tracking-wide text-ink-muted"
        v-text="'Carousel options'"
      />

      <a-checkbox
        :the-value="active"
        :checked="active"
        class="font-medium"
        :label="'Spin the carousel'"
        :title="'Toggle carousel spin.'"
        @changed="(value) => (active = value)"
      />

      <label class="flex items-center gap-3 text-sm font-medium">
        <span v-text="'Minutes per graph'" />
        <input v-model="singleSlideTime" class="input w-24 py-1.5" type="number" min="1" />
      </label>

      <button class="actions-button" :title="'Hide carousel options'" @click="tempStop = false">
        <i class="fa fa-xmark" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import ACheckbox from '@/components/general/ACheckbox.vue'
import ACarousel from '@/components/general/ACarousel.vue'
import { updatePanelInState } from '@/helpers/CommonMethods'
import { panelsInReadingOrder } from '@/helpers/LayoutGrid'

export default defineComponent({
  name: 'SpinLayout',

  components: { ACarousel, ACheckbox },

  props: {
    allTickets: {
      type: [Array, Object],
      required: true
    }
  },

  data() {
    return {
      active: true,
      tempStop: false,
      singleSlideTime: 2
    }
  },

  computed: {
    // Slides follow the grid's reading order; counters are pinned above the carousel.
    panels(): Array<any> {
      return panelsInReadingOrder(this.$configuration?.layoutPanels).filter(
        (panel) => panel?.component != 'TicketCounters'
      )
    },
    panelIds() {
      return this.panels?.map((panel) => panel?.id)
    },
    optionsFormStyle(): string {
      return `${this.$information?.textOnSecondaryColor}
      ${this.$information?.conditionalPrimaryBorder}
      ${this.$information?.bgAccentSecondaryColor}`
    },

    graphDimensions(): string {
      if (!this.$configuration.visibleTicketCounts?.length) {
        return 'w-11/12 h-80vh'
      }
      return this.tempStop ? 'w-1/2 h-50vh' : 'w-2/3 h-70vh'
    }
  },

  watch: {
    tempStop() {
      useToast().clear()

      if (this.tempStop) {
        this.$toast.info('When the mouse moves, the carousel stops for 10 seconds.', {
          timeout: 10000
        })
      }

      setTimeout(() => {
        this.active = true
        this.tempStop = false
      }, 10000)
    }
  },

  methods: {
    setGraphWidth(panel: any) {
      let halpWidthViews = ['pie', 'doughnut']

      return this.tempStop
        ? halpWidthViews.includes(panel?.displayType)
          ? 'w-1/3'
          : 'w-7/12'
        : halpWidthViews.includes(panel?.displayType)
          ? 'w-1/2'
          : 'w-full'
    },

    updatePanel(newValue: any, panelId: string, property: string) {
      updatePanelInState(panelId, property, newValue)
    }
  }
})
</script>
