// Variables globales
let personajeActual = null;
let transformaciones = [];
let transformacionIndex = 0;

// Función principal para buscar personaje
async function buscarPersonaje() {
    const idInput = document.getElementById('idPersonaje');
    const id = parseInt(idInput.value);
    
    // Validación
    if (isNaN(id) || id < 1 || id > 58) {
        alert('Por favor, ingresa un ID válido entre 1 y 58');
        return;
    }

    try {
        const response = await fetch(`https://dragonball-api.com/api/characters/${id}`);
        
        if (!response.ok) {
            throw new Error('Personaje no encontrado');
        }
        
        personajeActual = await response.json();
        transformaciones = personajeActual.transformations || [];
        transformacionIndex = 0;
        
        // Actualizar la interfaz
        actualizarPersonaje();
        actualizarPlaneta();
        actualizarTransformacion();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar el personaje: ' + error.message);
    }
}

// Actualizar información del personaje
function actualizarPersonaje() {
    if (!personajeActual) return;

    document.getElementById('nombrePersonaje').textContent = personajeActual.name;
    document.getElementById('kiPersonaje').textContent = `KI: ${personajeActual.ki || 'Desconocido'}`;
    document.getElementById('generoPersonaje').textContent = `Género: ${personajeActual.gender || 'Desconocido'}`;
    document.getElementById('razaPersonaje').textContent = `Raza: ${personajeActual.race || 'Desconocido'}`;
    
    // Imagen del personaje
    const imgPersonaje = document.getElementById('imagenPersonaje');
    if (personajeActual.image) {
        imgPersonaje.style.backgroundImage = `url('${personajeActual.image}')`;
    } else {
        imgPersonaje.style.backgroundImage = 'none';
    }
}

// Actualizar información del planeta
function actualizarPlaneta() {
    if (!personajeActual || !personajeActual.originPlanet) {
        document.getElementById('nombrePlaneta').textContent = 'Desconocido';
        document.getElementById('estadoPlaneta').textContent = 'Información no disponible';
        document.getElementById('imagenPlaneta').style.backgroundImage = 'none';
        return;
    }

    const planeta = personajeActual.originPlanet;
    document.getElementById('nombrePlaneta').textContent = planeta.name;
    document.getElementById('estadoPlaneta').textContent = 
        planeta.isDestroyed ? '🗑️ Planeta Destruido' : '🌍 Planeta Intacto';
    
    // Imagen representativa del planeta (usaremos una genérica)
    document.getElementById('imagenPlaneta').style.backgroundImage = 
        'url("https://cdn.pixabay.com/photo/2016/07/30/13/26/planet-1557236_960_720.png")';
}

// Actualizar transformación actual
function actualizarTransformacion() {
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');
    const contador = document.getElementById('contadorTransformacion');
    
    if (transformaciones.length === 0) {
        document.getElementById('nombreTransformacion').textContent = 'Sin transformaciones';
        document.getElementById('kiTransformacion').textContent = 'KI: -';
        document.getElementById('imagenTransformacion').style.backgroundImage = 'none';
        contador.textContent = '0/0';
        btnAnterior.disabled = true;
        btnSiguiente.disabled = true;
        return;
    }

    const transformacion = transformaciones[transformacionIndex];
    document.getElementById('nombreTransformacion').textContent = transformacion.name;
    document.getElementById('kiTransformacion').textContent = `KI: ${transformacion.ki || 'Desconocido'}`;
    
    if (transformacion.image) {
        document.getElementById('imagenTransformacion').style.backgroundImage = `url('${transformacion.image}')`;
    }
    
    // Actualizar contador y botones
    contador.textContent = `${transformacionIndex + 1}/${transformaciones.length}`;
    btnAnterior.disabled = transformacionIndex === 0;
    btnSiguiente.disabled = transformacionIndex === transformaciones.length - 1;
}

// Navegación entre transformaciones
function transformacionSiguiente() {
    if (transformacionIndex < transformaciones.length - 1) {
        transformacionIndex++;
        actualizarTransformacion();
    }
}

function transformacionAnterior() {
    if (transformacionIndex > 0) {
        transformacionIndex--;
        actualizarTransformacion();
    }
}

// Buscar al presionar Enter
document.getElementById('idPersonaje').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarPersonaje();
    }
});

// Cargar un personaje por defecto al iniciar
window.addEventListener('load', function() {
    document.getElementById('idPersonaje').value = '1';
    buscarPersonaje();
});