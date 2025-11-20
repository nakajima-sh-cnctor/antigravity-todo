import type { Todo } from '../app/composables/useTodos'

/**
 * Create a mock todo for testing
 */
export function createMockTodo(overrides: Partial<Todo> = {}): Todo {
    return {
        id: '1',
        text: 'Test Todo',
        completed: false,
        createdAt: Date.now(),
        ...overrides,
    }
}

/**
 * Create multiple mock todos
 */
export function createMockTodos(count: number): Todo[] {
    return Array.from({ length: count }, (_, i) => createMockTodo({
        id: String(i + 1),
        text: `Test Todo ${i + 1}`,
        createdAt: Date.now() - (count - i) * 1000,
    }))
}
