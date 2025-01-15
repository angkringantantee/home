function showContent(sectionId) {
    // Sembunyikan 
    const sections = document.querySelectorAll('.main-section');
    sections.forEach(section => section.classList.add('d-none')); 

    // Tampilkan 
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.remove('d-none'); 
        selectedSection.classList.add('d-flex');
    }

    // hapus
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // active
    const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}


document.querySelector('.print-bills').addEventListener('click', function () {
    // Ambil data dari form dan tabel
    const nama = document.getElementById('nama').value;
    const catatan = document.getElementById('catatan').value;
    const totalHarga = document.getElementById('totalHarga').textContent;

    // Ambil data dari tabel pesanan
    const tableBody = document.querySelector('.order-table tbody');
    const orders = [];
    tableBody.querySelectorAll('tr').forEach(row => {
        const menu = row.children[1].textContent; // Kolom Menu
        const harga = row.children[2].textContent; // Kolom Harga
        const qty = row.children[3].textContent; // Kolom Qty
        const total = row.children[4].textContent; // Kolom Total
        orders.push({ menu, harga, qty, total });
    });

    // Isi modal dengan data
    document.getElementById('modalNama').textContent = nama.trim() ? nama : "Pelanggan A";
    document.getElementById('modalCatatan').textContent = catatan.trim() ? catatan : "Tidak ada catatan";
    document.getElementById('modalTotalHarga').textContent = totalHarga;

    const modalOrderDetails = document.getElementById('modalOrderDetails');
    modalOrderDetails.innerHTML = ''; // Hapus isi sebelumnya
    orders.forEach(order => {
        const row = `
            <tr>
                <td>${order.menu}</td>
                <td>${order.harga}</td>
                <td>${order.qty}</td>
                <td>${order.total}</td>
            </tr>
        `;
        modalOrderDetails.insertAdjacentHTML('beforeend', row);
    });

    // Tampilkan modal
    const modal = new bootstrap.Modal(document.getElementById('printModal'));
    modal.show();
});

