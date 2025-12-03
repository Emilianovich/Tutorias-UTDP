import {crearCirculosAnimacion, agregarContenedorAnimacion, desaparecerContenedorAnimacion} from "/utilidades/utilidades.js"
const contenedorSesiones = document.getElementById("contenedor-sesiones");
const seccionSinSesiones = document.getElementById("sin-sesiones");

if (seccionSinSesiones) {
    seccionSinSesiones.style.display = "none";
}
document.addEventListener("DOMContentLoaded", async () => {
    const contenedorAnimacion = crearCirculosAnimacion();
    agregarContenedorAnimacion(contenedorAnimacion);
    const estudianteUUID = sessionStorage.getItem("estudiante_uuid");

    try {
        const resp = await fetch( `https://tutorias-utdp-production.up.railway.app/api/sesiones-por-evaluar/${estudianteUUID}`);
        // Mostrar mensaje cuando el estudiante no tiene sesiones por evaluar
        if (!resp.ok) {
            const errorData = await resp.json().catch(() => ({}));
            desaparecerContenedorAnimacion(contenedorAnimacion);
            seccionSinSesiones.style.display = "block";
            contenedorSesiones.style.display = "none";
        }
        const data = await resp.json();
        const sesiones = data.sesiones;

        // Ocultar el mensaje de no hay sesiones, si hay
        seccionSinSesiones.style.display = "none";
        contenedorSesiones.style.display = "flex";

        sesiones.forEach((sesion, index) => {
            let tituloTarjeta = document.createElement("h2");
            tituloTarjeta.textContent = "Datos de la Sesión";

            let tarjetaSesion = document.createElement("article");
            tarjetaSesion.classList.add("tarjeta-sesion");
            let nombreTutor = document.createElement("p");
            nombreTutor.classList.add("dato-tutor");
            nombreTutor.textContent = `Tutor: ${sesion.tutor}`;

            let nombreMateria = document.createElement("p");
            nombreMateria.classList.add("dato-materia");
            nombreMateria.textContent = `Materia: ${sesion.materia}`;

            let puntajeTutor = document.createElement("p");
            puntajeTutor.classList.add("dato-puntaje");
            puntajeTutor.textContent = `Puntaje: ${sesion.puntaje}`;

            let fechaSesion = document.createElement("p");
            fechaSesion.classList.add("dato-fecha");
            fechaSesion.textContent = `Fecha: ${sesion.fecha}`;

            const botonEvaluar = document.createElement("button");
            botonEvaluar.textContent = "Evaluar";
            botonEvaluar.classList.add("btn-evaluar");
            botonEvaluar.addEventListener("click", () => {
                        sessionStorage.setItem("sesionAEvaluar", JSON.stringify(sesion));
                        window.location.href = "evaluar_sesion.html";
                    });
            tarjetaSesion.append(tituloTarjeta, nombreTutor, puntajeTutor, fechaSesion, botonEvaluar);
            contenedorSesiones.append(tarjetaSesion);
        });
            desaparecerContenedorAnimacion(contenedorAnimacion);

    } catch (error) {
        console.error(`Error al cargar sesiones por evaluar:, ${error}`);
    }
});
