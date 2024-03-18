import type { z } from 'zod'
import type { columnSchema, taskSchema } from '@/schemas'
export type Column = z.infer<typeof columnSchema>
export type Task = z.infer<typeof taskSchema>

export type ColumnWithTasks = Column & { tasks: Task[] }
export enum TYPES {
  COLUMN = 'COLUMN',
  TASK = 'TASK'
}

export enum ACTIONS {
  ADD = 'Añadir',
  UPDATE = 'Actualizar',
  DELETE = 'Suprimir',
  ADD_TASK = 'Agregar Tarea',
  UPDATE_TASK = 'Actualizar Tarea',
  DELETE_TASK = 'Elimina Tarea '
}

export type TRANSFER_DATA = {
  type: TYPES
  columnId?: Column['columnId']
  taskId?: Task['taskId']
}
