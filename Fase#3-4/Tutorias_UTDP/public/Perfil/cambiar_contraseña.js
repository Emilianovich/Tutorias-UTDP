/*Ojo de contraseña nueva*/
const nueva_field = document.getElementById("nueva_input");
const nueva_image = document.getElementById("ojo_contranueva");

//Making the eye icon change for the user to see the password
nueva_image.addEventListener("click", ()=>{
    if(nueva_field.type === "password") {
        nueva_field.type = "text";
        nueva_image.src = "../images/passwordeye.png";
        nueva_image.alt = "Opened eye by th studio";
    }

//Changing the eye icon back and hiding the password
    else {
        nueva_field.type = "password";
        nueva_image.src= "../images/close-eye.png";
        nueva_image.alt = "Closed eye by Rahul Kaklotar";
    }
})



/*Ojo de confirmar contraseña*/
const confirm_field = document.getElementById("confirm_input");
const confirm_image = document.getElementById("ojo_contraconfirm");

//Making the eye icon change for the user to see the password
confirm_image.addEventListener("click", ()=>{
    if(confirm_field.type === "password") {
        confirm_field.type = "text";
        confirm_image.src = "../images/passwordeye.png";
        confirm_image.alt = "Opened eye by th studio";
    }

//Changing the eye icon back and hiding the password
    else {
        confirm_field.type = "password";
        confirm_image.src= "../images/close-eye.png";
        confirm_image.alt = "Closed eye by Rahul Kaklotar";
    }
})


async function cambiarContrasena() {
    const nueva = document.getElementById('nueva_input').value;
    const confirm = document.getElementById('confirm_input').value;
    const estudiante_uuid = sessionStorage.getItem('estudiante_uuid');

    const response_Contra = await fetch(`http://127.0.0.1:8000/api/cambiarContrasena/${estudiante_uuid}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            contrasena_nueva: nueva,
            contrasena_nueva_confirmation: confirm
        })
    });

    const data_Contra = await response_Contra.json();

    if (response_Contra.status === 200) {
        const mensaje = data_Contra.mensaje;
        const src = '../images/exito-inscripcion.png';
        const redireccion = `perfil.html?${estudiante_uuid}`;
        mostrarPopUp(mensaje,src, redireccion);
        document.getElementById('form_cambiar_contra').reset();
    } else if(response_Contra.status === 422){
        const mensaje = data_Contra.message;
        const src = '../images/error-inscripcion.png';
        mostrarPopUp(mensaje,src);
    }else
    {
        const mensaje = 'Ocurrió un error inesperado';
        const src = '../images/error-inscripcion.png';
        mostrarPopUp(mensaje,src);
    }
}

const form = document.getElementById('form_cambiar_contra');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    cambiarContrasena();
});
