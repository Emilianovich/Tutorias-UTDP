sessionStorage.setItem("estudiante_uuid", "abcdef12-3456-7890-abcd-ef1234566678");
const cedula_estudiante = sessionStorage.getItem("estudiante_uuid");


dayjs.locale('es');
const codMateria = new URLSearchParams(window.location.search).get("id");
const main = document.getElementById("main-sesiones-disponibles");
const contenedorMateriaDescripcion = document.createElement("section");
main.appendChild(contenedorMateriaDescripcion);
contenedorMateriaDescripcion.classList.add("contenedor-materia-descripcion")
const nombreMateria  = document.createElement("h2");
nombreMateria.id = "titulo-materia";
const materiaDescripcion = document.createElement("p");
materiaDescripcion.id = "descripcion";
document.addEventListener("DOMContentLoaded", async function () {
    window.dispatchEvent(new Event('resize'));
    const request = await fetch(`http://127.0.0.1:8000/api/materia/${codMateria}/${cedula_estudiante}`);
    const response = await request.json();
    const infoSesiones = response.sesiones;

    /*Cambiando el nombre a la pestaña y añadiendo el nombre de la materia y su descripción al body*/
    document.title = response.nombre;
    nombreMateria.innerText = response.nombre;
    materiaDescripcion.innerText = response.descripcion;
    contenedorMateriaDescripcion.appendChild(nombreMateria);
    contenedorMateriaDescripcion.appendChild(materiaDescripcion);

    /*Agregando al body las sesiones disponibles*/
    const contenedorSesionesDisponibles = document.createElement("section");
    contenedorSesionesDisponibles.id = "seccion-sesiones-disponibles";

    if (infoSesiones.length === 0) {
        main.classList.add("alineacion-no-sesiones");
        contenedorMateriaDescripcion.classList.add("margen-no-sesiones");
        const sesionesNoDisponibles = document.createElement("section");
        sesionesNoDisponibles.id = "sesiones-no-disponibles";
        const mensaje = document.createElement("h1");
        mensaje.innerText = "No hay sesiones disponibles actualmente";
        sesionesNoDisponibles.appendChild(mensaje);
        main.appendChild(sesionesNoDisponibles);
    }

    else {
        main.classList.add("alineacion-hay-sesiones", "main-alineacion-responsive");
        contenedorMateriaDescripcion.classList.add("alineacion-responsive-hay-sesiones");

        infoSesiones.forEach((sesion) => {
            let contenedorSesion = document.createElement("article");
            contenedorSesion.classList.add("sesiones-disponibles");

            let nombreTutor = document.createElement("h3");
            nombreTutor.innerText = sesion.nombre_completo;

            let infoSesion = document.createElement("div");
            infoSesion.classList.add("info-sesion");

            let puntajeTutor = document.createElement("p");
            puntajeTutor.innerText = `Puntaje: ${sesion.puntaje}`;

            let fechaSesion = document.createElement("p");
            fechaSesion.innerText = `Fecha: ${dayjs(sesion.fecha).format("D [de] MMMM [de] YYYY")}`;

            let salonSesion = document.createElement("p");
            salonSesion.innerText = `Salón: ${sesion.salon}`;
            infoSesion.append(puntajeTutor, fechaSesion, salonSesion);

            let contenedorCupoBoton = document.createElement("div");
            contenedorCupoBoton.classList.add("cupos-boton");

            let cuposSesion = document.createElement("p");
            cuposSesion.innerText = `Cupos disponibles: ${sesion.cupos}`;

            let boton = document.createElement("button");
            let linkBoton = document.createElement("a");
            linkBoton.innerText = "Solicitar Tutoría";
            linkBoton.href = `materia_inscripcion.html?id=${codMateria}&sesion=${sesion.cod_sesion}`;
            boton.appendChild(linkBoton);
            contenedorCupoBoton.append(cuposSesion, boton);

            contenedorSesion.append(nombreTutor, infoSesion, contenedorCupoBoton);
            contenedorSesionesDisponibles.appendChild(contenedorSesion);
            main.appendChild(contenedorSesionesDisponibles);
        })
    }

})




