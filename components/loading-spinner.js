class LoadingSpinner {
    render(message = 'Загрузка...') {
        return `
            <div class="loading-container">
                <div class="spinner"></div>
                <div class="loading-message">${message}</div>
            </div>
        `;
    }
    
    renderInline() {
        return `<div class="spinner small"></div>`;
    }
}
