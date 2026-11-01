<template>
  <!-- Placeholder dashboard behind the login, wizard and loading overlays. -->
  <div class="flex flex-col w-screen h-screen overflow-hidden" aria-hidden="true">
    <div
      class="flex items-center justify-between h-16 shrink-0 px-4 border-b border-line bg-surface"
    >
      <div class="flex items-center gap-3">
        <span class="skeleton h-9 w-9" />
        <div class="flex flex-col gap-1.5">
          <span class="skeleton h-3.5 w-44" />
          <span class="skeleton h-2.5 w-64" />
        </div>
      </div>
      <div class="hidden sm:flex items-center gap-2">
        <span v-for="i in 7" :key="i" class="skeleton h-9 w-9" />
      </div>
    </div>

    <div class="flex flex-col gap-4 p-4">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div v-for="i in 5" :key="i" class="card flex flex-col gap-3 px-5 py-4">
          <span class="skeleton h-3 w-20" />
          <span class="skeleton h-8 w-14" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="card flex flex-col gap-3 p-4">
          <span class="skeleton h-3.5 w-28" />
          <span v-for="row in 5" :key="row" class="skeleton h-11 w-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DashboardSkeleton'
})
</script>
