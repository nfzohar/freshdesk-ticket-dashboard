<template>
  <tippy class="inline" :arrow="true" :placement="'left'">
    <slot name="trigger" />

    <template #content>
      <div class="rounded-md border border-primary-500">
        <slot :name="'body'" />
      </div>
    </template>
  </tippy>
</template>

<script lang="ts">
import { Tippy } from 'vue-tippy'

export default {
  name: 'DefaultTooltip',

  components: { Tippy }
}
</script>
