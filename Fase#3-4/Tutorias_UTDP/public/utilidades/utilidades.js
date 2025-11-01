const opcionesNav = document.querySelectorAll("div.opciones-nav");
const opcionSeleccionada = document.getElementById("opcion_nav-seleccionada");

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

function cerrarSesion (avatar) {
    avatar.style.cursor = "pointer";
    avatar.addEventListener("click", ()=> {
        sessionStorage.clear();
        window.location.href("http://127.0.0.1:63342/Login/login.html");
    })
}
