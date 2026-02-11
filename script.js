// Navegación entre desafíos
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remover clase activa de todos los enlaces
        document.querySelectorAll('.nav-link').forEach(item => {
            item.classList.remove('active');
        });
        
        // Añadir clase activa al enlace clickeado
        this.classList.add('active');
        
        // Ocultar todas las secciones
        document.querySelectorAll('.challenge-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar la sección correspondiente
        const targetId = this.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
        
        // Actualizar progreso
        updateProgress();
    });
});

// Función para mostrar/ocultar pistas
document.querySelectorAll('.hint-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const hintId = this.getAttribute('data-hint');
        const hint = document.getElementById(hintId);
        hint.style.display = hint.style.display === 'block' ? 'none' : 'block';
    });
});

// Actualizar progreso
function updateProgress() {
    const totalChallenges = document.querySelectorAll('.nav-link').length;
    const completedChallenges = document.querySelectorAll('.nav-link.visited').length;
    const progress = (completedChallenges / totalChallenges) * 100;
    
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${Math.round(progress)}%`;
}

// Marcar desafíos como visitados
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        if (!this.classList.contains('visited')) {
            this.classList.add('visited');
        }
    });
});

// DESAFÍOS EXISTENTES

// Funciones para el desafío de introducción
document.getElementById('introBtn').addEventListener('click', function() {
    const input = document.getElementById('introInput').value;
    document.getElementById('introResult').innerHTML = input;
    document.getElementById('introResult').className = 'result-container success';
});

// Funciones para el desafío de sinks
document.getElementById('sinkBtn').addEventListener('click', function() {
    const userInput = document.getElementById('sinkInput').value;
    document.getElementById('sinkResult').innerHTML = userInput;
    document.getElementById('sinkResult').className = 'result-container success';
});

// Funciones para el desafío de bypass
document.getElementById('bypassBtn').addEventListener('click', function() {
    let input = document.getElementById('bypassInput').value;
    // Filtro básico
    if (input.includes('script') || input.includes('onerror') || input.includes('javascript')) {
        document.getElementById('bypassResult').innerHTML = 'Entrada bloqueada!';
        document.getElementById('bypassResult').className = 'result-container error';
        return;
    }
    document.getElementById('bypassResult').innerHTML = input;
    document.getElementById('bypassResult').className = 'result-container success';
});

// Funciones para el desafío de gadgets
const AppUtils = {
    sanitizeInput: function(input) {
        // Supuesta sanitización
        return input.replace(/<script>/gi, '');
    },
    renderContent: function(elementId, content) {
        const element = document.getElementById(elementId);
        if (element && content) {
            element.innerHTML = this.sanitizeInput(content);
            element.className = 'result-container success';
        }
    }
};

document.getElementById('gadgetBtn').addEventListener('click', function() {
    const input = document.getElementById('gadgetInput').value;
    AppUtils.renderContent('gadgetResult', input);
});

// Funciones para el desafío de XSS
document.getElementById('xssBtn').addEventListener('click', function() {
    const input = document.getElementById('xssInput').value;
    // Simular parámetro de URL
    const url = new URL(window.location);
    url.searchParams.set('message', encodeURIComponent(input));
    window.history.pushState({}, '', url);
    
    // Procesar como si fuera un parámetro real
    processURLParams();
});

function processURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message) {
        document.getElementById('xssResult').innerHTML = decodeURIComponent(message);
        document.getElementById('xssResult').className = 'result-container success';
    }
}

// Funciones para el desafío de clobbering
document.getElementById('clobberBtn').addEventListener('click', function() {
    const input = document.getElementById('clobberInput').value;
    document.getElementById('clobberResult').innerHTML = input;
    document.getElementById('clobberResult').className = 'result-container success';
    
    // Ejecutar la función vulnerable
    checkAdmin();
});

function checkAdmin() {
    if (window.isAdmin) {
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('clobberResult').innerHTML = 'Acceso de administrador concedido!';
    } else {
        document.getElementById('clobberResult').innerHTML = 'Acceso denegado';
    }
}

// NUEVOS DESAFÍOS DE FUENTES COMUNES

// document.URL
document.getElementById('urlBtn').addEventListener('click', function() {
    const userInput = document.getElementById('urlInput').value;
    // Simular una URL con parámetros
    const simulatedUrl = window.location.origin + window.location.pathname + userInput;
    
    // Usar document.URL simulado
    const urlObj = new URL(simulatedUrl);
    const username = urlObj.searchParams.get('user') || 'Invitado';
    document.getElementById('urlResult').innerHTML = 'Bienvenido, ' + username + '!';
    document.getElementById('urlResult').className = 'result-container success';
});

// document.cookie
document.getElementById('cookieBtn').addEventListener('click', function() {
    const cookieValue = document.getElementById('cookieInput').value;
    // Establecer la cookie
    document.cookie = `preferences=${encodeURIComponent(cookieValue)}; path=/`;
    document.getElementById('cookieResult').innerHTML = 'Cookie establecida. Recarga la página o haz clic en "Mostrar Preferencias" para ver el efecto.';
    document.getElementById('cookieResult').className = 'result-container success';
});

// Mostrar preferencias de cookie
function displayPreferences() {
    const cookies = document.cookie.split(';');
    let preferences = 'No hay preferencias guardadas';
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'preferences') {
            preferences = decodeURIComponent(value);
            break;
        }
    }
    document.getElementById('cookieResult').innerHTML = 'Tus preferencias: ' + preferences;
    document.getElementById('cookieResult').className = 'result-container success';
}

// Ejecutar al cargar para mostrar preferencias si existen
window.addEventListener('load', function() {
    if (document.getElementById('cookie-source').classList.contains('active')) {
        displayPreferences();
    }
});

// document.referrer
document.getElementById('referrerBtn').addEventListener('click', function() {
    // En un escenario real, esto se probaría navegando desde otra página
    // Aquí simulamos un referrer
    const simulatedReferrer = document.getElementById('referrerCode').value;
    if (simulatedReferrer) {
        document.getElementById('referrerResult').innerHTML = 'Viniste desde: ' + simulatedReferrer;
        document.getElementById('referrerResult').className = 'result-container success';
    } else {
        document.getElementById('referrerResult').innerHTML = 'No se proporcionó un referrer simulado';
        document.getElementById('referrerResult').className = 'result-container error';
    }
});

// window.name
document.getElementById('nameBtn').addEventListener('click', function() {
    const state = document.getElementById('nameInput').value;
    window.name = state;
    document.getElementById('nameResult').innerHTML = 'Estado guardado en window.name: ' + state;
    document.getElementById('nameResult').className = 'result-container success';
});

document.getElementById('nameRestoreBtn').addEventListener('click', function() {
    if (window.name) {
        document.getElementById('nameResult').innerHTML = 'Estado anterior: ' + window.name;
        document.getElementById('nameResult').className = 'result-container success';
    } else {
        document.getElementById('nameResult').innerHTML = 'No hay estado guardado en window.name';
        document.getElementById('nameResult').className = 'result-container error';
    }
});

// Web Storage
document.getElementById('storageBtn').addEventListener('click', function() {
    const theme = document.getElementById('storageInput').value;
    localStorage.setItem('userTheme', theme);
    document.getElementById('storageResult').innerHTML = 'Tema guardado en localStorage: ' + theme;
    document.getElementById('storageResult').className = 'result-container success';
});

document.getElementById('storageLoadBtn').addEventListener('click', function() {
    const theme = localStorage.getItem('userTheme') || 'predeterminado';
    document.getElementById('storageResult').innerHTML = 'Tema actual: ' + theme;
    document.getElementById('storageResult').className = 'result-container success';
});

// History API
document.getElementById('historyBtn').addEventListener('click', function() {
    const stateData = document.getElementById('historyInput').value;
    history.replaceState({data: stateData}, '', window.location);
    document.getElementById('historyResult').innerHTML = 'Estado establecido en history: ' + stateData;
    document.getElementById('historyResult').className = 'result-container success';
});

document.getElementById('historyDisplayBtn').addEventListener('click', function() {
    if (history.state) {
        document.getElementById('historyResult').innerHTML = 'Estado: ' + JSON.stringify(history.state);
        document.getElementById('historyResult').className = 'result-container success';
    } else {
        document.getElementById('historyResult').innerHTML = 'No hay estado en el historial';
        document.getElementById('historyResult').className = 'result-container error';
    }
});

// Ejecutar al cargar para el desafío XSS
window.addEventListener('load', function() {
    processURLParams();
    updateProgress();
    
    // Cargar estado inicial para algunos desafíos
    if (document.getElementById('url-source').classList.contains('active')) {
        document.getElementById('urlResult').innerHTML = 'Bienvenido, Invitado!';
        document.getElementById('urlResult').className = 'result-container success';
    }
    
    if (document.getElementById('name-source').classList.contains('active')) {
        if (window.name) {
            document.getElementById('nameResult').innerHTML = 'Estado anterior: ' + window.name;
            document.getElementById('nameResult').className = 'result-container success';
        }
    }
    
    if (document.getElementById('storage-source').classList.contains('active')) {
        const theme = localStorage.getItem('userTheme');
        if (theme) {
            document.getElementById('storageResult').innerHTML = 'Tema actual: ' + theme;
            document.getElementById('storageResult').className = 'result-container success';
        }
    }
    
    if (document.getElementById('history-source').classList.contains('active')) {
        if (history.state) {
            document.getElementById('historyResult').innerHTML = 'Estado: ' + JSON.stringify(history.state);
            document.getElementById('historyResult').className = 'result-container success';
        }
    }
});