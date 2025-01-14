document.addEventListener('DOMContentLoaded', function () {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const lightModeSwitch = document.getElementById('lightModeSwitch');

    // Cek preferensi tema sebelumnya dari localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Tentukan tema awal berdasarkan preferensi yang disimpan
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeSwitch.checked = true;
        lightModeSwitch.checked = false;
    } else {
        document.body.classList.remove('dark-mode');
        darkModeSwitch.checked = false;
        lightModeSwitch.checked = true;
    }

    // Fungsi untuk mengganti tema ke dark
    function switchToDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');  // Simpan preferensi tema di localStorage
        darkModeSwitch.checked = true;
        lightModeSwitch.checked = false; // Uncheck light mode switch
    }

    // Fungsi untuk mengganti tema ke light
    function switchToLightMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');  // Simpan preferensi tema di localStorage
        darkModeSwitch.checked = false; // Uncheck dark mode switch
        lightModeSwitch.checked = true;
    }

    // Event listener untuk switch ke dark mode
    darkModeSwitch.addEventListener('change', function () {
        if (this.checked) {
            switchToDarkMode();
        }
    });

    // Event listener untuk switch ke light mode
    lightModeSwitch.addEventListener('change', function () {
        if (this.checked) {
            switchToLightMode();
        }
    });
});
