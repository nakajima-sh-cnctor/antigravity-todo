<template>
  <div class="todo-item" :class="{ completed: todo.completed, editing: isEditing }">
    <label class="checkbox-container" v-if="!isEditing">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="handleToggle"
        class="checkbox"
      />
      <span class="checkmark"></span>
    </label>
    
    <div class="todo-content" @dblclick="startEditing">
      <input
        v-if="isEditing"
        ref="editInput"
        v-model="editText"
        type="text"
        class="edit-input"
        @keyup.enter="saveEdit"
        @keyup.escape="cancelEdit"
        @blur="saveEdit"
      />
      <template v-else>
        <p class="todo-text">{{ todo.text }}</p>
        <span class="todo-date">{{ formattedDate }}</span>
      </template>
    </div>
    
    <button 
      v-if="!isEditing"
      class="delete-button"
      @click="handleDelete"
      title="Delete todo"
    >
      <span class="delete-icon">×</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '~/composables/useTodos'

const props = defineProps<{
  todo: Todo
}>()

const { toggleTodo, deleteTodo, editTodo } = useTodos()

const isEditing = ref(false)
const editText = ref('')
const editInput = ref<HTMLInputElement | null>(null)

const handleToggle = () => {
  toggleTodo(props.todo.id)
}

const handleDelete = () => {
  deleteTodo(props.todo.id)
}

const startEditing = () => {
  if (props.todo.completed) return
  isEditing.value = true
  editText.value = props.todo.text
  nextTick(() => {
    editInput.value?.focus()
    editInput.value?.select()
  })
}

const saveEdit = () => {
  if (isEditing.value && editText.value.trim()) {
    editTodo(props.todo.id, editText.value)
  }
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  editText.value = props.todo.text
}

const formattedDate = computed(() => {
  const date = new Date(props.todo.createdAt)
  return date.toLocaleDateString('ja-JP', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.todo-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.editing {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--primary);
}

.checkbox-container {
  position: relative;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  display: block;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.checkbox:checked ~ .checkmark {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-color: var(--primary);
}

.checkmark::after {
  content: '';
  position: absolute;
  display: none;
  left: 7px;
  top: 3px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox:checked ~ .checkmark::after {
  display: block;
}

.todo-content {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.todo-item.editing .todo-content {
  cursor: default;
}

.edit-input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid var(--primary);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: inherit;
}

.edit-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
}

.todo-text {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: var(--text-primary);
  word-wrap: break-word;
  transition: all 0.3s ease;
}

.completed .todo-text {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.todo-date {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.delete-button {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}

.todo-item:hover .delete-button {
  opacity: 1;
}

.delete-button:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  transform: scale(1.1);
}

.delete-icon {
  font-size: 1.5rem;
  line-height: 1;
}

</style>
