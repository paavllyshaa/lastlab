class UserStorage {
    constructor() {
        this.key = 'customUsers';
        this.nextId = this.getNextId();
    }
    
    getNextId() {
        const users = this.getUsers();
        if (users.length === 0) return 1000;
        return Math.max(...users.map(user => user.id)) + 1;
    }
    
    getUsers() {
        try {
            const users = localStorage.getItem(this.key);
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    }
    
    saveUsers(users) {
        try {
            localStorage.setItem(this.key, JSON.stringify(users));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            alert('Ошибка сохранения пользователя. Проверьте доступное место в хранилище.');
        }
    }
    
    addUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: this.nextId++,
            ...userData,
            address: {
                city: userData.city || 'Не указан',
                street: userData.street || 'Не указана',
                suite: '',
                zipcode: '',
                geo: { lat: '', lng: '' }
            },
            company: {
                name: userData.company || 'Не указана',
                catchPhrase: '',
                bs: ''
            },
            phone: userData.phone || 'Не указан',
            website: userData.website || 'Не указан'
        };
        
        users.push(newUser);
        this.saveUsers(users);
        return newUser;
    }
    
    deleteUser(userId) {
        const users = this.getUsers().filter(user => user.id !== userId);
        this.saveUsers(users);
        return true;
    }
    getAllUsers(apiUsers) {
        const customUsers = this.getUsers();
        return [...customUsers, ...apiUsers];
    }
    
    isCustomUser(userId) {
        return userId >= 1000;
    }
    
    getUserById(userId) {
        const allUsers = this.getAllUsers([]);
        return allUsers.find(user => user.id === userId);
    }
}
