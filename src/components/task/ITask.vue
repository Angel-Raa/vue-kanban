<template>
  <DropZone @drop-data="onTaskDrop">
    <IDraggable
      class="shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded p-2"
      :transfer-data="{
        taskId: task.taskId,
        type: TYPES.TASK
      }"
    >
      <div>
        <div class="flex gap-2">
          <span class="font-bold"> {{ task.name }}</span>
          <div class="flex gap-1">
            <button class="text-sm font-bold" @click="toggleTaskModal()">&#9998;</button>
            <button class="text-sm font-bold" @click="toggleDeleteTaskModal()">&#88;</button>
          </div>
        </div>
        <div></div>
      </div>
      <p class="w-full mt-1 text-sm text-gray-400">{{ task.description }}</p>
    </IDraggable>
  </DropZone>

  <IModal
    :is-modal-active="isTaskModalActive"
    :heading="`${ACTIONS.UPDATE_TASK.split('_').join(' ')}`"
    @close-modal="toggleTaskModal()"
  >
    <TaskForm
      :column-id="columnId"
      :task="task"
      :action="ACTIONS.UPDATE_TASK"
      @close-modal="toggleTaskModal()"
    />
  </IModal>

  <IModal
    :is-modal-active="isDeleteTaskModalActive"
    :heading="`${ACTIONS.DELETE.split('_').join(' ')}`"
    @close-modal="toggleDeleteTaskModal()"
  >
    <div class="p-2">
      <span>¿Estás seguro de que quieres eliminar? {{ task && task.name }}?</span>
      <div class="flex justify-around pt-3">
        <button @click="toggleDeleteTaskModal()">No</button>
        <button @click="deleteTask()">Yes</button>
      </div>
    </div>
  </IModal>
</template>

<script setup lang="ts">
import DropZone from '../common/DropZone.vue'
import IDraggable from '../common/IDraggable.vue'
import IModal from '../common/IModal.vue'
import { type Column, type Task, ACTIONS, TYPES, type TRANSFER_DATA } from '@/types'
import { ref} from 'vue'
import kanban from '@/store/kanban'
const props = defineProps<{
  task: Task 
  columnId: Column['columnId']
}>()
const isTaskModalActive= ref(false)
const isDeleteTaskModalActive= ref(false)
const toggleTaskModal = (): void => {
  isTaskModalActive.value = !isTaskModalActive.value
}
const toggleDeleteTaskModal = (): void => {
  isDeleteTaskModalActive.value != isDeleteTaskModalActive.value
}
const deleteTask = () => {
  kanban.deleteTask(props.columnId, props.task.taskId)
  toggleDeleteTaskModal()
}

const onTaskDrop = (transferData: TRANSFER_DATA) => {
  if (transferData.type === TYPES.TASK && transferData.taskId) {
    kanban.moveTask(transferData.taskId, props.columnId!, props.task.taskId)
  }
}
</script>
