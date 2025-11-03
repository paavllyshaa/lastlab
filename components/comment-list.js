class CommentList {
    constructor(apiService) {
        this.apiService = apiService;
        this.comments = [];
        this.filteredComments = [];
        this.currentPostId = null;
    }
    
    async render(searchTerm = '', postId = null) {
        try {
            if (postId && postId !== this.currentPostId) {
                this.comments = await this.apiService.getPostComments(postId);
                this.currentPostId = postId;
            } else if (!this.currentPostId) {
                this.comments = await this.apiService.getComments();
            }
            
            this.filteredComments = this.comments.filter(comment => 
                comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                comment.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
                comment.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            let html = `
                <div class="screen-header">
                    <h2>💬 Комментарии</h2>
                    <div class="stats">
                        <span class="stat total">Всего: ${this.comments.length}</span>
                        ${this.currentPostId ? `<span class="stat post">Пост: #${this.currentPostId}</span>` : ''}
                    </div>
                </div>
            `;
            
            if (this.filteredComments.length === 0) {
                html += `
                    <div class="no-data">
                        <div>💭</div>
                        <h3>Комментарии не найдены</h3>
                        <p>Попробуйте изменить поисковый запрос</p>
                    </div>
                `;
            } else {
                html += `
                    <div class="comments-container">
                        <div class="comments-stats">
                            Показано: ${this.filteredComments.length} из ${this.comments.length} комментариев
                            ${searchTerm ? ` по запросу "${searchTerm}"` : ''}
                        </div>
                        <div class="comments-list">
                `;
                
                this.filteredComments.forEach(comment => {
                    const shortBody = comment.body.length > 100 ? comment.body.substring(0, 100) + '...' : comment.body;
                    
                    html += `
                        <div class="comment-card">
                            <div class="comment-header">
                                <div class="comment-author">
                                    <strong class="comment-name">${comment.name}</strong>
                                    <span class="comment-email">📧 ${comment.email}</span>
                                </div>
                                <span class="comment-id">#${comment.id}</span>
                            </div>
                            <div class="comment-body">
                                <p>${comment.body}</p>
                            </div>
                            <div class="comment-footer">
                                <div class="comment-meta">
                                    <span class="comment-post">📝 Пост: ${comment.postId}</span>
                                </div>
                                <div class="comment-actions">
                                    <button class="btn-action small" onclick="app.showPost(${comment.postId})" title="Перейти к посту">
                                        📄 К посту
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
                    <h3>⚠️ Ошибка загрузки комментариев</h3>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" onclick="app.retryLoading()">Повторить попытку</button>
                </div>
            `;
        }
    }
    
    resetPostFilter() {
        this.currentPostId = null;
        this.comments = [];
    }
}
