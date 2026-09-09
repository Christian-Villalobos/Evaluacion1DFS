const STORAGE_KEY = "poe_users";
const CART_KEY = "poe_cart";

// Cargar usuarios
let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { name: "Administrador", email: "admin@poe.com", password: "admin123", role: "admin" }
];

// Cargar carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem(CART_KEY)) || [];

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

            users.push({ name: username, email: email, password: password, role: "user" });
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
                localStorage.setItem("poe_current_user", JSON.stringify(usuarioValido));
                alert('¡Bienvenido ' + usuarioValido.name + '!');

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

    // --- 4. TIENDA Y CARRITO (tienda.html) ---
    const btnVerCarrito = document.getElementById('btn-ver-carrito');
    if (btnVerCarrito) {
        const modalCarrito = document.getElementById('modal-carrito');
        const btnCerrarModal = document.getElementById('btn-cerrar-modal');
        const btnVaciar = document.getElementById('btn-vaciar');
        const btnComprar = document.getElementById('btn-comprar');
        const listaCarrito = document.getElementById('lista-carrito');
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');

        function actualizarCarritoUI() {
            localStorage.setItem(CART_KEY, JSON.stringify(carrito));

            const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
            cartCount.textContent = totalItems;

            listaCarrito.innerHTML = '';

            if (carrito.length === 0) {
                listaCarrito.innerHTML = '<p class="has-text-centered">El carrito está vacío.</p>';
                cartTotal.textContent = '0.00';
                return;
            }

            let total = 0;

            carrito.forEach((item, index) => {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;

                const divItem = document.createElement('div');
                divItem.classList.add('level', 'mb-2');
                divItem.innerHTML = `
                    <div class="level-left">
                        <div>
                            <strong>${item.nombre}</strong><br>
                            <small>$${item.precio.toFixed(2)} x ${item.cantidad}</small>
                        </div>
                    </div>
                    <div class="level-right">
                        <span class="has-text-weight-bold mr-3">$${subtotal.toFixed(2)}</span>
                        <button class="button is-small is-danger btn-eliminar" data-index="${index}">X</button>
                    </div>
                `;
                listaCarrito.appendChild(divItem);
            });

            cartTotal.textContent = total.toFixed(2);

            document.querySelectorAll('.btn-eliminar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.target.getAttribute('data-index');
                    carrito.splice(idx, 1);
                    actualizarCarritoUI();
                });
            });
        }

        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const nombre = btn.getAttribute('data-nombre');
                const precio = parseFloat(btn.getAttribute('data-precio'));

                const existe = carrito.find(item => item.nombre === nombre);
                if (existe) {
                    existe.cantidad += 1;
                } else {
                    carrito.push({ nombre, precio, cantidad: 1 });
                }

                actualizarCarritoUI();
                alert(`¡${nombre} añadido al carrito!`);
            });
        });

        btnVerCarrito.addEventListener('click', () => {
            modalCarrito.classList.add('is-active');
        });

        btnCerrarModal.addEventListener('click', () => {
            modalCarrito.classList.remove('is-active');
        });

        btnVaciar.addEventListener('click', () => {
            carrito = [];
            actualizarCarritoUI();
        });

        btnComprar.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert('El carrito está vacío.');
                return;
            }
            alert('¡Gracias por tu compra! Tu pedido ha sido procesado.');
            carrito = [];
            actualizarCarritoUI();
            modalCarrito.classList.remove('is-active');
        });

        actualizarCarritoUI();
    }

    // --- 5. PANEL DE ADMINISTRADOR (admin.html) ---
    const tablaUsuarios = document.getElementById('tabla-usuarios');
    if (tablaUsuarios) {
        const currentUser = JSON.parse(localStorage.getItem("poe_current_user"));

        // Protección de la ruta: Solo permite el acceso a usuarios con rol 'admin'
        if (!currentUser || currentUser.role !== 'admin') {
            alert('Acceso restringido solo para administradores.');
            window.location.href = 'login.html';
            return;
        }

        // CAMBIO: Recorrer el arreglo de usuarios y dibujarlos dentro de la tabla
        users.forEach(user => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><strong>${user.name}</strong></td>
                <td>${user.email}</td>
                <td><span class="tag ${user.role === 'admin' ? 'is-danger' : 'is-info'}">${user.role}</span></td>
            `;
            tablaUsuarios.appendChild(fila);
        });

        // Botón para cerrar sesión desde el panel de Admin
        const logoutAdmin = document.getElementById('logout-admin');
        if (logoutAdmin) {
            logoutAdmin.addEventListener('click', () => {
                localStorage.removeItem("poe_current_user");
                window.location.href = 'login.html';
            });
        }
    }
});