/*Ojo de la contraseña*/
const password_field = document.getElementById("contraseña_perfil");
const password_image = document.getElementById("password_image");

//Making the eye icon change for the user to see the password
password_image.addEventListener("click", ()=>{
    if(password_field.type === "password") {
        password_field.type = "text";
        password_image.src = "../images/passwordeye.png";
        password_image.alt = "Opened eye by th studio";
    }

//Changing the eye icon back and hiding the password
    else {
        password_field.type = "password";
        password_image.src= "../images/close-eye.png";
        password_image.alt = "Closed eye by Rahul Kaklotar";
    }
})

/*Contenedores*/
const contenedor_datos = document.getElementById('datos');
const contenedor_pendientes = document.getElementById('pendientes');
const contenedor_anteriores = document.getElementById('anteriores');

/*Datos personales*/
const usuario = {
    nombre: "Luis",
    apellido: "Rodríguez",
    cedula: "8-1124-649",
    telefono: "6000-0600",
    facultad: "Facultad de Ingeniería  de Sistemas Computacionales",
    correo: "luis.rodriguez@utp.ac.pa",
    contrasena:"segura123"
};

document.getElementById('nombre_perfil').value = usuario.nombre;
document.getElementById('apellido_perfil').value = usuario.apellido;
document.getElementById('cedula_perfil').value = usuario.cedula;
document.getElementById('telefono_perfil').value = usuario.telefono;
document.getElementById('facultad_perfil').value = usuario.facultad;
document.getElementById('correo_perfil').value = usuario.correo;
document.getElementById('contraseña_perfil').value = usuario.contrasena;

/*Sesiones Pendientes*/
const contenedor_divs_pendientes = document.getElementById("contenedor_sesiones_pendientes");
const sesiones_P = [
    {materia:"Ecuaciones Diferenciales Ordinarias", fecha:"10:30am - 11:30am", salon:"3-211", tutor:"Leo Torres"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"}
];


    if (sesiones_P.length > 0) {
        sesiones_P.forEach(pendiente => {
        const div_pendiente = document.createElement("div");
        div_pendiente.classList.add("sesion_pend");

        div_pendiente.innerHTML = `
    <h3>${pendiente.materia}</h3>
    <br>
    <p>Hora: ${pendiente.fecha}</p>
    <p>Salón: ${pendiente.salon}</p>
    <p>Tutor: ${pendiente.tutor}</p>
    <div class="contenedor_desinscribirse">
      <button class="boton_desinscribirse">Desinscribirse</button>
    </div>
    `;
        contenedor_divs_pendientes.appendChild(div_pendiente);
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


/*Sesiones Anteriores*/
const contenedor_divs_anteriores = document.getElementById("contenedor_sesiones_anteriores");
const sesiones_Ant = [
    /*{materia:"Ecuaciones Diferenciales Ordinarias", fecha:"10:30am - 11:30am", salon:"3-211", tutor:"Leo Torres"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"},
    {materia:"Cálculo", fecha:"12:30pm - 1:30pm", salon:"3-219", tutor:"María Paredes"}*/
];


if (sesiones_Ant.length > 0) {
    sesiones_Ant.forEach(anterior => {
        const div_anterior = document.createElement("div");
        div_anterior.classList.add("sesion_ant");

        div_anterior.innerHTML = `
    <h3>${anterior.materia}</h3>
    <br>
    <p>Hora: ${anterior.fecha}</p>
    <p>Salón: ${anterior.salon}</p>
    <p>Tutor: ${anterior.tutor}</p>
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



/*Opciones de perfil*/
const btnDatos = document.getElementById('btndatos');
const btnPendientes = document.getElementById('btnpendientes');
const btnAnteriores = document.getElementById('btnanteriores');


btnDatos.addEventListener('click', () => {
    contenedor_datos.classList.remove('hide');
    btnDatos.classList.add('activa');
    contenedor_pendientes.classList.add('hide');
    btnPendientes.classList.remove('activa');
    contenedor_anteriores.classList.add('hide');
    btnAnteriores.classList.remove('active');
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

const btncambiar_contra = document.getElementById('boton_cambiar_contra');

btncambiar_contra.addEventListener('click',() => {
    window.location.href = '../perfil/cambiar_contraseña.html';
});





