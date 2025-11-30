import {crearCirculosAnimacion, agregarContenedorAnimacion, desaparecerContenedorAnimacion, mostrarPopUp} from "/utilidades/utilidades.js"

const contenedorSesiones = document.getElementById("contenedor-sesiones");
const seccionSinSesiones = document.getElementById("sin-sesiones");
// Tarjeta plantilla que dejaste en el HTML (oculta con display:none)
const tarjetaPlantilla   = document.getElementById("tarjeta-plantilla");

// Ocultamos "no hay sesiones" por defecto (por si acaso)
if (seccionSinSesiones) {
    seccionSinSesiones.style.display = "none";
}

document.addEventListener("DOMContentLoaded", async () => {
    const contenedorAnimacion = crearCirculosAnimacion();
    agregarContenedorAnimacion(contenedorAnimacion);

    const estudianteUUID = sessionStorage.getItem("estudiante_uuid");
    console.log(estudianteUUID)
    
    if (!estudianteUUID) {
        desaparecerContenedorAnimacion(contenedorAnimacion);
        if (contenedorSesiones) contenedorSesiones.style.display = "none";
        if (seccionSinSesiones) seccionSinSesiones.style.display = "block";
        return;
    }

    try {
        const resp = await fetch(
            `http://127.0.0.1:8000/api/sesiones-por-evaluar/${estudianteUUID}`
        );

        // Si el backend devuelve 404 => no hay sesiones por evaluar
        if (!resp.ok) {
            desaparecerContenedorAnimacion(contenedorAnimacion);
            // Intentar obtener el mensaje de error del backend
            const errorData = await resp.json().catch(() => ({}));
            const mensajeError = errorData.message || errorData.mensaje || `Error HTTP ${resp.status}`;
            throw new Error(mensajeError);
        }

        const data = await resp.json();
        const sesiones = data.sesiones || [];
        
        // Sí hay sesiones
        if (seccionSinSesiones) seccionSinSesiones.style.display = "none";
        if (contenedorSesiones) contenedorSesiones.style.display = "flex";

        // 🔹 Limpiar tarjetas generadas anteriormente, pero conservar la plantilla
        contenedorSesiones
            .querySelectorAll(".tarjeta-sesion:not(.plantilla)")
            .forEach((el) => el.remove());

        sesiones.forEach((sesion) => {
            if (!tarjetaPlantilla) return;

            // 1. Clonamos la tarjeta que ya tiene todo el diseño
            const clon = tarjetaPlantilla.cloneNode(true);
            clon.classList.remove("plantilla");
            clon.removeAttribute("id");

            // 2. Buscamos los elementos dentro de la tarjeta
            //    Usamos clases si existen; si no, caemos a los <p> en orden.
            const pTutor =
                clon.querySelector(".dato-tutor") ||
                clon.querySelector("p:nth-of-type(1)");
            const pMateria =
                clon.querySelector(".dato-materia") ||
                clon.querySelector("p:nth-of-type(2)");
            const pPuntaje =
                clon.querySelector(".dato-puntaje") ||
                clon.querySelector("p:nth-of-type(3)");
            const pFecha =
                clon.querySelector(".dato-fecha") ||
                clon.querySelector("p:nth-of-type(4)");

            if (pTutor)   pTutor.textContent   = `Tutor: ${sesion.tutor}`;
            if (pMateria) pMateria.textContent = `Materia: ${sesion.materia}`;
            if (pPuntaje) pPuntaje.textContent = `Puntaje: ${sesion.puntaje ?? "Sin puntaje"}`;
            if (pFecha)   pFecha.textContent   = `Fecha: ${sesion.fecha}`;

            const boton =
                clon.querySelector(".btn-evaluar") ||
                clon.querySelector("button");

            if (boton) {
                boton.addEventListener("click", () => {
                    // Guardamos la sesión elegida para usarla en evaluar_sesion.html
                    sessionStorage.setItem("sesionAEvaluar", JSON.stringify(sesion));
                    window.location.href = "evaluar_sesion.html";
                });
            }

            // 3. Agregamos la tarjeta clonada al contenedor
            contenedorSesiones.appendChild(clon);
        });

        // Desaparecer la animación después de cargar todas las sesiones
        desaparecerContenedorAnimacion(contenedorAnimacion);

    } catch (error) {
        desaparecerContenedorAnimacion(contenedorAnimacion);
        console.error("Error al cargar sesiones por evaluar:", error);
        if (contenedorSesiones) contenedorSesiones.style.display = "none";
        if (seccionSinSesiones) seccionSinSesiones.style.display = "block";

        // Mostrar el mensaje de error del backend (ya viene en error.message)
        if (typeof mostrarPopUp === "function") {
            mostrarPopUp(
                error.message,
                "../images/error-inscripcion.png"
            );
        }
    }
});