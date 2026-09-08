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

document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('formLogin');

    // Solo se ejecuta si estamos en la página de login
    if (loginForm) {
        const inputEmail = document.getElementById('loginEmail');
        const inputPass = document.getElementById('loginPassword');

        // Expresión regular para validar formato estándar de correo
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Función modular para alternar clases de Bulma y mensajes
        function validarControl(input, esValido, idError) {
            const errorElemento = document.getElementById(idError);
            if (esValido) {
                input.classList.remove('is-danger');
                input.classList.add('is-success');
                errorElemento.classList.add('is-hidden');
                return true;
            } else {
                input.classList.remove('is-success');
                input.classList.add('is-danger');
                errorElemento.classList.remove('is-hidden');
                return false;
            }
        }

        // Validación en tiempo real mientras el usuario escribe
        inputEmail.addEventListener('input', () => {
            const emailValido = regexEmail.test(inputEmail.value.trim());
            validarControl(inputEmail, emailValido, 'err-login-email');
        });

        inputPass.addEventListener('input', () => {
            const passValido = inputPass.value.trim().length >= 6;
            validarControl(inputPass, passValido, 'err-login-password');
        });

        // Validación al presionar el botón de inicio de sesión
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Detiene el envío nativo del navegador

            const emailCorrecto = validarControl(
                inputEmail,
                regexEmail.test(inputEmail.value.trim()),
                'err-login-email'
            );

            const passCorrecto = validarControl(
                inputPass,
                inputPass.value.trim().length >= 6,
                'err-login-password'
            );

            // Si ambos campos cumplen los criterios
            if (emailCorrecto && passCorrecto) {
                alert('¡Inicio de sesión exitoso! Redirigiendo al perfil...');
                loginForm.reset();
                inputEmail.classList.remove('is-success');
                inputPass.classList.remove('is-success');
                
                // Redirección al catálogo principal
                window.location.href = '../pages/profile.html';
            }
        });
    }
});
