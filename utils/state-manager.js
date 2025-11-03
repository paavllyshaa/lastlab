class StateManager {
    constructor() {
        this.state = {
            currentView: 'users',
            searchTerm: '',
            loading: false,
            error: null,
            currentPostId: null,
            customUsers: []
        };
        this.listeners = [];
    }
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyListeners();
    }
    
    getState() {
        return { ...this.state };
    }
    
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }
    
    setLoading(loading) {
        this.setState({ loading });
    }
    
    setError(error) {
        this.setState({ error });
    }
    
    clearError() {
        this.setState({ error: null });
    }
    
    setSearchTerm(term) {
        this.setState({ searchTerm: term });
    }
}
