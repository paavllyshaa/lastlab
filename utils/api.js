class ApiService {
    constructor() {
        this.baseUrl = 'https://jsonplaceholder.typicode.com';
        this.requestCount = 0;
        this.lastRequestTime = 0;
    }

    async makeRequest(endpoint) {
        const now = Date.now();
        if (now - this.lastRequestTime < 200) { 
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        this.requestCount++;
        this.lastRequestTime = Date.now();
        
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async getUsers() {
        return await this.makeRequest('/users');
    }
    
    async getUserTodos(userId) {
        return await this.makeRequest(`/users/${userId}/todos`);
    }
    
    async getUserPosts(userId) {
        return await this.makeRequest(`/users/${userId}/posts`);
    }
    
    async getTodos() {
        return await this.makeRequest('/todos');
    }
    
    async getPosts() {
        return await this.makeRequest('/posts');
    }
    
    async getComments() {
        return await this.makeRequest('/comments');
    }
    
    async getPostComments(postId) {
        return await this.makeRequest(`/posts/${postId}/comments`);
    }
}
