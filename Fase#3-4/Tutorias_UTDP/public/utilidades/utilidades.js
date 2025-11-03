const opcionesNav = document.querySelectorAll("div.opciones-nav");
const opcionSeleccionada = document.getElementById("opcion_nav-seleccionada");
const botonCerrar = document.getElementById("botonCerrar");
const slidingMenu = document.querySelector(".nav-celular");
slidingMenu.style.display = "none";

/*Nav dinámico*/
opcionesNav.forEach((opcion) => {
    opcion.addEventListener("mouseover", ()=> {
        if (opcion.id !== "opcion_nav-seleccionada") {
            opcion.style.cursor = "pointer";
            opcionSeleccionada.classList.remove("nav-selected");
        }
    })
    opcion.addEventListener("mouseout", ()=> {
        if (opcion.id !== "opcion_nav-seleccionada") {
            opcionSeleccionada.classList.add("nav-selected");
        }
    })
})

/*Agregando hamburger menu al header*/
const screenSize = window.matchMedia("(max-width: 480px)");
const header = document.querySelector("header");
const nav = document.querySelector("nav");
const hamburgerMenu = document.createElement("img");
hamburgerMenu.src="../images/hamburger_menu.png";
hamburgerMenu.id = "hamburger-menu";
hamburgerMenu.alt = "Hamburger menu by Md Tanvirul Haque";
const iconoPerfil = document.getElementById("picture-icono-perfil");
const contenedorHamburgerPerfil = document.createElement("div");
contenedorHamburgerPerfil.id = "contenedorHamburgerPerfil";
function addHamburgerMenu (event) {
    if (event.matches) {
        addHamburgerAccount();
    }
    else {
        removeHamburgerAccount();
        slidingMenu.style.display = "none";
    }
}

function addHamburgerAccount () {
    document.body.removeChild(nav);
    contenedorHamburgerPerfil.appendChild(hamburgerMenu);
    contenedorHamburgerPerfil.appendChild(iconoPerfil);
    header.appendChild(contenedorHamburgerPerfil);
}
function removeHamburgerAccount () {
    document.body.appendChild(nav);
    header.removeChild(contenedorHamburgerPerfil);
    header.appendChild(iconoPerfil);
}

screenSize.addEventListener("change", addHamburgerMenu);

function cerrarSesion (avatar) {
    avatar.style.cursor = "pointer";
    avatar.addEventListener("click", ()=> {
        sessionStorage.clear();
        window.location.href("http://127.0.0.1:63342/Login/login.html");
    })
}

/*Mostrando el hamburger menu al usuario*/
slidingMenu.addEventListener("mouseover", ()=> {
    slidingMenu.cursor = "default";
})
hamburgerMenu.addEventListener("click", ()=> {
    slidingMenu.style.display = "block";
    slidingMenu.classList.add("mostrar-hamburger");
});
botonCerrar.addEventListener("click", ()=> {
    slidingMenu.classList.remove("mostrar-hamburger");
    slidingMenu.classList.add("quitar-hamburger");
})

/*Función para el pop up Inscripción, Evaluar, Registrarse con redirección a Inicio de Sesión*/
function mostrarPopUpConRedirect(mensaje, src, redireccion) {
    const contenedorPopUp = document.createElement("section");
    contenedorPopUp.id = "contenedor-pop-up";

    const popUp = document.createElement("article");
    popUp.id = "pop-up";
    popUp.classList.add("pointer-events");

    const mensajePopUp = document.createElement("h1");
    mensajePopUp.innerText = mensaje;

    const imagen = document.createElement("img");
    imagen.src = src;

    const botonPopUp = document.createElement("button");
    botonPopUp.id = "cerrar-pop-up";
    botonPopUp.innerText = "Cerrar";
    botonPopUp.cursor = "pointer";
    botonPopUp.addEventListener("click", () => {
        contenedorPopUp.classList.remove("mostrar");
        window.location.href = redireccion;
    });

    popUp.append(mensajePopUp, imagen, botonPopUp);
    contenedorPopUp.append(popUp);
    document.body.append(contenedorPopUp);
    contenedorPopUp.classList.add("mostrar");
}

function mostrarPopUpSinRedirect(mensaje, src) {
    const contenedorPopUp = document.createElement("section");
    contenedorPopUp.id = "contenedor-pop-up";

    const popUp = document.createElement("article");
    popUp.id = "pop-up";
    popUp.classList.add("pointer-events");

    const mensajePopUp = document.createElement("h1");
    mensajePopUp.innerText = mensaje;

    const imagen = document.createElement("img");
    imagen.src = src;

    const botonPopUp = document.createElement("button");
    botonPopUp.id = "cerrar-pop-up";
    botonPopUp.innerText = "Cerrar";
    botonPopUp.cursor = "pointer";
    botonPopUp.addEventListener("click", () => {
        contenedorPopUp.classList.remove("mostrar");
    });

    popUp.append(mensajePopUp, imagen, botonPopUp);
    contenedorPopUp.append(popUp);
    document.body.append(contenedorPopUp);
    contenedorPopUp.classList.add("mostrar");
}
