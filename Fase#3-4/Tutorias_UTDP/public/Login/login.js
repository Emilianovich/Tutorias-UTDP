const API_BASE_URL = 'http://localhost:8000/api';

togglePasswordVisibility("contraseña", "password_image");

const formulario = document.querySelector('form[name="formulario-login"]');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Deshabilitar el formulario mientras se procesa
    deshabilitarFormulario(true);

    // Recolectar datos del formulario
    const datosLogin = {
        correo: document.querySelector('input[name="correo"]').value.trim(),
        contraseña: document.querySelector('input[name="contraseña"]').value
    };

    // Validación básica del lado del cliente
    if (!validarFormulario(datosLogin)) {
        deshabilitarFormulario(false);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(datosLogin)
        });

        const data = await response.json();

        if (response.ok) {
                sessionStorage.setItem('estudiante_uuid', data.uuid);

            window.location.href = '../Inicio/inicio.html';
            }

        else {
            // Error en el login - Mostrar popup solo en errores
            manejarErrores(data);
            deshabilitarFormulario(false);
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarPopUp('error', 'Error de conexión con el servidor. Por favor, intente nuevamente.');
        deshabilitarFormulario(false);
    }
});

// Función para validar el formulario
function validarFormulario(datos) {
    // Verificar que todos los campos estén llenos
    if (!datos.correo || datos.correo === '') {
        mostrarPopUp('error', 'Por favor, ingrese su correo electrónico');
        return false;
    }

    if (!datos.contraseña || datos.contraseña === '') {
        mostrarPopUp('error', 'Por favor, ingrese su contraseña');
        return false;
    }

    return true;
}

// Función para deshabilitar/habilitar el formulario
function deshabilitarFormulario(deshabilitar) {
    const inputs = formulario.querySelectorAll('input, button');
    inputs.forEach(input => {
        input.disabled = deshabilitar;
    });
}

// Función para manejar errores del servidor
function manejarErrores(data) {
    if (data.message) {
        mostrarPopUp('error', data.message);
    } else if (data.errors) {
        // Manejar errores de validación de Laravel
        const primerError = Object.values(data.errors)[0][0];
        mostrarPopUp('error', primerError);
    } else {
        mostrarPopUp('error', 'Ha ocurrido un error. Por favor, intente nuevamente.');
    }
}

// Función para mostrar popup (solo para errores)
function mostrarPopUp(tipo, mensaje) {
    const contenedorPopUp = document.getElementById('contenedor-pop-up');

    if (!contenedorPopUp) {
        crearEstructuraPopUp();
        return mostrarPopUp(tipo, mensaje);
    }

    const popUp = document.getElementById('pop-up');
    const titulo = popUp.querySelector('h1');
    const imagen = popUp.querySelector('img');
    const boton = popUp.querySelector('button');

    titulo.textContent = mensaje;

    // Solo mostrar popup para errores
    imagen.src = '../images/error-inscripcion.png';
    imagen.alt = 'Error';

    contenedorPopUp.classList.add('mostrar');

    boton.onclick = () => {
        contenedorPopUp.classList.remove('mostrar');
    };
}

// Función para crear estructura del popup
function crearEstructuraPopUp() {
    const contenedor = document.createElement('div');
    contenedor.id = 'contenedor-pop-up';

    contenedor.innerHTML = `
        <div id="pop-up">
            <h1>Titulo Pop-Up</h1>
            <img src="" alt="" style="width: 100px; height: 100px; object-fit: contain;">
            <button>Aceptar</button>
        </div>
    `;

    document.body.appendChild(contenedor);
}

// Crear estructura del popup al cargar la página (pero sin mostrarlo)
document.addEventListener('DOMContentLoaded', () => {
    crearEstructuraPopUp();
});
