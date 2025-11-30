import {mostrarPopUp} from "/utilidades/utilidades.js"
document.addEventListener("DOMContentLoaded", () => {
    // ==== Obtener datos de la sesión seleccionada ====
    const sesionGuardada = sessionStorage.getItem("sesionAEvaluar");
    const estudianteUUID = sessionStorage.getItem("estudiante_uuid");

    if (!sesionGuardada) {
        location.href = "/Evaluacion/evaluar.html";
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
        btnEnviar.inert = true;
        const puntuacion = parseInt(slider.value, 10);

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
            const data = await resp.json().catch(() => ({}));
            const mensaje = Object.values(data.errors);
            if (resp.ok) {
                mostrarPopUp(mensaje[0],"/images/exito-inscripcion.png","/Evaluacion/evaluar.html");
            }
            else {
                mostrarPopUp(mensaje[0], "/images/error-inscripcion.png");
                btnEnviar.inert = false;
            }

        } catch (error) {
            console.error("Error al enviar evaluación:", error);
        }
    });
});
