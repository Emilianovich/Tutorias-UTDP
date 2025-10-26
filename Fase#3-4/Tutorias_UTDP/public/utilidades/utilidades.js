function cerrarSesion (avatar) {
    avatar.style.cursor = "pointer";
    avatar.addEventListener("click", ()=> {
        sessionStorage.clear();
        window.location.href("http://127.0.0.1:63342/Login/login.html");
    })
}
