/*Verificación sesion*/
if (!sessionStorage.getItem("estudiante_uuid")) {
    window.location.replace("https://utdp-tutorias.web.app/");
}

/*Nav dinámico*/
const opcionesNav = document.querySelectorAll("div.opciones-nav");
const opcionSeleccionada = document.getElementById("opcion_nav-seleccionada");
opcionesNav.forEach((opcion) => {
    opcion.addEventListener("mouseover", () => {
        if (opcion.id !== "opcion_nav-seleccionada") {
            opcion.style.cursor = "pointer";
            opcionSeleccionada.classList.remove("nav-selected");
        }
    })
    opcion.addEventListener("mouseout", () => {
        if (opcion.id !== "opcion_nav-seleccionada") {
            opcionSeleccionada.classList.add("nav-selected");
        }
    })
})

/*Creación del menú deslizable*/
const slidingMenu = document.createElement("section");
slidingMenu.classList.add("nav-celular");

const contenedorMenu = document.createElement("article");
contenedorMenu.id = "nav-celular-opciones";

const contenedorBotonCerrar = document.createElement("article");
contenedorBotonCerrar.id = "contenedor-boton-cerrar";

const botonCerrar = document.createElement("img");
botonCerrar.id = "botonCerrar";
botonCerrar.src = "../images/close.png";
contenedorBotonCerrar.appendChild(botonCerrar);

const opcionInicio = document.createElement("p");
const linkInicio = document.createElement("a");
linkInicio.innerText = "Inicio";
linkInicio.href = "../Inicio/inicio.html";
opcionInicio.appendChild(linkInicio);

const opcionMateria = document.createElement("p");
const linkMateria = document.createElement("a");
linkMateria.innerText = "Materia";
linkMateria.href = "../Materias/materias.html";
opcionMateria.appendChild(linkMateria);

const opcionEvaluar = document.createElement("p");
const linkEvaluar = document.createElement("a");
linkEvaluar.innerText = "Evaluar";
linkEvaluar.href = "../Evaluacion/evaluar.html";
opcionEvaluar.appendChild(linkEvaluar);

const opcionNosotros = document.createElement("p");
const linkNosotros = document.createElement("a");
linkNosotros.innerText = "Nosotros";
linkNosotros.href = "../Nosotros/nosotros.html";
opcionNosotros.appendChild(linkNosotros);

contenedorMenu.append(contenedorBotonCerrar, opcionInicio, opcionMateria, opcionEvaluar, opcionNosotros);
slidingMenu.appendChild(contenedorMenu);

/*Agregando hamburger menu al header*/
const screenSize = window.matchMedia("(max-width: 480px)");
const header = document.querySelector("header");
const nav = document.querySelector("nav");
const hamburgerMenu = document.createElement("img");
hamburgerMenu.src = "../images/hamburger_menu.png";
hamburgerMenu.id = "hamburger-menu";
hamburgerMenu.alt = "Hamburger menu by Md Tanvirul Haque";
const iconoPerfil = document.getElementById("picture-icono-perfil");
const contenedorHamburgerPerfil = document.createElement("div");
contenedorHamburgerPerfil.id = "contenedorHamburgerPerfil";

function addHamburgerMenu(event) {
    if (event.matches && document.querySelector("nav")) {
        addHamburgerAccount();
    } else {
        removeHamburgerAccount();
    }
}

function addHamburgerAccount() {
    if (document.body.contains(nav)) {
        nav.remove();
        contenedorHamburgerPerfil.append(hamburgerMenu, iconoPerfil);
        header.appendChild(contenedorHamburgerPerfil);
    }
}

function removeHamburgerAccount() {
    if (!document.body.contains(nav) && nav !== null) {
        document.body.appendChild(nav);
        contenedorHamburgerPerfil.remove();
        slidingMenu.remove();
        header.appendChild(iconoPerfil);
    }
}

screenSize.addEventListener("change", addHamburgerMenu);
addHamburgerMenu(screenSize);

/*Mostrando el hamburger menu al usuario*/
slidingMenu.addEventListener("mouseover", () => {
    slidingMenu.cursor = "default";
})
hamburgerMenu.addEventListener("click", () => {
    document.body.append(slidingMenu);
    slidingMenu.style.display = "block";
    slidingMenu.classList.add("mostrar-hamburger");
});
botonCerrar.addEventListener("click", () => {
    slidingMenu.classList.remove("mostrar-hamburger");
    slidingMenu.classList.add("quitar-hamburger");
})

/*Función para el pop up Inscripción, Evaluar, Registrarse con redirección a Inicio de Sesión*/
function creacionContenedorPopUp () {
    const contenedorPopUp = document.createElement("section");
    contenedorPopUp.id = "contenedor-pop-up";
    return contenedorPopUp;
}

function creacionPopUp () {
    const popUp = document.createElement("article");
    popUp.id = "pop-up";
    popUp.classList.add("pointer-events");
    return popUp;
}

function creacionMensajePopUp (mensaje) {
    const mensajePopUp = document.createElement("h2");
    mensajePopUp.textContent = mensaje;
    return mensajePopUp;
}

function creacionImagenPopUp (src) {
    const imagen = document.createElement("img");
    imagen.src = src;
    return imagen;
}

function creacionBotonPopUp () {
    const botonPopUp = document.createElement("button");
    botonPopUp.id = "cerrar-pop-up";
    botonPopUp.innerText = "Cerrar";
    botonPopUp.cursor = "pointer";
    return botonPopUp;
}

function cerrarPopUp (contenedorPopUp, redireccion) {
        contenedorPopUp.remove();
    if (redireccion !== undefined) {
        window.location.href = redireccion;
    }
}

function agregarPopUpDOM (mensajePopUp, imagen, botonPopUp, popUp, contenedorPopUp) {
    popUp.append(mensajePopUp, imagen, botonPopUp);
    contenedorPopUp.append(popUp);
    document.body.append(contenedorPopUp);
    contenedorPopUp.classList.add("mostrar");
}
export function mostrarPopUp(mensaje, src, redireccion) {
    const contenedorPopUp = creacionContenedorPopUp();
    const popUp = creacionPopUp();
    const mensajePopUp = creacionMensajePopUp(mensaje);
    const imagenPopUp = creacionImagenPopUp(src);
    const botonPopUp = creacionBotonPopUp();
    agregarPopUpDOM(mensajePopUp, imagenPopUp, botonPopUp, popUp, contenedorPopUp);
    botonPopUp.addEventListener("click", () => cerrarPopUp(contenedorPopUp, redireccion));
}
export function cerrarSesion() {
    sessionStorage.clear();
    location.replace("https://utdp-tutorias.web.app/");
}

/*Agregando el vínculo a la página de Perfil*/
const perfilIcono = document.getElementById("icono-perfil");
if (perfilIcono !== null) {
    perfilIcono.addEventListener("click", () => {
        window.location.href = "../Perfil/perfil.html";
    })
}

/*Animación de pantalla de carga*/
const contenedorAnimacion = document.createElement("section");
contenedorAnimacion.id = "contenedor-animacion";
export function crearCirculosAnimacion() {
    for (let i = 0; i < 5; i++) {
        let circulo = document.createElement("div");
        circulo.classList.add("circulos");
        circulo.classList.add(`circulo${i+1}`);
        circulo.classList.add("animacion-carga");
        contenedorAnimacion.append(circulo);
    }
    return contenedorAnimacion;
}
export function agregarContenedorAnimacion(contenedorAnimacion) {
    document.body.append(contenedorAnimacion);
}
export function desaparecerContenedorAnimacion(contenedorAnimacion) {
    contenedorAnimacion.classList.add("fading-animacion");
}

/*Redirección si no hay login*/
if (!sessionStorage.getItem("estudiante_uuid")) {
    crearCirculosAnimacion();
    agregarContenedorAnimacion(contenedorAnimacion);
    setTimeout(()=> {
        desaparecerContenedorAnimacion(contenedorAnimacion);
        location.replace("https://utdp-tutorias.web.app/");
    }, 2001);
}
