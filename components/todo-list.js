class TodoList {
    constructor(apiService) {
        this.apiService = apiService;
        this.todos = [];
        this.filteredTodos = [];
    }
    
    async render(searchTerm = '') {
        try {
            this.todos = await this.apiService.getTodos();
            this.filteredTodos = this.todos.filter(todo => 
                todo.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            let html = `
                <div class="screen-header">
                    <h2>✅ Задачи пользователей</h2>
                    <div class="stats">
                        <span class="stat completed">Выполнено: ${this.todos.filter(t => t.completed).length}</span>
                        <span class="stat total">Всего: ${this.todos.length}</span>
                    </div>
                </div>
            `;
            
            if (this.filteredTodos.length === 0) {
                html += `
                    <div class="no-data">
                        <div>📝</div>
                        <h3>Задачи не найдены</h3>
                        <p>Попробуйте изменить поисковый запрос</p>
                    </div>
                `;
            } else {
                html += `
                    <div class="todos-container">
                        <div class="todos-stats">
                            Показано: ${this.filteredTodos.length} из ${this.todos.length} задач
                            ${searchTerm ? ` по запросу "${searchTerm}"` : ''}
                        </div>
                        <div class="todos-list">
                `;
                
                this.filteredTodos.forEach(todo => {
                    html += `
                        <div class="todo-item ${todo.completed ? 'completed' : 'pending'}">
                            <div class="todo-checkbox">
                                <input type="checkbox" ${todo.completed ? 'checked' : ''} disabled>
                                <span class="checkmark"></span>
                            </div>
                            <div class="todo-content">
                                <div class="todo-title">${todo.title}</div>
                                <div class="todo-meta">
                                    <span class="todo-user">👤 Пользователь ${todo.userId}</span>
                                    <span class="todo-id">#${todo.id}</span>
                                </div>
                            </div>
                            <div class="todo-status ${todo.completed ? 'status-completed' : 'status-pending'}">
                                ${todo.completed ? '✅ Выполнено' : '⏳ В процессе'}
                            </div>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            }
            
            return html;
            
        } catch (error) {
            return `
                <div class="error">
                    <h3>⚠️ Ошибка загрузки задач</h3>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" onclick="app.retryLoading()">Повторить попытку</button>
                </div>
            `;
        }
    }
}
