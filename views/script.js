window.addEventListener("scroll", function() {
    var whatsappIcon = document.getElementById("whatsapp-icon");
    if (window.scrollY > 100) {
        whatsappIcon.style.display = "block";
    } else {
        whatsappIcon.style.display = "none";
    }
});

// Mengambil semua tautan menu dalam navbar
const menuLinks = document.querySelectorAll('nav a');

// Menambahkan event listener untuk setiap tautan menu
menuLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Mengambil ID dari atribut href tautan menu
        const targetId = this.getAttribute('href').substring(1);

        // Mengambil elemen target berdasarkan ID
        const targetElement = document.getElementById(targetId);

        // Scroll ke elemen target dengan efek smooth scrolling
        targetElement.scrollIntoView({ behavior: 'smooth' });
    });
});