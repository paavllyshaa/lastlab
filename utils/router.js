class SPARouter {
    constructor() {
        this.routes = {
            'users': 'renderUsers',
            'users#todos': 'renderTodos', 
            'users#posts': 'renderPosts',
            'users#posts#comments': 'renderComments'
        };
        this.currentPath = 'users';
        this.init();
    }
    
    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }
    
    handleRoute() {
        const hash = window.location.hash.slice(1) || 'users';
        this.currentPath = hash;
        
        if (window.app && window.app.onRouteChange) {
            window.app.onRouteChange(hash);
        }
    }
    
    navigateTo(path) {
        window.location.hash = path;
    }
    
    getCurrentPath() {
        return this.currentPath;
    }
}
