import {crearCirculosAnimacion, agregarContenedorAnimacion, desaparecerContenedorAnimacion, mostrarPopUp} from "/utilidades/utilidades.js"
document.addEventListener("DOMContentLoaded", () => {
    // ==== Obtener datos de la sesión seleccionada ====
    const sesionGuardada = sessionStorage.getItem("sesionAEvaluar");
    const estudianteUUID = sessionStorage.getItem("estudiante_uuid");

    if (!sesionGuardada) {
        // Si alguien entra directo a evaluar_sesion.html sin pasar por Evaluar
        if (typeof mostrarPopUp === "function") {
            mostrarPopUp(
                "No se encontró ninguna sesión seleccionada para evaluar.",
                "../images/error-inscripcion.png",
                "evaluar.html"
            );
        } else {
            window.location.href = "evaluar.html";
        }
        return;
    }

    const sesion = JSON.parse(sesionGuardada);

    // ==== Rellenar los datos de la sesión en los <h2> ====
    const hTutor   = document.getElementById("dato-tutor");
    const hMateria = document.getElementById("dato-materia");
    const hFecha   = document.getElementById("dato-fecha");
    const hHorario = document.getElementById("dato-horario");
    const hSalon   = document.getElementById("dato-salon");

    hTutor.textContent   = `Tutor: ${sesion.tutor}`;
    hMateria.textContent = `Materia: ${sesion.materia}`;
    hFecha.textContent   = `Fecha: ${sesion.fecha}`;
    hHorario.textContent = `Horario: ${sesion.hora}`;
    hSalon.textContent   = `Salón: ${sesion.salon}`;

    // ==== Lógica del slider y las estrellas ====
    const slider      = document.getElementById('rango-puntaje');
    const labelValor  = document.getElementById('valor-puntaje');
    const spanEstrellas = document.querySelector('.estrella');
    const btnEnviar   = document.getElementById('btn-enviar-evaluacion');

    function actualizarRating() {
        const v = parseInt(slider.value, 10) || 0;
        labelValor.textContent = v;

        if (v <= 0) {
            spanEstrellas.textContent = '-';
        } else {
            const estrellas = '★'.repeat(Math.max(0, Math.min(v, 5)));
            spanEstrellas.textContent = estrellas;
        }
    }

    // Estado inicial
    actualizarRating();
    slider.addEventListener('input', actualizarRating);

    // ==== Enviar evaluación al backend ====
    btnEnviar.addEventListener('click', async () => {
        const puntuacion = parseInt(slider.value, 10);

        // Validación básica en el frontend (mínima)
        if (isNaN(puntuacion) || puntuacion < 1 || puntuacion > 5) {
            if (typeof mostrarPopUp === "function") {
                mostrarPopUp(
                    "Por favor, seleccione una puntuación entre 1 y 5",
                    "../images/error-inscripcion.png"
                );
            }
            return;
        }

        if (!estudianteUUID) {
            if (typeof mostrarPopUp === "function") {
                mostrarPopUp(
                    "No se encontró la información del estudiante. Inicie sesión nuevamente.",
                    "../images/error-inscripcion.png",
                    "../Login/login.html"
                );
            }
            return;
        }

        try {
            const resp = await fetch("http://127.0.0.1:8000/api/evaluaciones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    estudiante_uuid: estudianteUUID,
                    cod_sesion: sesion.cod_sesion,
                    puntuacion: puntuacion
                }),
            });
                
            // 201 => creada ok
            if (resp.status === 201) {

                const data = await resp.json();
                const mensaje = data.mensaje || "Evaluación enviada exitosamente";
                
                if (typeof mostrarPopUp === "function") {
                    mostrarPopUp(
                        mensaje,
                        "../images/exito-inscripcion.png",
                        "evaluar.html"
                    );
                } else {
                    window.location.href = "evaluar.html";
                }
                return;
            }

            // Para cualquier otro código de estado, intentar obtener el mensaje del backend
            const errorData = await resp.json().catch(() => ({}));
            const mensajeError = errorData.mensaje || errorData.message || `Error al procesar la evaluación (código ${resp.status})`;

            // Determinar la imagen según el código de estado
            const imagenError = resp.status >= 400 && resp.status < 500 
                ? "../images/error-inscripcion.png" 
                : "../images/error-inscripcion.png";

            // Determinar si debe redirigir a evaluar.html
            const debeRedirigir = resp.status === 404 || resp.status === 409;

            if (typeof mostrarPopUp === "function") {
                mostrarPopUp(
                    mensajeError,
                    imagenError,
                    debeRedirigir ? "evaluar.html" : undefined
                );
            } else {
                alert(mensajeError);
                if (debeRedirigir) {
                    window.location.href = "evaluar.html";
                }
            }

        } catch (error) {
            console.error("Error al enviar evaluación:", error);
            
            // Intentar determinar si es un error de red o de otro tipo
            const mensajeError = error.message || "No se pudo conectar con el servidor. Intente nuevamente.";
            
            if (typeof mostrarPopUp === "function") {
                mostrarPopUp(
                    mensajeError,
                    "../images/error-inscripcion.png"
                );
            } else {
                alert(mensajeError);
            }
        }
    });
});
