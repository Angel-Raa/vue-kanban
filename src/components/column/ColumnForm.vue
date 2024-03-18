<template>
  <Form
    ref="columnForm"
    :validation-schema="validationSchema"
    @submit="onSubmi"
    class="flex flex-col gap-2"
  >
    <label for="name">Nombre</label>
    <Field id="name" type="text" name="name" class="p-2 border-2 rounded-sm border-gray-300" />
    <ErrorMessage name="name" class="text-red-700" />
    <button type="submit">Agregar</button>
  </Form>
</template>

<script setup lang="ts">
import { columnFormSchema } from '@/schemas'
import kanban from '@/store/kanban'
import { ACTIONS, type Column } from '@/types'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { onMounted, ref } from 'vue'
const columnForm = ref()
const emit = defineEmits<{
  (e: 'close-modal'): void
}>()
const props = defineProps<{
  column?: Column
  action: ACTIONS
}>()

onMounted(() => {
  if (props.action === ACTIONS.UPDATE) {
    columnForm.value.setFieldValue('name', props.column?.name)
  }
})
const validationSchema = toTypedSchema(columnFormSchema)
const onSubmi = (values: any) => {
  if (props.action === ACTIONS.ADD) {
    kanban.addColumn(values.name)
  } else if (props.action === ACTIONS.UPDATE) {
    kanban.updateColumn({
      columnId: props.column?.columnId!,
      name: values.name
    })
  }
  emit('close-modal')
}
</script>
