class UserList {
    constructor(apiService, userStorage) {
        this.apiService = apiService;
        this.userStorage = userStorage;
        this.users = [];
    }
    
    async render(searchTerm = '') {
        try {
            const apiUsers = await this.apiService.getUsers();
            this.users = this.userStorage.getAllUsers(apiUsers);
            
            const filteredUsers = this.users.filter(user => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            let html = `
                <div class="screen-header">
                    <h2>👥 Пользователи</h2>
                    <button class="btn btn-primary" onclick="app.showAddUserForm()">+ Добавить пользователя</button>
                </div>
                <div class="users-grid">
            `;
            
            if (filteredUsers.length === 0) {
                html += `<div class="no-data">Пользователи не найдены</div>`;
            } else {
                filteredUsers.forEach(user => {
                    const isCustom = this.userStorage.isCustomUser(user.id);
                    
                    html += `
                        <div class="user-card ${isCustom ? 'custom-user' : ''}">
                            <div class="user-header">
                                <h3 class="user-name">${user.name} ${isCustom ? '👤' : ''}</h3>
                                <span class="user-id">#${user.id}</span>
                            </div>
                            <div class="user-info">
                                <p class="user-email">📧 ${user.email}</p>
                                <p class="user-company">🏢 ${user.company?.name || 'Не указано'}</p>
                                <p class="user-phone">📞 ${user.phone || 'Не указан'}</p>
                                <p class="user-website">🌐 ${user.website || 'Не указан'}</p>
                            </div>
                            <div class="user-address">
                                <small>📍 ${user.address?.city}, ${user.address?.street}</small>
                            </div>
                            <div class="user-actions">
                                <button class="btn-action" onclick="app.showUserTodos(${user.id})" title="Задачи">
                                    ✅ Задачи
                                </button>
                                <button class="btn-action" onclick="app.showUserPosts(${user.id})" title="Посты">
                                    📝 Посты
                                </button>
                                ${isCustom ? `
                                    <button class="btn-danger" onclick="app.deleteUser(${user.id})" title="Удалить пользователя">
                                        🗑️ Удалить
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `;
                });
            }
            
            html += '</div>';
            return html;
            
        } catch (error) {
            return `
                <div class="error">
                    <h3>⚠️ Ошибка загрузки пользователей</h3>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" onclick="app.retryLoading()">Повторить попытку</button>
                </div>
            `;
        }
    }
}
