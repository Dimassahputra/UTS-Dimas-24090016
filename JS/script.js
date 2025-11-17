// script.js (FILE TERINTEGRASI UNTUK LOGIN, DASHBOARD, DAN PRODUK)

// Data Login Anda (digunakan di index.html)
const VALID_EMAIL = "dimassahputra268@gmail.com";
const VALID_NIM = "24090016";

// Data Dummy Dashboard (digunakan di dashboard.html)
const summary = {
    totalProducts: 120,
    totalSales: 40,
    totalRevenue: 14000000
};

// Data Dummy Produk (digunakan di products.html)
const products = [
    { id: 1, name: "Kopi Gayo", price: 25000, stock: 50 },
    { id: 2, name: "Teh Hitam", price: 18000, stock: 30 },
    { id: 3, name: "Coklat Aceh ", price: 30000, stock: 20 }
];


document.addEventListener('DOMContentLoaded', function () {

    // HALAMAN LOGIN (index.html)
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const togglePassword = document.getElementById('togglePassword');
        const googleLoginBtn = document.getElementById('googleLogin');
        const facebookLoginBtn = document.getElementById('facebookLogin');

        // Mengisi Otomatis
        emailInput.value = VALID_EMAIL;
        passwordInput.value = VALID_NIM;

        // Toggle Password
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });

        // Social Login Redirect
        googleLoginBtn.addEventListener('click', function () {
            window.location.href = "https://www.google.com";
        });

        facebookLoginBtn.addEventListener('click', function () {
            window.location.href = "https://www.facebook.com";
        });

        // Submit Login Form
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');

            emailError.textContent = "";
            passwordError.textContent = "";
            let isValid = true;

            if (email === "") { emailError.textContent = "Email tidak boleh kosong."; isValid = false; }
            if (password === "") { passwordError.textContent = "Password (NIM) tidak boleh kosong."; isValid = false; }

            if (isValid) {
                if (email === VALID_EMAIL && password === VALID_NIM) {
                    alert("Login berhasil! Anda akan diarahkan ke Dashboard.");
                    window.location.href = "dashboard.html";
                } else {
                    alert("Login gagal! Email atau Password (NIM) salah.");
                    emailError.textContent = "Email atau NIM salah.";
                    passwordError.textContent = "Email atau NIM salah.";
                }
            }
        });
    }

    // HALAMAN DASHBOARD (dashboard.html)
    const summaryCardsContainer = document.getElementById('summaryCards');

    if (summaryCardsContainer) {
        const viewProductsBtn = document.getElementById('viewProductsBtn');

        const summaryItems = [
            { title: "Total Products", value: summary.totalProducts, icon: "fas fa-shopping-bag", format: val => val.toLocaleString('id-ID') },
            { title: "Total Sales", value: summary.totalSales, icon: "fas fa-shopping-bag", format: val => val.toLocaleString('id-ID') },
            { title: "Total Revenue", value: summary.totalRevenue, icon: "fas fa-dollar-sign", format: val => "Rp " + val.toLocaleString('id-ID') }
        ];

        function renderSummaryCards() {
            summaryCardsContainer.innerHTML = summaryItems.map(item => `
                <div class="card">
                    <div class="card-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="card-title">${item.title}</div>
                    <div class="card-value">${item.format(item.value)}</div>
                </div>
            `).join('');
        }

        renderSummaryCards();

        viewProductsBtn.addEventListener('click', function () {
            window.location.href = "products.html";
        });
    }
    // ... (Bagian atas kode tetap sama: Data, If loginForm, If summaryCardsContainer) ...

    // LOGIKA HALAMAN PRODUK (products.html)

    const tableBody = document.getElementById('productTableBody');

    if (tableBody) {
        const formatRupiah = (number) => {
            return "Rp " + number.toLocaleString('id-ID');
        };

        function renderProductTable() {
            // 1. Render seluruh tabel dari array products
            tableBody.innerHTML = products.map((product, index) => `
                <tr data-id="${product.id}" id="row-${product.id}">
                    <td>${index + 1}</td> 
                    <td class="product-name-cell" id="name-${product.id}">${product.name}</td>
                    <td class="product-price-cell" id="price-${product.id}">${formatRupiah(product.price)}</td>
                    <td class="product-stock-cell" id="stock-${product.id}">${product.stock}</td>
                    <td class="action-cell">
                        <i class="fas fa-pencil-alt edit-btn" 
                           data-id="${product.id}"></i>
                        
                        <i class="fas fa-trash-alt delete-btn" 
                           data-product-name="${product.name}"
                           data-id="${product.id}"></i>
                    </td>
                </tr>
            `).join('');

            // 2. Panggil fungsi untuk memasang listener baru pada tombol yang baru dirender
            attachEventListeners();
        }

        function attachEventListeners() {
            // --- Fungsionalitas Edit Sederhana (Hanya Notifikasi) ---
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const productId = this.getAttribute('data-id');
                    const product = products.find(p => p.id == productId);

                    if (product) {
                        // Notifikasi yang disederhanakan
                        alert(`Produk "${product.name}" telah diedit.`);
                    }
                });
            });

            // --- Fungsionalitas Delete ---
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const productId = parseInt(this.getAttribute('data-id'));
                    const productName = this.getAttribute('data-product-name');

                    if (confirm(`Yakin hapus produk ${productName}?`)) {

                        const productIndex = products.findIndex(p => p.id === productId);

                        if (productIndex !== -1) {
                            // Hapus dari array
                            products.splice(productIndex, 1);

                            // Render ulang tabel, yang akan membuat tombol baru 
                            // dan memasang listener baru (aman karena tombol lama hilang)
                            renderProductTable();
                        }
                    }
                });
            });
        }

        // Panggil pertama kali saat halaman dimuat
        renderProductTable();
    }
});