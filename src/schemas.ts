import { z } from 'zod'

export const taskFormSchema = z.object({
  name: z.string().min(1, 'Se requiere el nombre').default(''),
  description: z.string().min(1, 'Se requiere descripción').default('')
})

export const taskSchema = taskFormSchema.merge(
  z.object({
    taskId: z.string()
  })
)

export const columnFormSchema = z.object({
  name: z.string().min(1, 'Se requiere el nombre').default('')
})

export const columnSchema = columnFormSchema.merge(
  z.object({
    columnId: z.string(),
    tasks: z.array(taskSchema)
  })
)
