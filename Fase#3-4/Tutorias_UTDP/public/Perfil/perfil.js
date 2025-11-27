/*Ojo de la contraseña*/
if (document.body.id === "pagina-perfil") {

    /*Contenedores*/
    const contenedor_datos = document.getElementById('datos');
    const contenedor_pendientes = document.getElementById('pendientes');
    const contenedor_anteriores = document.getElementById('anteriores');

    sessionStorage.setItem("estudiante_uuid", "e0f1d7f6-65a2-4d5c-b813-94db7df1f389");
    const estudiante_uuid = sessionStorage.getItem("estudiante_uuid");

//Trayendo datos personales
    async function cargarDatosPersonales() {
        try {

            const request = await fetch(`http://127.0.0.1:8000/api/estudiante/${estudiante_uuid}`);
            const response = await request.json();

            const Facultades = {
                'FISC': 'Facultad de Ingeniería en Sistemas Computacionales',
                'FIE': 'Facultad de Ingeniería Eléctrica',
                'FII': 'Facultad de Ingeniería Industrial',
                'FIM': 'Facultad de Ingeniería Mecánica',
                'FIC': 'Facultad de Ingeniería Civil'
            };

            document.getElementById('nombre_perfil').value = response.nombre;
            document.getElementById('apellido_perfil').value = response.apellido;
            document.getElementById('cedula_perfil').value = response.cedula;
            document.getElementById('telefono_perfil').value = response.telefono;
            document.getElementById('facultad_perfil').value = Facultades[response.cod_facultad];
            document.getElementById('correo_perfil').value = response.correo;
            document.getElementById('contraseña_perfil').value = "********";
            console.log(response);
        } catch (error) {
            console.error("Error cargando datos personales:", error);
        }
    }

//Trayendo Sesiones Pendientes
    async function cargarSesionesPendientes () {
        try {
            const requestSesionesPend = await fetch(`http://127.0.0.1:8000/api/sesion/pendiente/${estudiante_uuid}`);
            const responseSesionesPend = await requestSesionesPend.json();

            const contenedor_divs_pendientes = document.getElementById("contenedor_sesiones_pendientes");
            contenedor_divs_pendientes.innerHTML = "";

            if (responseSesionesPend.length > 0) {
                responseSesionesPend.forEach(pendiente => {
                    const div_pendiente = document.createElement("div");
                    div_pendiente.classList.add("sesion_pend");

                    div_pendiente.innerHTML = `
            <h3>${pendiente.nombre}</h3>
            <br>
            <p>Fecha: ${pendiente.horario}</p>
            <p>Salón: ${pendiente.salon}</p>
            <p>Tutor: ${pendiente.nombre_completo}</p>
            <div class="contenedor_desinscribirse">
              <button class="boton_desinscribirse" data-sesion="${pendiente.cod_sesion}">Desinscribirse</button>
            </div>
            `;
                    contenedor_divs_pendientes.appendChild(div_pendiente);
                    const btnDesinscribirse = div_pendiente.querySelector('.boton_desinscribirse')
                    btnDesinscribirse.addEventListener('click',() => {
                        const codsesion = btnDesinscribirse.dataset.sesion;
                        sessionStorage.setItem("cod_sesion", codsesion);
                        mostrarPopUpDosBTNS();
                    });
                });

            } else {
                const div_pendiente_vacio = document.createElement("div");
                div_pendiente_vacio.classList.add("div_vacio");
                div_pendiente_vacio.innerHTML = `<h2>No tiene sesiones pendientes</h2>
    `;
                const contenedor_divs = document.getElementById('contenedor_sesiones_pendientes');
                contenedor_divs.style.height = '25em';
                contenedor_divs.style.alignContent = 'center';
                contenedor_divs_pendientes.appendChild(div_pendiente_vacio);
            }
        } catch (error) {
            console.error("Error cargando sesiones pendientes:", error);
        }
    }

    /*Pop-up con dos botones*/
    function mostrarPopUpDosBTNS() {
        document.getElementById('contenedor-pop-up')?.remove();
        const contenedorConfPopUp = document.createElement("section");
        contenedorConfPopUp.id = "contenedor-pop-up";

        const confPopUp = document.createElement("article");
        confPopUp.id = "pop-up";
        confPopUp.classList.add("pointer-events");

        const mensajePopUp = document.createElement("p");
        mensajePopUp.innerText = "¿Segur@ que desea cancelar su inscripción?";

        const imagen = document.createElement("img");
        imagen.src = "../images/error-inscripcion.png";

        const contenedorbtnPopups = document.createElement("div");
        contenedorbtnPopups.style.display = "flex";
        contenedorbtnPopups.style.width = "100%";
        contenedorbtnPopups.style.gap = "3em";
        contenedorbtnPopups.style.justifyContent = "center";
        contenedorbtnPopups.style.alignItems = "center";
        const botonSiPopUp = document.createElement("button");
        botonSiPopUp.style.width = "fit-content";
        botonSiPopUp.style.padding = "1em";
        botonSiPopUp.id = "confirmar-pop-up";
        botonSiPopUp.innerText = "Sí";
        botonSiPopUp.cursor = "pointer";
        botonSiPopUp.addEventListener("click", async () => {
            const cod_sesion = sessionStorage.getItem("cod_sesion");
            await desinscripcion(estudiante_uuid, cod_sesion);
            contenedorConfPopUp.classList.remove("mostrar");

        });

        const botonNoPopUp = document.createElement("button");
        botonNoPopUp.style.width = "fit-content";
        botonNoPopUp.style.padding = "1em";
        botonNoPopUp.id = "cerrar-pop-up";
        botonNoPopUp.innerText = "No";
        botonNoPopUp.cursor = "pointer";
        botonNoPopUp.addEventListener("click", () => {
            sessionStorage.removeItem("cod_sesion");
            contenedorConfPopUp.classList.remove("mostrar");
        });

        contenedorbtnPopups.append(botonSiPopUp, botonNoPopUp);
        confPopUp.append(mensajePopUp, imagen, contenedorbtnPopups);
        contenedorConfPopUp.append(confPopUp);
        document.body.append(contenedorConfPopUp);
        contenedorConfPopUp.classList.add("mostrar");
    }

    /*Desinscribirse*/
    async function desinscripcion(estudiante_uuid, cod_sesion) {
        try {
            const desinscripcion_request = await fetch(`http://127.0.0.1:8000/api/desinscripcion/${estudiante_uuid}/${cod_sesion}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });
            const desinscripcion_response = await desinscripcion_request.json();
            if (desinscripcion_request.status === 200) {
                const src = "../images/exito-inscripcion.png";
                const mensaje = desinscripcion_response.mensaje;
                mostrarPopUpValid(mensaje, src);
            }
        } catch (error) {
            console.error('Error al hacer la solicitud de delete', error);
        }
    }

    function mostrarPopUpValid(mensaje, src) {
        const contenedorValidPopUp = document.createElement("section");
        contenedorValidPopUp.id = "contenedor-pop-up";

        const ValidpopUp = document.createElement("article");
        ValidpopUp.id = "pop-up";
        ValidpopUp.classList.add("pointer-events");

        const mensajeValidPopUp = document.createElement("h1");
        mensajeValidPopUp.innerText = mensaje;

        const imagen = document.createElement("img");
        imagen.src = src;

        const botonPopUp = document.createElement("button");
        botonPopUp.id = "cerrar-pop-up";
        botonPopUp.innerText = "Cerrar";
        botonPopUp.cursor = "pointer";
        botonPopUp.addEventListener("click", () => {
            contenedorValidPopUp.classList.remove("mostrar");
            location.reload();
        });
        ValidpopUp.append(mensajeValidPopUp, imagen, botonPopUp);
        contenedorValidPopUp.append(ValidpopUp);
        document.body.append(contenedorValidPopUp);
        contenedorValidPopUp.classList.add("mostrar");
    }


    //Trayendo Sesiones Anteriores
    async function cargarSesionesAnteriores () {
        try {
            const requestSesionesAnt = await fetch(`http://127.0.0.1:8000/api/sesion/anterior/${estudiante_uuid}`);
            const responseSesionesAnt = await requestSesionesAnt.json();


            const contenedor_divs_anteriores = document.getElementById("contenedor_sesiones_anteriores");

            if (responseSesionesAnt.length > 0) {
                responseSesionesAnt.forEach(anterior => {
                    const div_anterior = document.createElement("div");
                    div_anterior.classList.add("sesion_ant");

                    div_anterior.innerHTML = `
                    <h3>${anterior.nombre}</h3>
                    <br>
                    <p>Hora: ${anterior.horario}</p>
                    <p>Salón: ${anterior.salon}</p>
                    <p>Tutor: ${anterior.nombre_completo}</p>
                        `;
                    contenedor_divs_anteriores.appendChild(div_anterior);
                });
            } else {
                const div_anterior_vacio = document.createElement("div");
                div_anterior_vacio.classList.add("div_vacio");
                div_anterior_vacio.innerHTML = `<h2>No se ha inscrito a ninguna sesión</h2>
    `;
                const contenedor_divs = document.getElementById('contenedor_sesiones_anteriores');
                contenedor_divs.style.height = '25em';
                contenedor_divs.style.alignContent = 'center';
                contenedor_divs_anteriores.appendChild(div_anterior_vacio);
            }
        } catch (error) {
            console.error("Error cargando sesiones anteriores:", error);
        }
    }

    document.addEventListener("DOMContentLoaded", async() =>{


        /*Opciones de perfil*/
        const btnDatos = document.getElementById('btndatos');
        const btnPendientes = document.getElementById('btnpendientes');
        const btnAnteriores = document.getElementById('btnanteriores');

        await cargarDatosPersonales();
        await cargarSesionesPendientes();
        await cargarSesionesAnteriores();


        btnDatos.addEventListener('click', () => {
            contenedor_datos.classList.remove('hide');
            btnDatos.classList.add('activa');
            contenedor_pendientes.classList.add('hide');
            btnPendientes.classList.remove('activa');
            contenedor_anteriores.classList.add('hide');
            btnAnteriores.classList.remove('activa');
        });

        btnPendientes.addEventListener('click', () => {
            contenedor_datos.classList.add('hide');
            btnDatos.classList.remove('activa');
            contenedor_pendientes.classList.remove('hide');
            btnPendientes.classList.add('activa');
            contenedor_anteriores.classList.add('hide');
            btnAnteriores.classList.remove('activa');
        });

        btnAnteriores.addEventListener('click', () => {
            contenedor_datos.classList.add('hide');
            btnDatos.classList.remove('activa');
            contenedor_pendientes.classList.add('hide');
            btnPendientes.classList.remove('activa');
            contenedor_anteriores.classList.remove('hide');
            btnAnteriores.classList.add('activa');
        });
    });
    const btncambiar_contra = document.getElementById('boton_cambiar_contra');

    btncambiar_contra.addEventListener('click', () => {
        window.location.href = '../perfil/cambiar_contraseña.html';
    });
}

const iconoCerrarSesion = document.getElementById("icono-cerrar_sesion");
iconoCerrarSesion.addEventListener("mouseover", () => {
    iconoCerrarSesion.style.cursor = "pointer";
})
iconoCerrarSesion.addEventListener("click", cerrarSesion);



