<template>
  <div class="app">
    <div class="container">
      <header class="app-header fade-in">
        <div class="header-content">
          <h1 class="app-title">
            <span class="title-icon">✓</span>
            TODO List
          </h1>
          <p class="app-subtitle">Organize your tasks beautifully</p>
        </div>
      </header>

      <main class="app-main">
        <div class="card slide-in">
          <TodoInput />
          <TodoFilters />
          <TodoList />
        </div>
      </main>

      <footer class="app-footer">
        <p>Built with Nuxt 4 & Vue 3</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  padding: 2rem 0;
}

.app-header {
  text-align: center;
  margin-bottom: 3rem;
}

.header-content {
  display: inline-block;
}

.app-title {
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.title-icon {
  font-size: 3rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  font-weight: 400;
}

.app-main {
  margin-bottom: 2rem;
}

.app-footer {
  text-align: center;
  padding: 2rem 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .app-title {
    font-size: 2.5rem;
  }
  
  .title-icon {
    font-size: 2rem;
  }
  
  .app-subtitle {
    font-size: 1rem;
  }
}
</style>
