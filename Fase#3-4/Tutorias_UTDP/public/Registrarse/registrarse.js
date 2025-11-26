const API_BASE_URL = 'http://localhost:8000/api';

togglePasswordVisibility("contraseña", "password_image");

const formulario = document.querySelector('form[name="registro"]');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datosEstudiante = {
        nombre: document.getElementById('nombre').value.trim(),
        apellido: document.getElementById('apellido').value.trim(),
        cedula: document.getElementById('cedula').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        cod_facultad: document.getElementById('facultad').value,
        contraseña: document.getElementById('contraseña').value
    };

    if (!validarFormulario(datosEstudiante)) {
        return;
    }

    try {

        const response = await fetch(`${API_BASE_URL}/registrarse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(datosEstudiante)
        });

        const data = await response.json();

        if (response.ok) {
            mostrarPopUp('success', data.message || '¡Registro exitoso!');

            setTimeout(() => {
                window.location.href = '../Login/login.html';
            }, 2000);
        } else {

            if (data.errors) {
                const primerError = Object.values(data.errors)[0][0];
                mostrarPopUp('error', primerError);
            } else if (data.message) {
                mostrarPopUp('error', data.message);
            }
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarPopUp('error', 'Error de conexión con el servidor. Por favor, intente nuevamente.');
    }
});

function validarFormulario(datos) {
    for (let campo in datos) {
        if (!datos[campo]) {
            mostrarPopUp('error', 'Por favor, llene todos los campos solicitados');
            return false;
        }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.correo)) {
        mostrarPopUp('error', 'Por favor, ingrese un correo válido');
        return false;
    }

    return true;
}

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

    if (tipo === 'success') {
        imagen.src = '../images/exito-inscripcion.png';
        imagen.alt = 'Éxito';
    } else {
        imagen.src = '../images/error-inscripcion.png';
        imagen.alt = 'Error';
    }

    contenedorPopUp.classList.add('mostrar');

    boton.onclick = () => {
        contenedorPopUp.classList.remove('mostrar');
    };
}

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

document.addEventListener('DOMContentLoaded', () => {
    crearEstructuraPopUp();
});
