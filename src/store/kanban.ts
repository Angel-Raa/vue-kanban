import type { Column, Task } from '@/types'
import { useLocalStorage } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
const KEY = 'KANBAN-STORE'
export const STORE = useLocalStorage<Column[]>(KEY, [])
export const addColumn = (name: Column['name']): void => {
  STORE.value.push({
    columnId: uuidv4(),
    name,
    tasks: []
  })
}

export const updateColumn = (payload: Pick<Column, 'name' | 'columnId'>): void => {
  const columnToUpdate = STORE.value.find((column) => column.columnId === payload.columnId)

  if (!columnToUpdate) {
    throw new Error(`Column with id ${payload.columnId} not found.`)
  }

  columnToUpdate.name = payload.name

  // Aquí deberías tener tu lógica específica para actualizar el estado global
}

export const deleteColumn = (columnId: Column['columnId']): void => {
  STORE.value = STORE.value.filter((c) => c.columnId !== columnId)
}

export const addTaksColumn = (
  columnId: Column['columnId'],
  payload: Pick<Task, 'name' | 'description'>
): void => {
  const column = STORE.value.find((c) => c.columnId === columnId)
  if (!column) return
  column.tasks.push({
    taskId: uuidv4(),
    name: payload.name,
    description: payload.description
  })
}

export const updateTask = (columnId: Column['columnId'], task: Task): Column => {
  // Buscar la columna correspondiente
  const columnToUpdate = STORE.value.find((c) => c.columnId === columnId)
  if (!columnToUpdate) {
    throw new Error(`Column with id ${columnId} not found.`)
  }

  // Encontrar la tarea dentro de la columna
  const updatedTasks = columnToUpdate.tasks.map((oldTask) => {
    if (oldTask.taskId === task.taskId) {
      return { ...oldTask, ...task } // Actualizar la tarea
    }
    return oldTask
  })

  // Verificar si la tarea existe en la columna
  if (updatedTasks.length === columnToUpdate.tasks.length) {
    throw new Error(`Task with id ${task.taskId} not found in column.`)
  }

  // Actualizar la lista de tareas en la columna
  columnToUpdate.tasks = updatedTasks

  // Actualizar el estado global de la aplicación
  // (STORE.value en este caso, asumiendo que es un estado global)
  // Aquí deberías tener tu lógica específica para actualizar el estado global

  // Retornar la columna actualizada
  return columnToUpdate
}

export const deleteTask = (columnId: Column['columnId'], taskId: Task['taskId']): void => {
  const column = STORE.value.find((c) => c.columnId === columnId)
  if (!column) return
  column.tasks = column.tasks.filter((t) => t.taskId !== taskId)
}

export const moveTask = (
  taskId: Task['taskId'],
  targetColumnId: Column['columnId'],
  targetTaskId?: Task['taskId']
): void => {
  let currentTask: Task 
  let currentTaskIndex: number | undefined

  // Buscar la tarea en la columna actual y obtener su índice
  const columnToUpdate = STORE.value.find((c) => {
    const taskIndex = c.tasks.findIndex((t, i) => {
      if (t.taskId === taskId) {
        currentTask = t
        currentTaskIndex = i
        return true
      }
      return false
    })
    return taskIndex !== -1
  })

  if (!columnToUpdate || currentTaskIndex === undefined) {
    throw new Error(`Task with id ${taskId} not found in column.`)
  }

  // Eliminar la tarea de la columna actual
  const removedTask = columnToUpdate.tasks.splice(currentTaskIndex, 1)[0]

  // Obtener la columna de destino
  const targetColumn = STORE.value.find((c) => c.columnId === targetColumnId)
  if (!targetColumn) {
    throw new Error(`Target column with id ${targetColumnId} not found.`)
  }

  // Obtener el índice de la tarea de destino (si se especifica)
  const targetTaskIndex = targetTaskId
    ? targetColumn.tasks.findIndex((t) => t.taskId === targetTaskId)
    : -1

  // Insertar la tarea en la columna de destino en la posición adecuada
  if (targetTaskIndex !== -1) {
    targetColumn.tasks.splice(targetTaskIndex, 0, removedTask)
  } else {
    targetColumn.tasks.push(removedTask)
  }
}
export const getColumns = (): Column[] => STORE.value
export const moveColumn = (columnId: Column['columnId'], targetColumnId: Column['columnId']) => {
  const column = STORE.value.find((c) => c.columnId === columnId)
  if (!column) return
  const targetColumn = STORE.value.find((c) => c.columnId === targetColumnId)
  if (!targetColumn) return
  const index = STORE.value.indexOf(column)
  STORE.value.splice(index, 1)
  STORE.value.splice(index, 0, targetColumn)
  console.log(STORE.value)
  return STORE.value
}

export default {
  STORE,
  getColumns,
  addColumn,
  updateColumn,
  deleteColumn,
  addTaksColumn,
  updateTask,
  deleteTask,
  moveTask,
  moveColumn
}
