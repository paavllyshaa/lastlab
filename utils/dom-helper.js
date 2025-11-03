function createElement(tag, props = {}, ...children) {
    const element = document.createElement(tag);
    
    Object.keys(props).forEach(key => {
        if (key.startsWith('on') && typeof props[key] === 'function') {
            element.addEventListener(key.slice(2).toLowerCase(), props[key]);
        } else if (key === 'className') {
            element.className = props[key];
        } else {
            element.setAttribute(key, props[key]);
        }
    });
    
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });
    
    return element;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
