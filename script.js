console.log('SPA приложение загружено!');

class App {
    constructor() {
        this.init();
    }
    
    init() {
        document.getElementById('app').innerHTML = `
            <h1>Добро пожаловать в SPA Team Lab!</h1>
            <p>Проект начинается здесь...</p>
        `;
    }
}

new App();