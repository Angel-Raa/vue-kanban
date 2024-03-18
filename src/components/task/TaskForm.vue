<template>
  <Form
    ref="taskForm"
    :validation-schema="validationSchema"
    :on-submit="onSubmit"
    class="flex flex-col gap-2"
  >
    <label for="name">Nombre</label>
    <Field id="name" type="text" name="name" class="p-2 border-2 rounded-sm border-gray-100" />
    <ErrorMessage name="name" class="text-red-700" />
    <label for="description">Descripción</label>
    <Field
      id="description"
      name="description"
      type="text"
      class="p-2 border-2 rounded-sm border-gray-200"
    />
    <ErrorMessage name="description" class="text-red-700" />
    <button>Tarea</button>
  </Form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { taskFormSchema } from '@/schemas'
import kanban from '@/store/kanban'
import { ACTIONS, type Column, type Task } from '@/types'
const taskForm = ref()
const validationSchema = toTypedSchema(taskFormSchema)
const emit = defineEmits<{
  (e: 'close-modal'): void
}>()
const props = defineProps<{
  columnId: Column['columnId']
  task?: Task
  action: ACTIONS
}>()
onMounted(() => {
  if (props.action === ACTIONS.UPDATE_TASK) {
    taskForm.value.setFieldValue('name', props.task?.name)
    taskForm.value.setFieldValue('description', props.task?.description)
  }
})
const onSubmit = (values: any) => {
  if (props.action === ACTIONS.ADD_TASK) {
    kanban.addTaksColumn(props.columnId, {
      name: values.name,
      description: values.description
    })
  } else if (props.action === ACTIONS.UPDATE_TASK && props.task) {
    const updateTask = {
      taskId: props.task.taskId,
      name: values.name,
      description: values.description
    }
    kanban.updateTask(props.columnId, updateTask)
  }
  emit('close-modal')
}
</script>
