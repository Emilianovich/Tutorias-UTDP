
    const slider = document.getElementById('rango-puntaje');
    const labelValor = document.getElementById('valor-puntaje');
    const btnEnviar = document.getElementById('btn-enviar-evaluacion');
    const spanEstrellas = document.querySelector('.estrella');

    // Función para actualizar número + estrellas
    function actualizarRating() {
        const v = parseInt(slider.value, 10) || 0;

        // número pequeño a la derecha
        labelValor.textContent = v;

        // estrellas arriba de la barra:
        // 0 => vacío, 1..5 => tantas ★ como valor
        if (v <= 0) {
            spanEstrellas.textContent = '-';
        } else {
            const estrellas = '★'.repeat(Math.max(0, Math.min(v, 5)));
            spanEstrellas.textContent = estrellas;
        }
    }

    // Inicial (barra en 0, sin estrellas)
    actualizarRating();

    // Cada vez que muevo la barra
    slider.addEventListener('input', actualizarRating);

    // Mostrar pop-ups según valor
    btnEnviar.addEventListener('click', () => {
        const v = parseInt(slider.value, 10);

        if (isNaN(v) || v < 1 || v > 5) {
            // POPUP 1: puntuación inválida
            popMensaje= 'Por favor, coloque una puntuación entre \n1 y 5';
            popImagen= '../images/error-inscripcion.png'; // popup1
            mostrarPopUpSinRedirect(popMensaje, popImagen)
        } else {
            // Aquí iría el envío real al backend

            // POPUP 2: éxito
            popMensaje= 'Evaluación enviada exitosamente';
            popImagen= '../images/exito-inscripcion.png';  // popup2
            mostrarPopUpConRedirect(popMensaje, popImagen, 'evaluar.html')
        }
    });

    btnCerrar.addEventListener('click', () => {
        contPop.classList.remove('mostrar');
    });
