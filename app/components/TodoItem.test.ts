import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoItem from './TodoItem.vue'
import { createMockTodo } from '../../tests/helpers'

// Mock the useTodos composable
const mockToggleTodo = vi.fn()
const mockDeleteTodo = vi.fn()
const mockEditTodo = vi.fn()

vi.mock('~/composables/useTodos', () => ({
    useTodos: () => ({
        toggleTodo: mockToggleTodo,
        deleteTodo: mockDeleteTodo,
        editTodo: mockEditTodo,
    }),
}))

describe('TodoItem', () => {
    it('renders todo text and date', () => {
        const todo = createMockTodo({ text: 'Test Todo' })
        const wrapper = mount(TodoItem, {
            props: { todo },
        })

        expect(wrapper.text()).toContain('Test Todo')
        expect(wrapper.find('.todo-date').exists()).toBe(true)
    })

    it('checkbox reflects completion status', () => {
        const todo = createMockTodo({ completed: false })
        const wrapper = mount(TodoItem, {
            props: { todo },
        })

        const checkbox = wrapper.find('input[type="checkbox"]')
        expect((checkbox.element as HTMLInputElement).checked).toBe(false)
    })

    it('checkbox is checked when todo is completed', () => {
        const todo = createMockTodo({ completed: true })
        const wrapper = mount(TodoItem, {
            props: { todo },
        })

        const checkbox = wrapper.find('input[type="checkbox"]')
        expect((checkbox.element as HTMLInputElement).checked).toBe(true)
    })

    it('calls toggleTodo when checkbox is clicked', async () => {
        const todo = createMockTodo({ id: '123' })
        const wrapper = mount(TodoItem, {
            props: { todo },
        })

        const checkbox = wrapper.find('input[type="checkbox"]')
        await checkbox.trigger('change')

        expect(mockToggleTodo).toHaveBeenCalledWith('123')
    })

    it('calls deleteTodo when delete button is clicked', async () => {
        const todo = createMockTodo({ id: '123' })
        const wrapper = mount(TodoItem, {
            props: { todo },
        })

        const deleteButton = wrapper.find('.delete-button')
        await deleteButton.trigger('click')

        expect(mockDeleteTodo).toHaveBeenCalledWith('123')
    })

    it('has completed class when todo is completed', () => {
        const todo = createMockTodo({ completed: true })
        const wrapper = mount(TodoItem, {
            props: { todo },
        })

        expect(wrapper.find('.todo-item').classes()).toContain('completed')
    })

    it('does not have completed class when todo is not completed', () => {
        const todo = createMockTodo({ completed: false })
        const wrapper = mount(TodoItem, {
            props: { todo },
        })

        expect(wrapper.find('.todo-item').classes()).not.toContain('completed')
    })

    it('activates edit mode on double-click', async () => {
        const todo = createMockTodo({ text: 'Original Text' })
        const wrapper = mount(TodoItem, {
            props: { todo },
        })

        await wrapper.find('.todo-content').trigger('dblclick')
        await wrapper.vm.$nextTick()

        expect(wrapper.find('.edit-input').exists()).toBe(true)
    })

    it('does not activate edit mode for completed todos', async () => {
        const todo = createMockTodo({ text: 'Completed Todo', completed: true })
        const wrapper = mount(TodoItem, {
            props: { todo },
        })

        await wrapper.find('.todo-content').trigger('dblclick')
        await wrapper.vm.$nextTick()

        expect(wrapper.find('.edit-input').exists()).toBe(false)
    })

    it('saves edit on Enter key', async () => {
        const todo = createMockTodo({ id: '123', text: 'Original' })
        const wrapper = mount(TodoItem, {
            props: { todo },
        })

        await wrapper.find('.todo-content').trigger('dblclick')
        await wrapper.vm.$nextTick()

        const editInput = wrapper.find('.edit-input')
        await editInput.setValue('Updated Text')
        await editInput.trigger('keyup.enter')

        expect(mockEditTodo).toHaveBeenCalledWith('123', 'Updated Text')
    })

    it('cancels edit on Escape key', async () => {
        mockEditTodo.mockClear()
        const todo = createMockTodo({ text: 'Original' })
        const wrapper = mount(TodoItem, {
            props: { todo },
        })

        await wrapper.find('.todo-content').trigger('dblclick')
        await wrapper.vm.$nextTick()

        const editInput = wrapper.find('.edit-input')
        await editInput.setValue('Changed')
        await editInput.trigger('keyup.escape')
        await wrapper.vm.$nextTick()

        expect(mockEditTodo).not.toHaveBeenCalled()
        expect(wrapper.find('.edit-input').exists()).toBe(false)
    })

    it('hides checkbox and delete button in edit mode', async () => {
        const todo = createMockTodo()
        const wrapper = mount(TodoItem, {
            props: { todo },
        })

        await wrapper.find('.todo-content').trigger('dblclick')
        await wrapper.vm.$nextTick()

        expect(wrapper.find('.checkbox-container').exists()).toBe(false)
        expect(wrapper.find('.delete-button').exists()).toBe(false)
    })
})
