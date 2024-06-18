<template>
  <div class="w-screen h-screen overflow-hidden bg-secondary-500">
    <div class="m-auto w-min align-middle mt-44 animate-spin">
      <logo-icon pt-width="300" pt-height="300" class="shadow-lg rounded-full" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LogoIcon from '@/components/general/TheLogo.vue'

export default defineComponent({
  name: 'LoadDataPage',

  components: { LogoIcon },

  created() {
    document.title = 'Fetching data...'
  },

  async mounted() {
    await this.fetchAgentsFromFreshdesk()
    await this.fetchGroupsFromFreshdesk()
    await this.fetchStatusesFromFreshdesk()
  },

  methods: {
    fetchAgentsFromFreshdesk() {},

    fetchGroupsFromFreshdesk() {},

    fetchStatusesFromFreshdesk() {}
  }
})
</script>
