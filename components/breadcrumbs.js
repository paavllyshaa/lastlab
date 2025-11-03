class Breadcrumbs {
    constructor() {
        this.container = null;
    }
    
    generate(path) {
        const parts = path.split('#');
        let breadcrumbs = '<div class="breadcrumbs">';
        let currentPath = '';
        
        parts.forEach((part, index) => {
            if (index > 0) currentPath += '#';
            currentPath += part;
            
            const isLast = index === parts.length - 1;
            const name = this.getDisplayName(part);
            
            if (isLast) {
                breadcrumbs += `<span class="breadcrumb-current">${name}</span>`;
            } else {
                breadcrumbs += `<a href="#${currentPath}" class="breadcrumb-link">${name}</a> › `;
            }
        });
        
        breadcrumbs += '</div>';
        return breadcrumbs;
    }
    
    getDisplayName(part) {
        const names = {
            'users': '👥 Пользователи',
            'todos': '✅ Задачи',
            'posts': '📝 Посты', 
            'comments': '💬 Комментарии'
        };
        return names[part] || part;
    }
}
