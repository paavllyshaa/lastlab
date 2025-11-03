class SPAApplication {
    constructor() {
        this.apiService = new ApiService();
        this.router = new SPARouter();
        this.breadcrumbs = new Breadcrumbs();
        this.userList = new UserList(this.apiService);
        this.searchTerm = '';
        this.currentScreen = 'users';
        
        window.app = this;
        
        this.init();
    }
    
    init() {
        this.render();
        console.log('SPA приложение инициализировано!');
    }
    onRouteChange(path) {
        this.currentScreen = path;
        this.render();
    }
    
    setupSearch() {
        const searchInput = document.getElementById('search');
        if (searchInput) {
            const debouncedSearch = debounce((term) => {
                this.searchTerm = term;
                this.render();
            }, 300);
            
            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
            
            searchInput.focus();
        }
    }
    
    async render() {
        const appElement = document.getElementById('app');
        if (!appElement) return;
        
        const path = this.router.getCurrentPath() || 'users';
        
        appElement.innerHTML = `
            <div class="screen-container">
                ${this.breadcrumbs.generate(path)}
                <div class="search-box">
                    <input type="text" id="search" placeholder="🔍 Поиск..." value="${this.searchTerm}">
                </div>
                <div class="loading">Загрузка...</div>
            </div>
        `;
        
        let content = '';
        
        try {
            switch(path) {
                case 'users':
                    content = await this.userList.render(this.searchTerm);
                    break;
                case 'users#todos':
                    content = '<div class="screen-header"><h2>✅ Задачи пользователей</h2></div><p>Компонент задач в разработке...</p>';
                    break;
                case 'users#posts':
                    content = '<div class="screen-header"><h2>📝 Посты пользователей</h2></div><p>Компонент постов в разработке...</p>';
                    break;
                case 'users#posts#comments':
                    content = '<div class="screen-header"><h2>💬 Комментарии к постам</h2></div><p>Компонент комментариев в разработке...</p>';
                    break;
                default:
                    content = `
                        <div class="error">
                            <h2>404 - Страница не найдена</h2>
                            <p>Маршрут "${path}" не существует.</p>
                            <button class="btn btn-primary" onclick="app.router.navigateTo('users')">Вернуться к пользователям</button>
                        </div>
                    `;
            }
        } catch (error) {
            content = `
                <div class="error">
                    <h3>⚠️ Произошла ошибка</h3>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" onclick="app.retryLoading()">Повторить попытку</button>
                </div>
            `;
        }
        
        appElement.innerHTML = `
            <div class="screen-container">
                ${this.breadcrumbs.generate(path)}
                <div class="search-box">
                    <input type="text" id="search" placeholder="🔍 Поиск..." value="${this.searchTerm}">
                </div>
                ${content}
            </div>
        `;
        
        this.setupSearch();
    }
    
    showUserTodos(userId) {
        this.router.navigateTo('users#todos');
    }
    
    showUserPosts(userId) {
        this.router.navigateTo('users#posts');
    }
    
    showPostComments(postId) {
        this.router.navigateTo('users#posts#comments');
    }
    
    showAddUserForm() {
        alert('📝 Форма добавления пользователя еще не реализована!');
    }
    
    retryLoading() {
        this.render();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SPAApplication();
});
