document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRegistro');
    if (!form) return;

    const inputUser = document.getElementById('username');
    const inputEmail = document.getElementById('email');
    const inputPass = document.getElementById('password');

    // Expresiones regulares para validar
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexUser = /^[a-zA-Z0-9]{4,15}$/;
    const regexPass = /^(?=.*\d).{6,}$/; // Al menos 6 caracteres y 1 número

    function validarCampo(input, condicionValida, idError) {
        const errorP = document.getElementById(idError);
        if (condicionValida) {
            input.classList.remove('is-danger');
            input.classList.add('is-success');
            errorP.classList.add('is-hidden');
            return true;
        } else {
            input.classList.remove('is-success');
            input.classList.add('is-danger'); // Activa borde rojo de Bulma
            errorP.classList.remove('is-hidden'); // Muestra mensaje
            return false;
        }
    }

    // Validación en tiempo real (evento input)
    inputUser.addEventListener('input', () => {
        validarCampo(inputUser, regexUser.test(inputUser.value.trim()), 'err-username');
    });

    inputEmail.addEventListener('input', () => {
        validarCampo(inputEmail, regexEmail.test(inputEmail.value.trim()), 'err-email');
    });

    inputPass.addEventListener('input', () => {
        validarCampo(inputPass, regexPass.test(inputPass.value), 'err-password');
    });

    // Validación al enviar
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Previene envío si hay errores
        const uValido = validarCampo(inputUser, regexUser.test(inputUser.value.trim()), 'err-username');
        const eValido = validarCampo(inputEmail, regexEmail.test(inputEmail.value.trim()), 'err-email');
        const pValido = validarCampo(inputPass, regexPass.test(inputPass.value), 'err-password');

        if (uValido && eValido && pValido) {
            alert('¡Registro exitoso! Bienvenido al mercado.');
            form.reset();
            inputUser.classList.remove('is-success');
            inputEmail.classList.remove('is-success');
            inputPass.classList.remove('is-success');
        }
    });
});
