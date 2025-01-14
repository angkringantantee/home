const sheetNameMenu = "Menu";  // Nama sheet menu
const sheetNameTransaksi = "Transaksi";  // Nama sheet transaksi
const url = `https://script.google.com/macros/s/AKfycbygmWi9PL216Cw7xWgKS3alVxQhH6Ze8C8DB3YsHojrt0UCPJuFTYHicHCxgWWUkMna/exec`;
const urlMenu = `${url}?sheetName=${sheetNameMenu}`;
const urlTransaksi = `${url}?sheetName=${sheetNameTransaksi}`;

let menuData = []; // Variabel global untuk menyimpan data menu
let transaksiData = []; // Variabel global untuk menyimpan data transaksi

async function fetchData() {
    try {
        // Ambil data menu dan transaksi
        const [menuResponse, transaksiResponse] = await Promise.all([
            fetch(urlMenu),
            fetch(urlTransaksi)
        ]);

        menuData = await menuResponse.json();
        transaksiData = await transaksiResponse.json();

        renderMenu(menuData); 

        // Fungsi untuk filter dan cari menu
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', filterMenu);

        function filterMenu() {
            const query = document.getElementById('search-input').value.toLowerCase();
            const selectedKategori = document.getElementById('kategori').value;
        
            const filteredData = menuData.filter(item => {
                const menuName = item["Nama Menu"].toLowerCase();
                const kategori = item["Kategori"];
        
                // Pencarian nama menu dan kategori
                const matchesSearch = menuName.includes(query);
                const matchesKategori = selectedKategori === "Semua" || kategori === selectedKategori;
        
                return matchesSearch && matchesKategori;
            });
        
            // Tampilkan menu yang sudah difilter
            renderMenu(filteredData);
        }

        // Sort berdasarkan nama menu
        document.querySelector('.sort-name-btn').addEventListener('click', function (event) {
            event.preventDefault();
        
            const sortOrder = this.getAttribute('data-order');
        
            let sortedData;
            if (sortOrder === 'asc') {
                sortedData = [...menuData].sort((a, b) => a["Nama Menu"].localeCompare(b["Nama Menu"]));
                this.setAttribute('data-order', 'desc'); 
                this.querySelector('i').className = 'bi bi-sort-alpha-down-alt';
            } else {
                sortedData = [...menuData].sort((a, b) => b["Nama Menu"].localeCompare(a["Nama Menu"]));
                this.setAttribute('data-order', 'asc'); 
                this.querySelector('i').className = 'bi bi-sort-alpha-down'; 
            }
        
            renderMenu(sortedData);
        });

        // Sort berdasarkan harga
        document.querySelector('.sort-price-btn').addEventListener('click', function (event) {
            event.preventDefault();
            const sortedByPrice = [...menuData].sort((a, b) => a["Harga"] - b["Harga"]);
            renderMenu(sortedByPrice);
        });

        // Sort berdasarkan jumlah pesanan
        document.querySelector('.sort-order-btn').addEventListener('click', function (event) {
            event.preventDefault();

            // Hitung jumlah pesanan per menu
            const menuOrderCount = {};

            transaksiData.forEach(item => {
                const menu = item["Menu"];
                const jumlahPesanan = item["JumlahPesanan"];
                if (menuOrderCount[menu]) {
                    menuOrderCount[menu] += jumlahPesanan;
                } else {
                    menuOrderCount[menu] = jumlahPesanan;
                }
            });

            // Tambahkan jumlah pesanan ke data menu
            const sortedData = [...menuData].map(item => {
                item["JumlahPesanan"] = menuOrderCount[item["Nama Menu"]] || 0;
                return item;
            }).sort((a, b) => b["JumlahPesanan"] - a["JumlahPesanan"]); // Urutkan berdasarkan jumlah pesanan tertinggi

            renderMenu(sortedData);
        });

        // Clear Filter
        document.querySelector('.clear-btn').addEventListener('click', function (event) {
            event.preventDefault();
            renderMenu(menuData); 
        });

        // Filter berdasarkan kategori
        document.getElementById('kategori').addEventListener('change', function () {
            const selectedCategory = this.value;
            if (selectedCategory === "Semua") {
                renderMenu(menuData); 
            } else {
                const filteredData = menuData.filter(item => item["Kategori"] === selectedCategory);
                renderMenu(filteredData); 
            }
        });

    } catch (error) {
        console.error("Gagal memuat data:", error);
    }
}

function renderMenu(data) {
    const menuContainer = document.getElementById('menu-item');
    menuContainer.innerHTML = ''; // Hapus konten sebelumnya

    data.forEach(item => {
        const menu = item["Nama Menu"];
        const deskripsi = item["Deskripsi"];
        const harga = item["Harga"];
        const kategori = item["Kategori"];
        const id = item["photoid"];

        if (menu && deskripsi && harga && kategori) {
            const gambar = "https://drive.google.com/thumbnail?id=" + id;

            const cardHTML = `
                <div class="col mb-5">
                    <div class="card">
                        <img src="${gambar}" class="card-img-top object-fit-fill border rounded mx-2 mt-2 mb-3" alt="${menu}" style="width:150px; height:150px;">
                        <div class="card-body">
                            <h5 class="card-title text-capitalize">${menu}</h5>
                            <div class="card-text mb-3">
                                <p>${deskripsi}</p>
                            </div>
                            <div class="card-footer d-md-flex"> 
                                <a class="text-danger fw-bold text-start text-decoration-none">Rp. ${harga}</a>
                                <button class="btn btn-sm btn-primary pesan-btn ms-3" data-menu="${menu}" data-harga="${harga}">
                                    Pesan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            menuContainer.insertAdjacentHTML('beforeend', cardHTML);
        }
    });

    // Tambahkan event listener ke tombol "Pesan"
    document.querySelectorAll('.pesan-btn').forEach(button => {
        button.addEventListener('click', function () {
            const menu = this.dataset.menu;
            const harga = parseInt(this.dataset.harga);
            const orderTable = document.querySelector('.order-table tbody');
    
            // Cari apakah menu sudah ada di tabel
            const existingRow = [...orderTable.children].find(row => 
                row.querySelector('.menu-name')?.textContent === menu
            );
    
            if (existingRow) {
                // Update Qty dan Total Harga
                const qtyCell = existingRow.querySelector('.menu-qty');
                const totalCell = existingRow.querySelector('.menu-total');
                
                let qty = parseInt(qtyCell.textContent);
                qty++; // Tambah qty
                const total = qty * harga;
    
                // Perbarui tampilan Qty dan Total
                qtyCell.textContent = qty;
                totalCell.textContent = `${total}`;
            } else {
                // Jika menu belum ada, tambahkan ke tabel
                const rowHTML = `
                    <tr class="order-item data border-none" >
                        <td class="fs-6 menu-action"><button style="border:none" class="btn btn-outline-secondary"><i class="bi bi-dash-circle-fill"></i></button></td>
                        <td class="fs-6 menu-name text-capitalize">${menu}</td>
                        <td class="fs-6 menu-harga text-uppercase">${harga}</td>
                        <td class="fs-6 menu-qty">1</td>
                        <td class="fs-6 menu-total text-uppercase">${harga}</td>
                    </tr>
                `;
    
                orderTable.insertAdjacentHTML('beforeend', rowHTML);
            }
    
            // Update Total Harga Keseluruhan
            updateTotalHarga();
        });
    });
    document.querySelector('.order-table').addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('bi-dash-circle-fill')) {
            const row = event.target.closest('tr');
            const qtyCell = row.querySelector('.menu-qty');
            const totalCell = row.querySelector('.menu-total');
            const harga = parseInt(row.querySelector('.menu-harga').textContent);
            
            let qty = parseInt(qtyCell.textContent);
            
            if (qty > 1) {
                qty--; // Kurangi qty
                const total = qty * harga;
        
                // Perbarui tampilan Qty dan Total
                qtyCell.textContent = qty;
                totalCell.textContent = `Rp. ${total}`;
            } else {
                // Jika qty 1, hapus baris menu
                row.remove();
            }
    
            // Update Total Harga Keseluruhan
            updateTotalHarga();
        }
    });
    
    function updateTotalHarga() {
        const orderItems = document.querySelectorAll('.data');
        let totalHarga = 0;
    
        orderItems.forEach(item => {
            let total = parseInt(item.querySelector('.menu-total').textContent.replace('Rp. ', '').replace(',', ''));
            totalHarga += total;
        });
    
        document.getElementById('totalHarga').textContent = totalHarga;
    }
    

    // Fungsi untuk menghitung total harga keseluruhan
    function updateTotalHarga() {
        const orderItems = document.querySelectorAll('.data');
        let totalHarga = 0;
    
        orderItems.forEach(item => {
            let total = parseInt(item.querySelector('.menu-total').textContent.replace('Rp. ', '').replace(',', ''));
            totalHarga += total;
        });
    
        document.getElementById('totalHarga').textContent = totalHarga;
    }
}
const ulasanAPI = "https://script.google.com/macros/s/AKfycbwiN_W2YFZC1_fHfL34_WG_3uMjduc6xOl13_VOyV7dtCC333enFeEk4I56XRYFeEoS/exec"; // Ganti dengan URL API Anda

// Fungsi untuk memuat ulasan
function loadUlasan() {
    fetch(`${url}?sheetName=Ulasan`) // Panggil API
        .then(response => response.json()) // Ubah respons menjadi JSON
        .then(data => {
            if (data.success) {
                const ulasanContainer = document.getElementById("reviewCards"); // Elemen container ulasan
                ulasanContainer.innerHTML = ""; // Kosongkan container sebelum diisi

                data.ulasan.forEach(ulasan => {
                    // Ubah rating angka menjadi simbol bintang
                    const ratingStars = "⭐".repeat(ulasan.Rating);

                    // Ubah format tanggal dari ISO 8601 ke format lebih sederhana (YYYY-MM-DD)
                    const formattedDate = new Date(ulasan.Tanggal).toISOString().split("T")[0];

                    // Buat elemen ulasan
                    const card = document.createElement("div");
                    card.className = "col-md-5 review-card my-3 gap-2";
                    card.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${ulasan.Nama}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${ratingStars}</h6>
                                <p class="card-text">"${ulasan.Ulasan}"</p>
                                <small class="text-muted">Tanggal: ${formattedDate}</small>
                            </div>
                        </div>
                    `;
                    ulasanContainer.appendChild(card); // Tambahkan elemen ke dalam container
                });
            } else {
                console.error("Gagal memuat ulasan:", data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadUlasan);

fetchData();
