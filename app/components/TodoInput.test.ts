import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoInput from './TodoInput.vue'

// Mock the useTodos composable
const mockAddTodo = vi.fn()
vi.mock('~/composables/useTodos', () => ({
    useTodos: () => ({
        addTodo: mockAddTodo,
    }),
}))

describe('TodoInput', () => {
    it('renders input field and button', () => {
        const wrapper = mount(TodoInput)

        expect(wrapper.find('input').exists()).toBe(true)
        expect(wrapper.find('button').exists()).toBe(true)
        expect(wrapper.find('input').attributes('placeholder')).toBe('What needs to be done?')
    })

    it('updates input value on user input', async () => {
        const wrapper = mount(TodoInput)
        const input = wrapper.find('input')

        await input.setValue('New Todo')

        expect((input.element as HTMLInputElement).value).toBe('New Todo')
    })

    it('button is disabled when input is empty', () => {
        const wrapper = mount(TodoInput)
        const button = wrapper.find('button')

        expect(button.attributes('disabled')).toBeDefined()
    })

    it('button is enabled when input has text', async () => {
        const wrapper = mount(TodoInput)
        const input = wrapper.find('input')
        const button = wrapper.find('button')

        await input.setValue('New Todo')

        expect(button.attributes('disabled')).toBeUndefined()
    })

    it('calls addTodo when button is clicked', async () => {
        const wrapper = mount(TodoInput)
        const input = wrapper.find('input')
        const button = wrapper.find('button')

        await input.setValue('New Todo')
        await button.trigger('click')

        expect(mockAddTodo).toHaveBeenCalledWith('New Todo')
    })

    it('calls addTodo when Enter key is pressed', async () => {
        const wrapper = mount(TodoInput)
        const input = wrapper.find('input')

        await input.setValue('New Todo')
        await input.trigger('keyup.enter')

        expect(mockAddTodo).toHaveBeenCalledWith('New Todo')
    })

    it('clears input after adding todo', async () => {
        const wrapper = mount(TodoInput)
        const input = wrapper.find('input')

        await input.setValue('New Todo')
        await input.trigger('keyup.enter')

        expect((input.element as HTMLInputElement).value).toBe('')
    })

    it('does not call addTodo when input is empty', async () => {
        mockAddTodo.mockClear()
        const wrapper = mount(TodoInput)
        const input = wrapper.find('input')

        await input.trigger('keyup.enter')

        expect(mockAddTodo).not.toHaveBeenCalled()
    })

    it('does not call addTodo when input is only whitespace', async () => {
        mockAddTodo.mockClear()
        const wrapper = mount(TodoInput)
        const input = wrapper.find('input')

        await input.setValue('   ')
        await input.trigger('keyup.enter')

        expect(mockAddTodo).not.toHaveBeenCalled()
    })
})
