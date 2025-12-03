togglePasswordVisibility("contraseña", "password_image");

function togglePasswordVisibility(inputId, imageId) {
    const passwordInput = document.getElementById(inputId);
    const toggleImage = document.getElementById(imageId);

    if (!passwordInput || !toggleImage) return;

    toggleImage.style.cursor = 'pointer';

    toggleImage.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleImage.src = '../images/eye_open.png';
        } else {
            passwordInput.type = 'password';
            toggleImage.src = '../images/eye_closed.png';
        }
    });
}

const formulario = document.querySelector('form[name="registro"]');
const botonSubmit = formulario.querySelector('button[type="submit"]');

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

    // Validación básica de campos vacíos en el frontend
    if (!validarCamposVacios(datosEstudiante)) {
        mostrarPopUp(
            'Por favor, llene todos los campos solicitados',
            '../images/error-inscripcion.png'
        );
        return;
    }

    // Deshabilitar formulario
    deshabilitarFormulario();

    try {
        const response = await fetch(`https://tutorias-utdp-production.up.railway.app/api/registrarse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(datosEstudiante)
        });

        const data = await response.json();

        if (response.ok) {
            // Mensaje de éxito desde el backend
            mostrarPopUp(
                data.message,
                '../images/exito-inscripcion.png',
                '/index.html'
            );
        } else {
            // Extraer mensaje de error desde el backend
            let mensajeError = 'Error en el registro';

            if (data.errors) {
                // Si hay errores de validación, tomar el primer error
                mensajeError = Object.values(data.errors)[0][0];
            } else if (data.message) {
                // Si hay un mensaje general de error
                mensajeError = data.message;
            }

            mostrarPopUp(mensajeError, '../images/error-inscripcion.png');
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarPopUp(
            'Error de conexión con el servidor. Por favor, intente nuevamente.',
            '../images/error-inscripcion.png'
        );
        habilitarFormulario();
    }
});

// Función para deshabilitar el formulario
function deshabilitarFormulario() {
    const inputs = formulario.querySelectorAll('input, select, button');
    inputs.forEach(input => {
        input.disabled = true;
    });
    botonSubmit.style.opacity = '0.6';
    botonSubmit.style.cursor = 'not-allowed';
}

// Función para habilitar el formulario
function habilitarFormulario() {
    const inputs = formulario.querySelectorAll('input, select, button');
    inputs.forEach(input => {
        input.disabled = false;
    });
    botonSubmit.style.opacity = '1';
    botonSubmit.style.cursor = 'pointer';
}

// Validación mínima en frontend solo para campos vacíos
function validarCamposVacios(datos) {
    for (let campo in datos) {
        if (!datos[campo]) {
            return false;
        }
    }
    return true;
}

// Funciones del nuevo sistema de Pop-Up
function creacionContenedorPopUp() {
    const contenedorPopUp = document.createElement("section");
    contenedorPopUp.id = "contenedor-pop-up";
    return contenedorPopUp;
}

function creacionPopUp() {
    const popUp = document.createElement("article");
    popUp.id = "pop-up";
    popUp.classList.add("pointer-events");
    return popUp;
}

function creacionMensajePopUp(mensaje) {
    const mensajePopUp = document.createElement("h2");
    mensajePopUp.textContent = mensaje;
    return mensajePopUp;
}

function creacionImagenPopUp(src) {
    const imagen = document.createElement("img");
    imagen.src = src;
    return imagen;
}

function creacionBotonPopUp() {
    const botonPopUp = document.createElement("button");
    botonPopUp.id = "cerrar-pop-up";
    botonPopUp.innerText = "Cerrar";
    botonPopUp.style.cursor = "pointer";
    return botonPopUp;
}

function cerrarPopUp(contenedorPopUp, redireccion) {
    contenedorPopUp.remove();

    // Habilitar el formulario al cerrar el pop-up
    habilitarFormulario();

    if (redireccion !== undefined) {
        window.location.href = redireccion;
    }
}

function agregarPopUpDOM(mensajePopUp, imagen, botonPopUp, popUp, contenedorPopUp) {
    popUp.append(mensajePopUp, imagen, botonPopUp);
    contenedorPopUp.append(popUp);
    document.body.append(contenedorPopUp);
    contenedorPopUp.classList.add("mostrar");
}

function mostrarPopUp(mensaje, src, redireccion) {
    const contenedorPopUp = creacionContenedorPopUp();
    const popUp = creacionPopUp();
    const mensajePopUp = creacionMensajePopUp(mensaje);
    const imagenPopUp = creacionImagenPopUp(src);
    const botonPopUp = creacionBotonPopUp();
    agregarPopUpDOM(mensajePopUp, imagenPopUp, botonPopUp, popUp, contenedorPopUp);
    botonPopUp.addEventListener("click", () => cerrarPopUp(contenedorPopUp, redireccion));
}
