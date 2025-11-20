<template>
  <div class="todo-list">
    <TransitionGroup name="list" tag="div" class="todo-items">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
      />
    </TransitionGroup>
    
    <div v-if="todos.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <p class="empty-text">{{ emptyMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { todos, filter } = useTodos()

const emptyMessage = computed(() => {
  switch (filter.value) {
    case 'active':
      return 'No active todos. Great job!'
    case 'completed':
      return 'No completed todos yet'
    default:
      return 'No todos yet. Add one to get started!'
  }
})
</script>

<style scoped>
.todo-list {
  min-height: 200px;
}

.todo-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin: 0;
}

/* List transition animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
