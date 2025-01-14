const sname = "Transaksi"; // Nama sheet
const url2 = 'https://script.google.com/macros/s/AKfycbygmWi9PL216Cw7xWgKS3alVxQhH6Ze8C8DB3YsHojrt0UCPJuFTYHicHCxgWWUkMna/exec'
const urls = `${url2}?sheetName=${sname}`;
const tblPendapatan = `${url2}?sheetName=Pendapatan`;
const tblRate = `${url2}?sheetName=Ulasan`;

// Simpan ulasan
document.getElementById('reviewForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Ambil nilai dari form
    const name = document.getElementById('name').value.trim();
    const tanggal = document.getElementById('tanggal').value.trim();
    const rating = document.getElementById('rating').value.trim();
    const review = document.getElementById('review').value.trim();

    // Pastikan semua field terisi
    if (name && tanggal && rating && review) {
        // Siapkan data untuk dikirim
        const orderUlasan = {
            Tanggal: tanggal,
            Nama: name,
            Rating: rating,
            Ulasan: review
        };

        // Kirim data ke API menggunakan fetch
        fetch(tblRate, {
            method: 'POST',
            body: JSON.stringify(orderUlasan) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Mengubah response menjadi JSON
        })
        .then(data => {
            if (data.success) {
                alert('Ulasan berhasil dikirim!');
                document.getElementById('reviewForm').reset(); // Reset form setelah berhasil kirim
                location.reload();
            } else {
                alert('Terjadi kesalahan: ' + (data.message || 'Ulasan gagal dikirim.')); // Tampilkan pesan jika gagal
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert('Terjadi kesalahan. Silakan coba lagi.');
        });
    } else {
        // Jika ada field yang kosong
        alert('Silakan lengkapi semua field!');
    }
});

function saveOrderData() {
    const orderItems = document.querySelectorAll('.order-table .order-item');
    const modalOrderDetails = document.getElementById('modalOrderDetails');
    const modalCatatanElement = document.getElementById('catatan');
    const modalNamaElement = document.getElementById('nama');
    const modalTotalHargaElement = document.getElementById('totalHarga');

    const modalCatatan = modalCatatanElement?.value.trim() || 'Tidak ada catatan';
    const modalNama = modalNamaElement?.value.trim() || 'Pelanggan A';

    // Tampilkan nama pelanggan dan catatan di modal
    document.getElementById('modalNama').textContent = modalNama; // Update nama pelanggan ke modal
    document.getElementById('modalCatatan').textContent = modalCatatan; // Update catatan

    let orderData = {
        namaPelanggan: modalNama,
        catatan: modalCatatan,
        pesanan: [],
    };
    let totalHarga = 0;

    let pendapatanData = {
        namaPelanggan: modalNama,
        total: modalTotalHargaElement
    };
    if (orderItems.length === 0) {
        alert("Tidak ada pesanan untuk disimpan.");
        return;
    }

    // Clear previous modal content
    modalOrderDetails.innerHTML = '';

    orderItems.forEach((item, index) => {
        const menu = item.querySelector('.menu-name')?.textContent || '';
        const harga = parseInt(item.querySelector('.menu-harga')?.textContent.replace('Rp. ', '').replace(',', '') || 0);
        const qty = parseInt(item.querySelector('.menu-qty')?.textContent || 0);
        const total = parseInt(item.querySelector('.menu-total')?.textContent.replace('Rp. ', '').replace(',', '') || 0);

        // Validasi jika nilai lebih besar dari 0
        if (menu && harga > 0 && qty > 0 && total > 0) {
            const orderRowHTML = `
                <tr>
                    <td>${menu}</td>
                    <td>${harga}</td>
                    <td>${qty}</td>
                    <td>${total}</td>
                </tr>
            `;
            modalOrderDetails.insertAdjacentHTML('beforeend', orderRowHTML);

            orderData.pesanan.push({
                menu: menu,
                hargaSatuan: harga,
                jumlahPesanan: qty,
                totalHarga: total
            });

            totalHarga += total;
        }
    });

    // Update total harga di modal
    document.getElementById('modalTotalHarga').textContent = totalHarga;

    // Kirim data ke Google Sheets menggunakan POST
    fetch(urls, {
        method: 'POST',
        body: JSON.stringify(orderData), // Data yang akan dikirim
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert("Pesanan berhasil disimpan.");

                document.getElementById('nama').value = '';
                document.getElementById('catatan').value = '';

                const modalOrderDetails = document.getElementById('modalOrderDetails');
                modalOrderDetails.innerHTML = '';

                document.getElementById('modalTotalHarga').textContent = '0';

                const modalElement = document.getElementById('modalOrder');
                if (modalElement) {
                    modalElement.style.display = 'none';
                }

                document.getElementById('modalNama').textContent = '';
                document.getElementById('modalCatatan').textContent = '';
                location.reload();
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });

    fetch(tblPendapatan, {
        method: 'POST',
        body: JSON.stringify(pendapatanData),
    })
        .catch(error => {
            console.error("Error:", error);
        });
    }
document.querySelector('.btn-save').addEventListener('click', saveOrderData);
