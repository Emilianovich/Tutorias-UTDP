import {crearCirculosAnimacion, agregarContenedorAnimacion, desaparecerContenedorAnimacion} from "/utilidades/utilidades.js"

const contenedorSesiones = document.getElementById("contenedor-sesiones");
const seccionSinSesiones = document.getElementById("sin-sesiones");
// Tarjeta plantilla que dejaste en el HTML (oculta con display:none)
const tarjetaPlantilla   = document.getElementById("tarjeta-plantilla");
const clon = tarjetaPlantilla.cloneNode(true);
// Ocultamos "no hay sesiones" por defecto (por si acaso)
if (seccionSinSesiones) {
    seccionSinSesiones.style.display = "none";
}
document.addEventListener("DOMContentLoaded", async () => {
    const contenedorAnimacion = crearCirculosAnimacion();
    agregarContenedorAnimacion(contenedorAnimacion);
    const estudianteUUID = sessionStorage.getItem("estudiante_uuid");

    try {
        const resp = await fetch( `http://127.0.0.1:8000/api/sesiones-por-evaluar/${estudianteUUID}`);
        // Mostrar mensaje cuando el estudiante no tiene sesiones por evaluar
        if (!resp.ok) {
            const errorData = await resp.json().catch(() => ({}));
            desaparecerContenedorAnimacion(contenedorAnimacion);
            seccionSinSesiones.style.display = "block";
            contenedorSesiones.style.display = "none";
        }
        const data = await resp.json();
        const sesiones = data.sesiones;
        // Sí hay sesiones
        seccionSinSesiones.style.display = "none";
        contenedorSesiones.style.display = "flex";
        contenedorSesiones.querySelectorAll(".tarjeta-sesion:not(.plantilla)")
                          .forEach((el) => el.remove());

        sesiones.forEach((sesion) => {
            clon.classList.remove("plantilla");
            clon.removeAttribute("id");
            //Modificando el texto de las tarjetas con la info del backend
            const pTutor =
                clon.querySelector(".dato-tutor")
                    .textContent = `Tutor: ${sesion.tutor}`;
            const pMateria =
                clon.querySelector(".dato-materia")
                    .textContent = `Materia: ${sesion.materia}`;
            const pPuntaje =
                clon.querySelector(".dato-puntaje")
                    .textContent = `Puntaje: ${sesion.puntaje}`;
            const pFecha =
                clon.querySelector(".dato-fecha")
                    .textContent = `Fecha: ${sesion.fecha}`;
            const boton =
                clon.querySelector(".btn-evaluar")
                    .addEventListener("click", () => {
                        sessionStorage.setItem("sesionAEvaluar", JSON.stringify(sesion));
                        window.location.href = "evaluar_sesion.html";
                    });
        });
            // Se agrega la tarjeta perteneciente a una sesión al DOM
            contenedorSesiones.appendChild(clon);
            desaparecerContenedorAnimacion(contenedorAnimacion);

    } catch (error) {
        console.error(`Error al cargar sesiones por evaluar:, ${error}`);
    }
});
