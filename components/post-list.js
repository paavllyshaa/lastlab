class PostList {
    constructor(apiService) {
        this.apiService = apiService;
        this.posts = [];
        this.filteredPosts = [];
    }
    
    async render(searchTerm = '') {
        try {
            this.posts = await this.apiService.getPosts();
            
            this.filteredPosts = this.posts.filter(post => 
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.body.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            let html = `
                <div class="screen-header">
                    <h2>📝 Посты пользователей</h2>
                    <div class="stats">
                        <span class="stat total">Всего постов: ${this.posts.length}</span>
                    </div>
                </div>
            `;
            
            if (this.filteredPosts.length === 0) {
                html += `
                    <div class="no-data">
                        <div>📄</div>
                        <h3>Посты не найдены</h3>
                        <p>Попробуйте изменить поисковый запрос</p>
                    </div>
                `;
            } else {
                html += `
                    <div class="posts-container">
                        <div class="posts-stats">
                            Показано: ${this.filteredPosts.length} из ${this.posts.length} постов
                            ${searchTerm ? ` по запросу "${searchTerm}"` : ''}
                        </div>
                        <div class="posts-grid">
                `;
                
                this.filteredPosts.forEach(post => {
                    const shortBody = post.body.length > 150 ? post.body.substring(0, 150) + '...' : post.body;
                    
                    html += `
                        <div class="post-card">
                            <div class="post-header">
                                <h3 class="post-title">${post.title}</h3>
                                <span class="post-id">#${post.id}</span>
                            </div>
                            <div class="post-body">
                                <p>${shortBody}</p>
                            </div>
                            <div class="post-footer">
                                <div class="post-meta">
                                    <span class="post-author">👤 Автор: ${post.userId}</span>
                                </div>
                                <div class="post-actions">
                                    <button class="btn-action" onclick="app.showPostComments(${post.id})" title="Комментарии">
                                        💬 Комментарии
                                    </button>
                                </div>
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
                    <h3>⚠️ Ошибка загрузки постов</h3>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" onclick="app.retryLoading()">Повторить попытку</button>
                </div>
            `;
        }
    }
}
