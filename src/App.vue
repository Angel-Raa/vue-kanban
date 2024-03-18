<template>
  <div class="flex flex-col w-full h-full">
    <NavBar />
    <div class="flex-1 flex gap-4 px-3 overflow-auto">
      <IColumn v-for="column of STORE" :key="column.columnId" :column="column" />
    </div>
  </div>
</template>

<script setup lang="ts">
import IColumn from './components/column/IColumn.vue'
import NavBar from './components/NavBar.vue'
import { STORE } from '@/store/kanban'
</script>
<style>
#app {
  @apply select-none h-screen bg-blue-200;
}
</style>
