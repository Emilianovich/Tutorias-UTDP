
const password_field = document.getElementById("password");
const password_image = document.getElementById("password_image");

password_image.addEventListener("click", ()=>{
    if(password_field.type === "password") {
        password_field.type = "text";
        password_image.src = "../images/eye_open.png";
        password_image.alt = "Opened eye";
    }
    else {
        password_field.type = "password";
        password_image.src = "../images/eye_closed.png";
        password_image.alt = "Closed eye";
    }
})
