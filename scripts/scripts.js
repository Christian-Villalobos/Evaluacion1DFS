const STORAGE_KEY = "poe_users";

// Usuario Admin creado por defecto
let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { 
    name: "Administrador", 
    email: "admin@poe.com", 
    password: "admin123", 
    role: "admin" 
  }
];

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. REGISTRO (register.html) ---
    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;

            const existe = users.some(u => u.email === email);
            if (existe) {
                alert('El correo ya está registrado.');
                return;
            }

            // Los usuarios registrados por formulario serán de rol "user"
            users.push({ 
                name: username, 
                email: email, 
                password: password, 
                role: "user" 
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

            alert('¡Registro exitoso! Redirigiendo a inicio de sesión...');
            window.location.href = 'login.html';
        });
    }

    // --- 2. LOGIN (login.html) ---
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;

            const usuarioValido = users.find(u => u.email === email && u.password === password);

            if (usuarioValido) {
                // Guardar la sesión
                localStorage.setItem("poe_current_user", JSON.stringify(usuarioValido));
                alert('¡Bienvenido ' + usuarioValido.name + '!');

                // Si es ADMIN redirige al panel de administración, si no al perfil normal
                if (usuarioValido.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'profile.html';
                }
            } else {
                alert('Correo o contraseña incorrectos.');
            }
        });
    }

    // --- 3. PERFIL (profile.html) ---
    const userNameElem = document.getElementById('user-name');
    if (userNameElem) {
        const currentUser = JSON.parse(localStorage.getItem("poe_current_user"));

        if (!currentUser) {
            window.location.href = 'login.html';
        } else {
            userNameElem.textContent = currentUser.name;
            document.getElementById('user-email').textContent = currentUser.email;
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem("poe_current_user");
                window.location.href = 'login.html';
            });
        }
    }

    // --- 4. PANEL DE ADMINISTRADOR (admin.html) ---
    const adminContainer = document.getElementById('admin-content');
    if (adminContainer) {
        const currentUser = JSON.parse(localStorage.getItem("poe_current_user"));

        // Seguridad: Si no hay usuario o NO es admin, lo expulsamos al login
        if (!currentUser || currentUser.role !== 'admin') {
            alert('Acceso restringido solo para administradores.');
            window.location.href = 'login.html';
        }

        // Botón de Cerrar Sesión en Admin
        const logoutAdmin = document.getElementById('logout-admin');
        if (logoutAdmin) {
            logoutAdmin.addEventListener('click', () => {
                localStorage.removeItem("poe_current_user");
                window.location.href = 'login.html';
            });
        }
    }
});