document.addEventListener("DOMContentLoaded", function () {
// === BANNER CYCLING CON PRELOAD E TRANSIZIONI FLUIDE ===
const bannerImg = document.getElementById("Banner");
if (bannerImg) {
const banners = [
"https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner1.avif",
"https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner2.avif",
"https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner3.avif",
"https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/banner4.avif"
];
// Pre-carica le immagini
const preloadedImages = banners.map(src => {
const img = new Image();
img.src = src;
return img;
});
let bnrCntr = 0;
function cycleBanner() {
bannerImg.classList.add("banner-fade-out");
// Attendiamo la transizione prima di cambiare l'immagine
setTimeout(() => {
bnrCntr = (bnrCntr + 1) % banners.length;
bannerImg.src = banners[bnrCntr];
bannerImg.classList.remove("banner-fade-out");
}, 500); // Dovrebbe corrispondere alla durata della transizione CSS
}
// Cambia banner ogni 3.5 secondi (3s visualizzazione + 0.5s transizione)
setInterval(cycleBanner, 3500);
 }
// === CONTATORE FESTIVITÀ: CALCOLO OTTIMIZZATO ===
function getNextHoliday() {
const now = new Date();
const year = now.getFullYear();
const holidays = [
{ name: "St. Patrick's Day", date: new Date(`${year}-03-17`), style: "st-patrick" },
{ name: "4th di luglio", date: new Date(`${year}-07-04`), style: "july4" },
{ name: "Halloween", date: new Date(`${year}-10-31`), style: "halloween" },
{ name: "Natale", date: new Date(`${year}-12-25`), style: "natale" }
];
// Se siamo dopo Natale, considera la prossima St. Patrick's Day dell'anno successivo
if (now > holidays[3].date) {
holidays[0].date = new Date(`${year + 1}-03-17`);
}
// Trova la prossima festività
const nextHoliday = holidays.find(h => h.date > now) || holidays[0];
const daysLeft = Math.ceil((nextHoliday.date - now) / (1000 * 60 * 60 * 24));
return {
msg: `Solo ${daysLeft} giorni a <span class="holiday-name ${nextHoliday.style}">${nextHoliday.name}</span>!`,
style: nextHoliday.style
};
}
// Inserisci il messaggio festivo
const msgContainer = document.getElementById("holidayMsg");
if (msgContainer) {
const holiday = getNextHoliday();
msgContainer.innerHTML = `<p class="holiday-countdown ${holiday.style}">${holiday.msg}</p>`;
}
});

// Light effect around the bulb image
function turnOnLight() {
  const img = document.getElementById('myImage');
  img.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/pic_bulbon.avif';
  img.classList.add('bulb-glow');
}
function turnOffLight() {
  const img = document.getElementById('myImage');
  img.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/pic_bulboff.avif';
  img.classList.remove('bulb-glow');
}
// End effect around the bulb image

// === EFFECT WITH FADE-IN SEQUENCE ===
(function() {
    const initFadeInSequence = () => {
        const lines = document.querySelectorAll(".type-line");
        let currentLineIndex = 0;

        const showNextLine = () => {
            if (currentLineIndex >= lines.length) return;

            const line = lines[currentLineIndex];
            // Aspetta che il testo sia stato iniettato dal tuo script lingua
            const text = line.textContent.trim();

            if (text.length === 0) {
                // Se il testo non è ancora arrivato, riprova tra poco
                setTimeout(showNextLine, 50);
                return;
            }

            line.classList.add("is-visible"); // Fa apparire la riga
            currentLineIndex++;
            setTimeout(showNextLine, 500); // Ritardo tra una frase e l'altra (ms)
        };

        // Usa l'Intersection Observer per far partire l'animazione solo quando visibile
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                showNextLine();
                observer.disconnect(); // Una volta avviata, non serve più osservare
            }
        }, { threshold: 0.2 }); // Inizia quando il 20% dell'elemento è visibile

        const terminalWindow = document.querySelector(".terminal-window");
        if (terminalWindow) observer.observe(terminalWindow);
    };

    // Assicurati che parta solo dopo che tutti i contenuti (e il tuo JSON) sono caricati
    window.addEventListener("load", initFadeInSequence);
})();