<script setup lang="ts">
const { addTodo } = useTodos()
const newTodoText = ref('')

const handleAdd = () => {
  if (newTodoText.value.trim()) {
    addTodo(newTodoText.value)
    newTodoText.value = ''
  }
}
</script>

<template>
  <div class="todo-input-container">
    <input
      v-model="newTodoText"
      type="text"
      placeholder="What needs to be done?"
      class="todo-input"
      @keyup.enter="handleAdd"
    />
    <button 
      class="add-button"
      @click="handleAdd"
      :disabled="!newTodoText.trim()"
    >
      <span class="add-icon">+</span>
      Add
    </button>
  </div>
</template>

<style scoped>
.todo-input-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.todo-input {
  flex: 1;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.todo-input:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.todo-input::placeholder {
  color: var(--text-secondary);
}

.add-button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.add-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
}

.add-button:active:not(:disabled) {
  transform: translateY(0);
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-icon {
  font-size: 1.5rem;
  line-height: 1;
}

@media (max-width: 640px) {
  .todo-input-container {
    flex-direction: column;
  }
  
  .add-button {
    justify-content: center;
  }
}
</style>
