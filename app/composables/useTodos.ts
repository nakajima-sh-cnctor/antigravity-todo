export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'

export const useTodos = () => {
  const todos = useState<Todo[]>('todos', () => [])
  const filter = useState<FilterType>('filter', () => 'all')

  // Load todos from localStorage on client side
  onMounted(() => {
    const stored = localStorage.getItem('todos')
    if (stored) {
      try {
        todos.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to load todos from localStorage', e)
      }
    }
  })

  // Save todos to localStorage whenever they change
  watch(todos, (newTodos) => {
    if (import.meta.client) {
      localStorage.setItem('todos', JSON.stringify(newTodos))
    }
  }, { deep: true })

  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active':
        return todos.value.filter(todo => !todo.completed)
      case 'completed':
        return todos.value.filter(todo => todo.completed)
      default:
        return todos.value
    }
  })

  const activeCount = computed(() => 
    todos.value.filter(todo => !todo.completed).length
  )

  const completedCount = computed(() => 
    todos.value.filter(todo => todo.completed).length
  )

  const addTodo = (text: string) => {
    if (!text.trim()) return
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now()
    }
    
    todos.value.unshift(newTodo)
  }

  const toggleTodo = (id: string) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  const deleteTodo = (id: string) => {
    todos.value = todos.value.filter(t => t.id !== id)
  }

  const clearCompleted = () => {
    todos.value = todos.value.filter(t => !t.completed)
  }

  const editTodo = (id: string, newText: string) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo && newText.trim()) {
      todo.text = newText.trim()
    }
  }

  const setFilter = (newFilter: FilterType) => {
    filter.value = newFilter
  }

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    activeCount,
    completedCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    setFilter
  }
}
