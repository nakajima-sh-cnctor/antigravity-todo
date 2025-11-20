<script setup lang="ts">
import type { FilterType } from '~/composables/useTodos'

const { filter, activeCount, completedCount, setFilter, clearCompleted } = useTodos()

const filterOptions = computed(() => [
  { value: 'all' as FilterType, label: 'All', count: activeCount.value + completedCount.value },
  { value: 'active' as FilterType, label: 'Active', count: activeCount.value },
  { value: 'completed' as FilterType, label: 'Completed', count: completedCount.value }
])
</script>

<template>
  <div class="filters-container">
    <div class="filter-buttons">
      <button
        v-for="filterOption in filterOptions"
        :key="filterOption.value"
        class="filter-button"
        :class="{ active: filter === filterOption.value }"
        @click="setFilter(filterOption.value)"
      >
        {{ filterOption.label }}
        <span v-if="filterOption.count !== undefined" class="count-badge">
          {{ filterOption.count }}
        </span>
      </button>
    </div>
    
    <button
      v-if="completedCount > 0"
      class="clear-button"
      @click="clearCompleted"
    >
      Clear Completed
    </button>
  </div>
</template>

<style scoped>
.filters-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  flex-wrap: wrap;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-button {
  padding: 0.6rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-button:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
}

.filter-button.active {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-color: var(--primary);
  color: white;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.4rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
}

.filter-button.active .count-badge {
  background: rgba(255, 255, 255, 0.3);
}

.clear-button {
  padding: 0.6rem 1.2rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: 500;
}

.clear-button:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-buttons {
    justify-content: center;
  }
  
  .clear-button {
    width: 100%;
  }
}
</style>
