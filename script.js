class SPAApplication {
    constructor() {
        this.apiService = new ApiService();
        this.userStorage = new UserStorage();
        this.stateManager = new StateManager();
        this.router = new SPARouter();
        this.breadcrumbs = new Breadcrumbs();
        this.loadingSpinner = new LoadingSpinner();
        
        this.userList = new UserList(this.apiService, this.userStorage);
        this.todoList = new TodoList(this.apiService);
        this.postList = new PostList(this.apiService);
        this.commentList = new CommentList(this.apiService);
        
        this.init();
    }
    
    async init() {
        this.stateManager.subscribe((state) => this.onStateChange(state));
        
        window.app = this;
        
        await this.render();
        console.log('🚀 SPA приложение инициализировано!');
    }
    onStateChange(state) {
        if (state.error) {
            this.showError(state.error);
        }
    }
    
    onRouteChange(path) {
        this.stateManager.setState({ 
            currentView: path,
            searchTerm: ''
        });
        this.render();
    }
    
    setupSearch() {
        const searchInput = document.getElementById('search');
        if (searchInput) {
            const debouncedSearch = debounce((term) => {
                this.stateManager.setSearchTerm(term);
                this.render();
            }, 300);
            
            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
            
            if (!this.stateManager.getState().searchTerm) {
                searchInput.focus();
            }
        }
    }
    
    async render() {
        const appElement = document.getElementById('app');
        if (!appElement) return;
        
        const state = this.stateManager.getState();
        const path = this.router.getCurrentPath() || 'users';
        
        appElement.innerHTML = `
            <div class="screen-container">
                ${this.breadcrumbs.generate(path)}
                <div class="search-box">
                    <input type="text" id="search" placeholder="🔍 Поиск..." value="${state.searchTerm}">
                </div>
                ${this.loadingSpinner.render()}
            </div>
        `;
        
        let content = '';
        
        try {
            this.stateManager.setLoading(true);
            
            switch(path) {
                case 'users':
                    content = await this.userList.render(state.searchTerm);
                    break;
                case 'users#todos':
                    content = await this.todoList.render(state.searchTerm);
                    break;
                case 'users#posts':
                    content = await this.postList.render(state.searchTerm);
                    break;
                case 'users#posts#comments':
                    content = await this.commentList.render(state.searchTerm, this.stateManager.getState().currentPostId);
                    break;
                default:
                    content = this.renderNotFound(path);
            }
            
            this.stateManager.clearError();
        } catch (error) {
            content = this.renderError(error);
            this.stateManager.setError(error.message);
        } finally {
            this.stateManager.setLoading(false);
        }
        
        appElement.innerHTML = `
            <div class="screen-container">
                ${this.breadcrumbs.generate(path)}
                <div class="search-box">
                    <input type="text" id="search" placeholder="🔍 Поиск..." value="${state.searchTerm}">
                </div>
                ${content}
            </div>
        `;
        
        this.setupSearch();
    }
    
    renderNotFound(path) {
        return `
            <div class="error">
                <h2>🚫 404 - Страница не найдена</h2>
                <p>Маршрут "<strong>${path}</strong>" не существует.</p>
                <div style="margin-top: 20px;">
                    <button class="btn btn-primary" onclick="app.router.navigateTo('users')">
                        🏠 Вернуться к пользователям
                    </button>
                </div>
            </div>
        `;
    }
    
    renderError(error) {
        return `
            <div class="error">
                <h3>⚠️ Произошла ошибка</h3>
                <p>${error.message}</p>
                <div class="error-actions">
                    <button class="btn btn-primary" onclick="app.retryLoading()">
                        🔄 Повторить попытку
                    </button>
                    <button class="btn" onclick="app.stateManager.clearError()" style="margin-left: 10px;">
                        ❌ Скрыть ошибку
                    </button>
                </div>
            </div>
        `;
    }
    
    showError(message) {
        console.error('Application error:', message);
    }
    
    showUserTodos(userId) {
        this.router.navigateTo('users#todos');
    }
    
    showUserPosts(userId) {
        this.router.navigateTo('users#posts');
    }
    
    showPostComments(postId) {
        this.stateManager.setState({ currentPostId: postId });
        this.router.navigateTo('users#posts#comments');
    }
    
    showPost(postId) {
        this.commentList.resetPostFilter();
        this.stateManager.setState({ currentPostId: null });
        this.router.navigateTo('users#posts');
        this.highlightPost(postId);
    }
    
    highlightPost(postId) {
        setTimeout(() => {
            const postElement = document.querySelector(`[data-post-id="${postId}"]`);
            if (postElement) {
                postElement.style.animation = 'highlight 2s ease-in-out';
                postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }
    showAddUserForm() {
        this.renderAddUserForm();
    }
    
    renderAddUserForm() {
        const formHtml = `
            <div class="modal-overlay" onclick="app.closeModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3>👤 Добавить нового пользователя</h3>
                        <button class="modal-close" onclick="app.closeModal()">&times;</button>
                    </div>
                    <form id="addUserForm" onsubmit="app.handleAddUserSubmit(event)">
                        <div class="form-group">
                            <label for="userName">Имя пользователя *</label>
                            <input type="text" id="userName" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="userEmail">Email *</label>
                            <input type="email" id="userEmail" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="userCompany">Компания</label>
                            <input type="text" id="userCompany" name="company">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="userPhone">Телефон</label>
                                <input type="tel" id="userPhone" name="phone">
                            </div>
                            <div class="form-group">
                                <label for="userWebsite">Веб-сайт</label>
                                <input type="url" id="userWebsite" name="website">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="userCity">Город</label>
                                <input type="text" id="userCity" name="city">
                            </div>
                            <div class="form-group">
                                <label for="userStreet">Улица</label>
                                <input type="text" id="userStreet" name="street">
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn" onclick="app.closeModal()">Отмена</button>
                            <button type="submit" class="btn btn-primary">Добавить пользователя</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHtml);
    }
    
    handleAddUserSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            company: formData.get('company'),
            phone: formData.get('phone'),
            website: formData.get('website'),
            city: formData.get('city'),
            street: formData.get('street')
        };
        
        try {
            const newUser = this.userStorage.addUser(userData);
            this.closeModal();
            this.showSuccessMessage(`Пользователь "${newUser.name}" успешно добавлен!`);
            this.render();
        } catch (error) {
            alert(`Ошибка при добавлении пользователя: ${error.message}`);
        }
    }
    
    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }
    
    deleteUser(userId) {
        const user = this.userStorage.getUserById(userId);
        if (user && confirm(`Вы уверены, что хотите удалить пользователя "${user.name}"?`)) {
            this.userStorage.deleteUser(userId);
            this.showSuccessMessage(`Пользователь "${user.name}" успешно удален!`);
            this.render();
        }
    }
    
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.position = 'fixed';
        successDiv.style.top = '20px';
        successDiv.style.right = '20px';
        successDiv.style.zIndex = '1000';
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    retryLoading() {
        this.stateManager.clearError();
        this.render();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SPAApplication();
});
