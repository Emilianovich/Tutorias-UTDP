sessionStorage.setItem("estudiante_uuid", "abcdef12-3456-7890-abcd-ef1234566678");
const estudianteUUID = sessionStorage.getItem("estudiante_uuid");
const cod_materia = new URLSearchParams(window.location.search).get("id");
const cod_sesion = new URLSearchParams(window.location.search).get("sesion");
let fechaHora = dayjs().format("YYYY-MM-DD HH:mm:ss");
document.addEventListener("DOMContentLoaded", async function () {
    const request = await fetch(`http://127.0.0.1:8000/api/inscripcion/${cod_materia}/${cod_sesion}`);
    const response = await request.json();

    document.title = response.nombre;
    const informacionSesion = Object.values(response.sesion);
    const main = document.getElementById("main-sesion-inscripcion");
    const contenedorMateriaDescripcion = document.createElement("section");
    main.appendChild(contenedorMateriaDescripcion);
    contenedorMateriaDescripcion.classList.add("contenedor-materia-descripcion");
    const nombreMateria  = document.createElement("h2");
    nombreMateria.id = "titulo-materia";
    const materiaDescripcion = document.createElement("p");
    materiaDescripcion.id = "descripcion";

    /*Cambiando el nombre a la pestaña y añadiendo el nombre de la materia y su descripción al body*/
    nombreMateria.innerText = response.nombre;
    materiaDescripcion.innerText = response.descripcion;
    contenedorMateriaDescripcion.appendChild(nombreMateria);
    contenedorMateriaDescripcion.appendChild(materiaDescripcion);

    /*Agregando al body la sesión a inscribir*/
    const contenedorSesiones = document.createElement("article");
    contenedorSesiones.classList.add("sesion-por-inscribir");

    const infoDatosSesion = document.createElement("div");
    infoDatosSesion.classList.add("info-datos-sesion");

    const nombreTutor = document.createElement("p");
    nombreTutor.innerText = `Nombre: ${informacionSesion[0]}`;

    const puntajeTutor = document.createElement("p");
    puntajeTutor.innerText = `Puntaje: ${informacionSesion[1]}`;

    const horaSesion = document.createElement("p");
    horaSesion.innerText = `Hora: ${informacionSesion[2]}`;

    const salonSesion = document.createElement("p");
    salonSesion.innerText = `Salón: ${informacionSesion[3]}`;

    const cuposSesion = document.createElement("p");
    cuposSesion.innerText = `Cupos Disponibles: ${informacionSesion[4]}`;
    infoDatosSesion.append(nombreTutor, puntajeTutor, horaSesion, salonSesion, cuposSesion);

    const pregunta = document.createElement("p");
    pregunta.innerText = "¿Deseas confirmar tu inscripcion?";

    const contenedorBotones = document.createElement("div");
    contenedorBotones.classList.add("botones-enviar");
    const botonConfirmarBoton = document.createElement("button");
    botonConfirmarBoton.innerText = "Confirmar Inscripción";
    botonConfirmarBoton.addEventListener("click", async () => {
        const datosInscripcion = {
            "estudiante_uuid":  estudianteUUID,
            "cod_sesion": cod_sesion,
            "fecha_hora": fechaHora
        }
        const datosInscripcion_json = JSON.stringify(datosInscripcion);
        const solicitud = await inscripcionSesion(datosInscripcion_json);
    })


    const botonRechazarBoton = document.createElement("button");
    botonRechazarBoton.innerText = "Cancelar Inscripcion";
    botonRechazarBoton.addEventListener("click", ()=>{
        window.location.href = `materia_sesiones.html?id=${cod_materia}`;
    })
    contenedorBotones.append(botonConfirmarBoton, botonRechazarBoton);

    contenedorSesiones.append(infoDatosSesion, pregunta, contenedorBotones);
    main.appendChild(contenedorSesiones);
})

async function inscripcionSesion(datosInscripcion) {
    const inscripcion_request = await fetch("http://127.0.0.1:8000/api/inscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json",
                    "Accept": "application/json",},
        body: datosInscripcion,
    });
    const inscripcion_response = await inscripcion_request.json();
    if (inscripcion_request.status === 201) {
        const src = "../images/exito-inscripcion.png";
        const mensaje = inscripcion_response.mensaje;
        mostrarPopUpConRedirect(mensaje,src,`materia_sesiones.html?id=${cod_materia}`);
    }
    else {
        const src = "../images/error-inscripcion.png";
        const mensaje = Object.values(inscripcion_response.errors);
        const mensajeArray = mensaje[0];
        mostrarPopUpConRedirect(mensajeArray,src, `materia_sesiones.html?id=${cod_materia}`);
    }

}
