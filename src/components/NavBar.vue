<template>
  <div class="flex justify-between px-2 mb-3 text-white">
    <h1>Kanban Board</h1>
    <button class="font-bold" @click="isColumnModalActive = !isColumnModalActive">
      Añadir columna
    </button>
  </div>
  <IModal
    :is-modal-active="isColumnModalActive"
    :heading="`${ACTIONS.ADD.split('_').join('')}`"
    @close-modal="isColumnModalActive = !isColumnModalActive"
  >
  <ColumnForm 
  :action="ACTIONS.ADD"
  @close-modal="isColumnModalActive = !isColumnModalActive"
  />

  </IModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IModal from './common/IModal.vue'
import { ACTIONS } from '@/types'
import ColumnForm from './column/ColumnForm.vue';
const isColumnModalActive = ref(false)
</script>
