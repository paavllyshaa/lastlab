class SPAApplication {
    constructor() {
        this.apiService = new ApiService();
        this.userStorage = new UserStorage(); 
        this.router = new SPARouter();
        this.breadcrumbs = new Breadcrumbs();
        this.userList = new UserList(this.apiService, this.userStorage);  
        this.todoList = new TodoList(this.apiService);
        this.postList = new PostList(this.apiService);
        this.commentList = new CommentList(this.apiService);  
        this.searchTerm = '';
        this.currentScreen = 'users';
        this.currentPostId = null;  
        
        window.app = this;
        
        this.init();
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
        content = await this.todoList.render(this.searchTerm);
        break;
    case 'users#posts':
        content = await this.postList.render(this.searchTerm);
        break;
    case 'users#posts#comments':
        content = await this.commentList.render(this.searchTerm, this.currentPostId);
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
    
    retryLoading() {
        this.render();
    }
        // Новые методы для работы с пользователями и комментариями
    showAddUserForm() {
        const name = prompt('Введите имя пользователя:');
        if (!name) return;
        
        const email = prompt('Введите email пользователя:');
        if (!email) return;
        
        const company = prompt('Введите название компании:') || 'Не указано';
        const phone = prompt('Введите телефон:') || 'Не указан';
        const website = prompt('Введите веб-сайт:') || 'Не указан';
        const city = prompt('Введите город:') || 'Не указан';
        const street = prompt('Введите улицу:') || 'Не указана';
        
        const newUser = this.userStorage.addUser({
            name,
            email,
            company,
            phone,
            website,
            city,
            street
        });
        
        this.render();
        alert(`✅ Пользователь "${newUser.name}" успешно добавлен!`);
    }
    
    deleteUser(userId) {
        if (confirm(`Вы уверены, что хотите удалить этого пользователя?`)) {
            this.userStorage.deleteUser(userId);
            this.render();
            alert('Пользователь успешно удален!');
        }
    }
    
    showPostComments(postId) {
        this.currentPostId = postId;
        this.router.navigateTo('users#posts#comments');
    }
    
    showPost(postId) {
        this.commentList.resetPostFilter();
        this.currentPostId = null;
        this.router.navigateTo('users#posts');
        alert(`Переход к посту #${postId} (функциональность скролла будет добавлена)`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SPAApplication();
});



