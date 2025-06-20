const languageSwitcher = document.getElementById("languageSwitcher");
let currentLanguage = 'es'; // Idioma por defecto

// Función para cargar el contenido del idioma
async function loadLanguageContent(lang) {
    try {
        const response = await fetch(`data/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo de idioma: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("No se pudo cargar el contenido del idioma:", error);
        return null;
    }
}

// Función para aplicar el contenido a la página
async function applyContent(lang) {
    const langData = await loadLanguageContent(lang);
    if (!langData) return;

    // Actualizar el título de la página
    const pageName = document.body.id || getPageNameFromPath(); // Obtener el nombre de la página actual
    const pageData = langData[pageName] || {}; // Obtener datos específicos de la página

    document.getElementById('page-title').textContent = pageData.title || langData.common.navHome; // Fallback al título de inicio si no hay específico

    // Actualizar enlaces de navegación
    document.getElementById('nav-home').textContent = langData.common.navHome;
    document.getElementById('nav-about').textContent = langData.common.navAbout;
    document.getElementById('nav-services').textContent = langData.common.navServices;
    document.getElementById('footer-text').innerHTML = langData.common.footerText;

    // Cargar contenido específico de la página
    const contentDiv = document.getElementById('content');
    let pageContentHTML = '';

    if (pageName === 'index') {
        pageContentHTML = `
            <h1>${pageData.heading}</h1>
            <p>${pageData.paragraph1}</p>
            <p>${pageData.paragraph2}</p>
            <button>${pageData.callToAction}</button>
        `;
    } else if (pageName === 'nosotros') {
        pageContentHTML = `
            <h1>${pageData.heading}</h1>
            <p>${pageData.paragraph1}</p>
            <p>${pageData.paragraph2}</p>
            <h2>${pageData.teamHeading}</h2>
            <ul>
                <li>${pageData.teamMember1}</li>
                <li>${pageData.teamMember2}</li>
            </ul>
        `;
    } else if (pageName === 'servicios') {
        pageContentHTML = `
            <h1>${pageData.heading}</h1>
            <div>
                <h3>${pageData.service1Title}</h3>
                <p>${pageData.service1Desc}</p>
            </div>
            <div>
                <h3>${pageData.service2Title}</h3>
                <p>${pageData.service2Desc}</p>
            </div>
            <div>
                <h3>${pageData.service3Title}</h3>
                <p>${pageData.service3Desc}</p>
            </div>
        `;
    } else {
        pageContentHTML = `<p>Contenido no encontrado para esta página.</p>`;
    }

    contentDiv.innerHTML = pageContentHTML;

    // Actualizar el atributo lang del HTML para accesibilidad
    document.documentElement.lang = lang;
    currentLanguage = lang; // Actualiza la variable global del idioma actual
    localStorage.setItem('selectedLanguage', lang); // Guarda la preferencia del usuario
}

// Función para determinar el nombre de la página actual basado en la URL
function getPageNameFromPath() {
    const path = window.location.pathname;
    const parts = path.split('/');
    let fileName = parts[parts.length - 1];
    if (fileName === '' || fileName === 'index.html') {
        return 'index';
    }
    return fileName.split('.')[0]; // Remueve la extensión .html
}

// Función para cambiar el idioma (llamada desde los botones)
languageSwitcher.addEventListener("change", () => {
  const lang = languageSwitcher.value;
  applyContent(lang);
//   localStorage.setItem("lang", lang);
//   loadLanguage(lang);
});
// function changeLanguage(lang) {
//     applyContent(lang);
// }

// Lógica para el menú hamburguesa
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Cargar el idioma guardado o el idioma por defecto al cargar la página
    const savedLanguage = localStorage.getItem('selectedLanguage');
    applyContent(savedLanguage || 'es'); // Carga el idioma guardado o español por defecto

    // Asignar IDs al body para facilitar la identificación de la página
    const currentPageName = getPageNameFromPath();
    document.body.id = currentPageName;
});