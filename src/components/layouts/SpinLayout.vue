<template>
  <div
    class="flex flex-col w-screen min-h-screen py-5 px-10"
    style="z-index: 0"
    @mousemove="tempStop = true"
  >
    <div class="w-full h-auto mb-5">
      <ticket-counters :tickets="allTickets" />
    </div>

    <div
      v-if="tempStop"
      :class="`flex items-center justify-between gap-x-24 rounded-md m-auto w-11/12 p-5 mb-5 ${optionsFormStyle}`"
    >
      <span class="block uppercase font-bold opacity-50" v-text="'Carousel options'" />

      <a-checkbox
        :the-value="active"
        :checked="active"
        class="font-bold m-auto"
        :label="'Spin the carousel'"
        :title="'Toggle carousel spin.'"
        @changed="(value) => (active = value)"
      />

      <div>
        <span class="font-bold mr-3" v-text="'Minutes per graph:'" />
        <input
          v-model="singleSlideTime"
          class="text-black bg-white px-2 rounded-md"
          type="number"
        />
      </div>

      <button @click="tempStop = false">
        <i class="fa fa-times" />
      </button>
    </div>

    <div class="block m-auto w-11/12 h-auto">
      <a-carousel
        :slides="panelIds"
        :spin-carousel="tempStop ? false : active"
        :slide-duration-minutes="singleSlideTime"
      >
        <template v-for="(panel, p) in panels" :key="p" #[`slide_${p}`]>
          <div
            :class="`m-auto ${['pie', 'doughnut'].includes(panel?.displayType) ? 'w-1/2' : 'w-full'}`"
          >
            <component
              :id="panel.id"
              :tickets="allTickets"
              :is="panel?.component"
              :is-open="panel.visible"
              :sort-by="panel?.sortBy"
              :additional-data="panel?.data"
              :display-type="panel?.displayType"
              @updatedGraphSort="(value) => updatePanel(value, panel?.id, 'sortBy')"
              @toggleVisibility="(value) => updatePanel(value, panel?.id, 'visible')"
              @updatedDisplayType="(value) => updatePanel(value, panel?.id, 'displayType')"
            />
          </div>
        </template>
      </a-carousel>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import ACheckbox from '@/components/general/ACheckbox.vue'
import ACarousel from '@/components/general/ACarousel.vue'
import { updatePanelInState } from '@/helpers/CommonMethods'

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
      carouselItems: [],
      singleSlideTime: 2
    }
  },

  computed: {
    carouselItemsFromState(): Array {
      return Object.values(this.$configuration?.layoutGroups)
    },
    panels(): Array {
      return this.carouselItemsFromState
        ?.flat()
        .filter((panel) => panel?.component != 'TicketCounters')
    },
    panelIds() {
      return this.panels?.map((panel) => panel?.id)
    },
    optionsFormStyle(): String {
      return `${this.$information?.textOnSecondaryColor}
      ${this.$information?.conditionalPrimaryBorder}
      ${this.$information?.bgAccentSecondaryColor}`
    }
  },

  watch: {
    tempStop() {
      this.tempStop
        ? this.$toast.info('When the mouse moves, the carousel stops and waits for 1 minute.', {
            timeout: 60000
          })
        : useToast().clear()

      setTimeout(() => {
        this.active = true
        this.tempStop = false
      }, 60000)
    }
  },

  mounted() {
    this.carouselItems = this.carouselItemsFromState
  },

  methods: {
    async updatePanel(newValue: String, panelId: String, property: String) {
      await updatePanelInState(this.carouselItems, newValue, panelId, property)
      this.carouselItems = this.carouselItemsFromState
    }
  }
})
</script>
