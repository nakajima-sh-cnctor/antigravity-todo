import { describe, it, expect } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

// Mock useState before importing the composable
const { useState } = vi.hoisted(() => {
    return {
        useState: vi.fn((key: string, init: () => any) => {
            const state = ref(init())
            return state
        }),
    }
})

mockNuxtImport('useState', () => useState)

// Now import the composable
import { useTodos } from './useTodos'

describe('useTodos', () => {
    describe('State Initialization', () => {
        it('should initialize with empty todos array', () => {
            const { allTodos } = useTodos()
            expect(allTodos.value).toEqual([])
        })

        it('should initialize with "all" filter', () => {
            const { filter } = useTodos()
            expect(filter.value).toBe('all')
        })
    })

    describe('addTodo', () => {
        it('should add a new todo', () => {
            const { addTodo, allTodos } = useTodos()

            addTodo('Test Todo')

            expect(allTodos.value).toHaveLength(1)
            expect(allTodos.value[0]!.text).toBe('Test Todo')
            expect(allTodos.value[0]!.completed).toBe(false)
        })

        it('should not add empty todo', () => {
            const { addTodo, allTodos } = useTodos()

            addTodo('   ')

            expect(allTodos.value).toHaveLength(0)
        })

        it('should trim todo text', () => {
            const { addTodo, allTodos } = useTodos()

            addTodo('  Test Todo  ')

            expect(allTodos.value[0]!.text).toBe('Test Todo')
        })

        it('should add todo at the beginning of the list', () => {
            const { addTodo, allTodos } = useTodos()

            addTodo('First')
            addTodo('Second')

            expect(allTodos.value[0]!.text).toBe('Second')
            expect(allTodos.value[1]!.text).toBe('First')
        })

        it('should generate unique id for each todo', async () => {
            const { addTodo, allTodos } = useTodos()

            addTodo('First')
            // Add small delay to ensure different timestamps
            await new Promise(resolve => setTimeout(resolve, 2))
            addTodo('Second')

            expect(allTodos.value[0]!.id).not.toBe(allTodos.value[1]!.id)
        })
    })

    describe('toggleTodo', () => {
        it('should toggle todo completion status', () => {
            const { addTodo, toggleTodo, allTodos } = useTodos()

            addTodo('Test Todo')
            const todoId = allTodos.value[0]!.id

            toggleTodo(todoId)
            expect(allTodos.value[0]!.completed).toBe(true)

            toggleTodo(todoId)
            expect(allTodos.value[0]!.completed).toBe(false)
        })

        it('should do nothing if todo not found', () => {
            const { addTodo, toggleTodo, allTodos } = useTodos()

            addTodo('Test Todo')
            const initialCompleted = allTodos.value[0]!.completed

            toggleTodo('non-existent-id')

            expect(allTodos.value[0]!.completed).toBe(initialCompleted)
        })
    })

    describe('deleteTodo', () => {
        it('should delete a todo', () => {
            const { addTodo, deleteTodo, allTodos } = useTodos()

            addTodo('Test Todo')
            const todoId = allTodos.value[0]!.id

            deleteTodo(todoId)

            expect(allTodos.value).toHaveLength(0)
        })

        it('should delete correct todo from multiple todos', async () => {
            const { addTodo, deleteTodo, allTodos } = useTodos()

            addTodo('First')
            await new Promise(resolve => setTimeout(resolve, 2))
            addTodo('Second')
            await new Promise(resolve => setTimeout(resolve, 2))
            addTodo('Third')

            // Get the ID of the second todo (middle one)
            const todos = allTodos.value
            const secondTodo = todos.find(t => t.text === 'Second')
            if (secondTodo) {
                deleteTodo(secondTodo.id)
            }

            expect(allTodos.value).toHaveLength(2)
            expect(allTodos.value.find(t => t.text === 'Second')).toBeUndefined()
        })
    })

    describe('editTodo', () => {
        it('should edit todo text', () => {
            const { addTodo, editTodo, allTodos } = useTodos()

            addTodo('Original Text')
            const todoId = allTodos.value[0]!.id

            editTodo(todoId, 'Updated Text')

            expect(allTodos.value[0]!.text).toBe('Updated Text')
        })

        it('should trim edited text', () => {
            const { addTodo, editTodo, allTodos } = useTodos()

            addTodo('Original')
            const todoId = allTodos.value[0]!.id

            editTodo(todoId, '  Updated  ')

            expect(allTodos.value[0]!.text).toBe('Updated')
        })

        it('should not update if new text is empty', () => {
            const { addTodo, editTodo, allTodos } = useTodos()

            addTodo('Original')
            const todoId = allTodos.value[0]!.id

            editTodo(todoId, '   ')

            expect(allTodos.value[0]!.text).toBe('Original')
        })

        it('should do nothing if todo not found', () => {
            const { addTodo, editTodo, allTodos } = useTodos()

            addTodo('Test')

            editTodo('non-existent-id', 'Updated')

            expect(allTodos.value[0]!.text).toBe('Test')
        })
    })

    describe('clearCompleted', () => {
        it('should remove all completed todos', async () => {
            const { addTodo, toggleTodo, clearCompleted, allTodos } = useTodos()

            addTodo('First')
            await new Promise(resolve => setTimeout(resolve, 2))
            addTodo('Second')
            await new Promise(resolve => setTimeout(resolve, 2))
            addTodo('Third')

            // Toggle first and third
            const todos = allTodos.value
            const firstTodo = todos.find(t => t.text === 'First')
            const thirdTodo = todos.find(t => t.text === 'Third')

            if (firstTodo) toggleTodo(firstTodo.id)
            if (thirdTodo) toggleTodo(thirdTodo.id)

            clearCompleted()

            expect(allTodos.value).toHaveLength(1)
            expect(allTodos.value[0]!.text).toBe('Second')
        })

        it('should do nothing if no completed todos', () => {
            const { addTodo, clearCompleted, allTodos } = useTodos()

            addTodo('First')
            addTodo('Second')

            clearCompleted()

            expect(allTodos.value).toHaveLength(2)
        })
    })

    describe('setFilter', () => {
        it('should change filter to active', () => {
            const { setFilter, filter } = useTodos()

            setFilter('active')

            expect(filter.value).toBe('active')
        })

        it('should change filter to completed', () => {
            const { setFilter, filter } = useTodos()

            setFilter('completed')

            expect(filter.value).toBe('completed')
        })

        it('should change filter to all', () => {
            const { setFilter, filter } = useTodos()

            setFilter('active')
            setFilter('all')

            expect(filter.value).toBe('all')
        })
    })

    describe('Filtered Todos', () => {
        it('should show all todos when filter is "all"', () => {
            const { addTodo, toggleTodo, todos, allTodos } = useTodos()

            addTodo('First')
            addTodo('Second')
            toggleTodo(allTodos.value[0]!.id)

            expect(todos.value).toHaveLength(2)
        })

        it('should show only active todos when filter is "active"', () => {
            const { addTodo, toggleTodo, setFilter, todos, allTodos } = useTodos()

            addTodo('Active')
            addTodo('Completed')
            const completedTodo = allTodos.value.find(t => t.text === 'Completed')
            if (completedTodo) toggleTodo(completedTodo.id)

            setFilter('active')

            expect(todos.value).toHaveLength(1)
            expect(todos.value[0]!.text).toBe('Active')
        })

        it('should show only completed todos when filter is "completed"', () => {
            const { addTodo, toggleTodo, setFilter, todos, allTodos } = useTodos()

            addTodo('Active')
            addTodo('Completed')
            const completedTodo = allTodos.value.find(t => t.text === 'Completed')
            if (completedTodo) toggleTodo(completedTodo.id)

            setFilter('completed')

            expect(todos.value).toHaveLength(1)
            expect(todos.value[0]!.text).toBe('Completed')
        })
    })

    describe('Computed Properties', () => {
        it('should calculate active count correctly', () => {
            const { addTodo, toggleTodo, activeCount, allTodos } = useTodos()

            addTodo('First')
            addTodo('Second')
            addTodo('Third')

            expect(activeCount.value).toBe(3)

            toggleTodo(allTodos.value[0]!.id)
            expect(activeCount.value).toBe(2)
        })

        it('should calculate completed count correctly', async () => {
            const { addTodo, toggleTodo, completedCount, allTodos } = useTodos()

            addTodo('First')
            await new Promise(resolve => setTimeout(resolve, 2))
            addTodo('Second')
            await new Promise(resolve => setTimeout(resolve, 2))
            addTodo('Third')

            expect(completedCount.value).toBe(0)

            const todos = allTodos.value
            const firstTodo = todos.find(t => t.text === 'First')
            const secondTodo = todos.find(t => t.text === 'Second')

            if (firstTodo) toggleTodo(firstTodo.id)
            if (secondTodo) toggleTodo(secondTodo.id)

            expect(completedCount.value).toBe(2)
        })
    })
})
