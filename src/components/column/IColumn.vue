<template>
  <DropZone @drop-data="onDrop">
    <IDraggable
      :transfer-data="{
        columnId: column.columnId,
        type: TYPES.COLUMN
      }"
      class="p-2 w-64 bg-gray-100 shadow-lg shadow-slate-800 rounded"
    >
      <div class="flex justify-between items-center">
        <div class="flex gap-2 items-center">
          <span>{{ column.name }}</span>
        </div>
        <div class="flex gap-4 flex-2 ">
          <button @click="setSelectedColumn(ACTIONS.UPDATE, column)">&#9998;</button>
          <button class="font-bold" @click="setSelectedColumn(ACTIONS.DELETE, props.column)">
            &#88;
          </button>
          <button class="text-2xl font-bold" @click="addTask(column.columnId)">+</button>
        </div>
      </div>
      <div class="flex flex-col gap-2 overflow-y-auto h-[35rem] p-2">
        <ITask
          v-for="task of column.tasks"
          :key="task.taskId"
          :column-id="column.columnId"
          :task="task"
        />
      </div>
    </IDraggable>
  </DropZone>
  <IModal
    :is-modal-active="isUpdateColumnModalActive"
    :heading="`${ACTIONS.UPDATE.split('_').join(' ')}`"
    @close-modal="toggleUpdateColumnModal()"
  >
    <ColumnForm
      :action="ACTIONS.UPDATE"
      :column="column"
      @close-modal="toggleUpdateColumnModal()"
    />
  </IModal>
  <IModal
    :is-modal-active="isDeleteColumnModalActive"
    :heading="`${ACTIONS.DELETE.split('_').join(' ')}`"
    @close-modal="toggleDeleteColumnModal"
  >
    <div class="p-2">
      <span>¿Estás seguro de que quieres eliminar? {{ column && column.name }}?</span>
      <div class="flex justify-around pt-3">
        <button @click="toggleDeleteColumnModal()">No</button>
        <button @click="deleteColumn">Yes</button>
      </div>
    </div>
  </IModal>

  <IModal
    :is-modal-active="isTaskModalActive"
    :heading="`${ACTIONS.ADD_TASK.split('_').join(' ')}`"
    @close-modal="toggleTaskModal()"
  >
    <TaskForm
      :column-id="selectedColumnId"
      :action="ACTIONS.ADD_TASK"
      @close-modal="toggleTaskModal()"
    />
  </IModal>
</template>

<script setup lang="ts">
import { ACTIONS, TYPES, type Column, type TRANSFER_DATA } from '@/types'
import IDraggable from '../common/IDraggable.vue'
import DropZone from '../common/DropZone.vue'
import { ref } from 'vue'
import ColumnForm from './ColumnForm.vue'
import TaskForm from '../task/TaskForm.vue'
import IModal from '../common/IModal.vue'
import kanban from '@/store/kanban'
import ITask from '../task/ITask.vue'

const isUpdateColumnModalActive = ref(false)
const isDeleteColumnModalActive = ref(false)
const selectedColumn = ref<Column | null>(null)
const selectedColumnId = ref('')
const isTaskModalActive = ref(false)
const props = defineProps<{
  column: Column
}>()

const addTask = (columnId: Column['columnId']) => {
  selectedColumnId.value = columnId
  toggleTaskModal()
}
const onDrop = (trans: TRANSFER_DATA) => {
  if (trans.type === TYPES.COLUMN && trans.columnId) {
    kanban.moveColumn(trans.columnId, props.column.columnId)
  } else if (trans.type === TYPES.TASK && trans.taskId) {
    kanban.moveTask(trans.taskId, props.column.columnId!)
  }
}
const setSelectedColumn = (action: ACTIONS, column: Column) => {
  selectedColumn.value = column
  if (action === ACTIONS.UPDATE) {
    toggleUpdateColumnModal()
  } else if (action === ACTIONS.DELETE) {
    toggleDeleteColumnModal()
  }
}
const deleteColumn = () => {
  if (selectedColumn.value) {
    kanban.deleteColumn(selectedColumn.value.columnId)
  }
}
const toggleUpdateColumnModal = (): void => {
  isUpdateColumnModalActive.value = !isUpdateColumnModalActive.value
}

const toggleDeleteColumnModal = (): void => {
  isDeleteColumnModalActive.value = !isDeleteColumnModalActive.value
}

const toggleTaskModal = (): void => {
  isTaskModalActive.value = !isTaskModalActive.value
}
</script>
