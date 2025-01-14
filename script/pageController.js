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

