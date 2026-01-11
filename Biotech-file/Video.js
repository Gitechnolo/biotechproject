// Video.js - Caricamento dinamico del video al click
function loadAndPlayVideo() {
  const container = document.getElementById('ytVideoContainer');
  const img = document.getElementById('videoPoster');
  if (!img) return;

  // Crea l'elemento video
  const video = document.createElement('video');
  video.id = 'ytVideo';
  video.controls = false; // Disabilita i controlli nativi
  video.preload = 'metadata';
  video.poster = img.src;
  video.style.width = '100%';
  video.style.height = 'auto';
  video.style.display = 'block';
  video.style.maxHeight = '600px';
  video.style.borderRadius = '8px';
  video.setAttribute('playsinline', ''); // Importante per iOS

  // Sorgente video
  const source = document.createElement('source');
  source.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/Singapore_boscoartificiale-Metropoli.mp4';
  source.type = 'video/mp4';
  video.appendChild(source);

  // Sottotitoli
  const trackEN = document.createElement('track');
  trackEN.kind = 'subtitles';
  trackEN.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/fgsubtitles_en.vtt';
  trackEN.srclang = 'en';
  trackEN.label = 'English';
  trackEN.default = true;
  video.appendChild(trackEN);

  const trackIT = document.createElement('track');
  trackIT.kind = 'subtitles';
  trackIT.src = 'https://gitechnolo.github.io/biotechproject/Biotech-file/images/Biotech-menu/fgsubtitles_it.vtt';
  trackIT.srclang = 'it';
  trackIT.label = 'Italian';
  video.appendChild(trackIT);

  // Sostituisci l'immagine con il video
  container.replaceChild(video, img);

  // Mostra i controlli personalizzati
  const controls = document.querySelector('.yt-video-controls');
  if (controls) {
    controls.style.display = 'flex';
  }

  // Inizializza i controlli
  initializeVideoControls(video, controls);
}

// Funzione per gestire i controlli personalizzati
function initializeVideoControls(video, controls) {
  if (!controls) return;

  const playPauseBtn = controls.querySelector('#ytPlayPause');
  const playPauseIcon = controls.querySelector('#ytPlayPauseIcon');
  const progressBar = controls.querySelector('#ytProgress');
  const currentTime = controls.querySelector('#ytCurrentTime');
  const durationEl = controls.querySelector('#ytDuration');
  const volumeControl = controls.querySelector('#ytVolume');
  const muteBtn = controls.querySelector('#ytMute');
  const muteIcon = controls.querySelector('#ytMuteIcon');
  const fullscreenBtn = controls.querySelector('#ytFullscreen');
  const exitFullscreenBtn = controls.querySelector('#ytExitFullscreen');

  // Formatta il tempo come mm:ss
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  // Play/Pause
  playPauseBtn?.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(e => console.error("Errore riproduzione:", e));
    } else {
      video.pause();
    }
  });

  video.addEventListener('play', () => {
    playPauseIcon.textContent = '⏸️';
  });

  video.addEventListener('pause', () => {
    playPauseIcon.textContent = '▶️';
  });

  // Aggiorna progresso
  video.addEventListener('timeupdate', () => {
    progressBar.value = video.currentTime;
    currentTime.textContent = formatTime(video.currentTime);
  });

  video.addEventListener('loadedmetadata', () => {
    progressBar.max = video.duration;
    durationEl.textContent = formatTime(video.duration);
    currentTime.textContent = formatTime(video.currentTime);
  });

  progressBar?.addEventListener('input', () => {
    video.currentTime = progressBar.value;
  });

  // Volume
  volumeControl?.addEventListener('input', () => {
    video.volume = volumeControl.value;
    muteIcon.textContent = video.muted || video.volume === 0 ? '🔇' : '🔊';
  });

  video.addEventListener('volumechange', () => {
    muteIcon.textContent = video.muted || video.volume === 0 ? '🔇' : '🔊';
  });

  // Mute/Unmute
  muteBtn?.addEventListener('click', () => {
    video.muted = !video.muted;
    muteIcon.textContent = video.muted ? '🔇' : '🔊';
  });

  // Fullscreen
  fullscreenBtn?.addEventListener('click', () => {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  });

  exitFullscreenBtn?.addEventListener('click', () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  });

  // Gestione fullscreen change
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement === video) {
      fullscreenBtn.style.display = 'none';
      exitFullscreenBtn.style.display = 'flex';
    } else {
      fullscreenBtn.style.display = 'flex';
      exitFullscreenBtn.style.display = 'none';
    }
  });

  // Tasti rapidi
  video.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      playPauseBtn?.click();
      e.preventDefault();
    } else if (e.code === 'KeyM') {
      muteBtn?.click();
      e.preventDefault();
    } else if (e.code === 'KeyF') {
      fullscreenBtn?.click();
      e.preventDefault();
    }
  });
}   

// ==========================================
// BIOTECH CORE ENGINE - ULTIMATE EDITION 2026
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURAZIONE LINGUA ---
    const getActiveLang = () => localStorage.getItem('preferred-language') || (navigator.language.startsWith('en') ? 'en' : 'it');
    let currentLang = getActiveLang();
    const isIt = currentLang === 'it';
    const pad = n => n < 10 ? '0' + n : n;

    const getCurrentSeason = () => {
        const now = new Date();
        const dateVal = (now.getMonth() + 1) * 100 + now.getDate();
        if (dateVal >= 321 && dateVal < 621) return "spring";
        if (dateVal >= 621 && dateVal < 923) return "summer";
        if (dateVal >= 923 && dateVal < 1221) return "autumn";
        return "winter";
    };

    // --- DIZIONARI SCIENTIFICI INTEGRALI ---
    const bioExplanations = {
        it: {
            "RIGENERAZIONE GLINFATICA": "SISTEMA GLINFATICO: Meccanismo di pulizia del SNC. Durante il sonno, gli astrociti facilitano il lavaggio dei rifiuti metabolici tramite il liquido cerebrospinale.",
            "PICCO DI CORTISOLO": "Fase di massima attivazione surrenale per elevare la glicemia e preparare l'organismo alle richieste energetiche diurne.",
            "VIGILANZA ELEVATA": "Stato di allerta cognitiva ottimale guidato dalla stabilità dell'oressina e dal basso carico di adenosina.",
            "MASSIMA ALLERTA": "Finestra di massima velocità di elaborazione neurale e coordinazione. Picco della temperatura corporea e della dopamina.",
            "RISPOSTA LEPTINICA": "Segnale ormonale di sazietà che sposta il metabolismo verso l'immagazzinamento e il recupero post-prandiale.",
            "MANTENIMENTO COGNITIVO": "Fase di stabilizzazione dell'attenzione sostenuta dall'acetilcolina prima del calo metabolico pomeridiano.",
            "PICCO FISICO": "Massima efficienza cardiovascolare e forza muscolare. I polmoni e il cuore operano alla massima capacità.",
            "FINESTRA ANABOLICA": "Periodo ottimale per la riparazione cellulare e la sintesi proteica grazie alla gestione dell'insulina.",
            "CALMA NEURONALE": "Transizione verso il sistema parasimpatico. Riduzione dei battiti e preparazione al rilascio di melatonina.",
            "RILASCIO MELATONINA": "Inizio della secrezione pineale che segnala al corpo l'inizio della notte biologica.",
            "RIPARAZIONE TESSUTI": "Processo rigenerativo profondo mediato dall'ormone della crescita (GH) durante le prime fasi del sonno.",
            "PULIZIA CEREBRALE": "Attivazione dei flussi glinfatici per la rimozione di beta-amiloide e detriti metabolici neurali.",
            "RESET CIRCADIANO": "Sincronizzazione dei nuclei soprachiasmatici tramite segnali luminosi e termici.",
            "PICCO COGNITIVO": "Fase di massima efficienza della corteccia prefrontale. Ottimizzazione del problem solving.",
            "SAZIETÀ METABOLICA": "Gestione ormonale post-prandiale: bilanciamento tra insulina e leptina.",
            "STABILITÀ SINAPTICA": "Mantenimento dei potenziali d'azione e della plasticità neuronale a breve termine.",
            "EFFICIENZA MAX": "Sincronia tra gittata cardiaca, ossigenazione polmonare e reclutamento motorio.",
            "SINTESI PROTEICA": "Attivazione dei pathway mTor per la riparazione cellulare e strutturale.",
            "MODALITÀ RECUPERO": "Predominanza del sistema nervoso parasimpatico. Abbassamento della frequenza cardiaca.",
            "INIZIO PULIZIA": "Transizione biochimica: calo della temperatura centrale e avvio della pulizia glinfatica.",
            "ORESSINA": "Neuropeptide ipotalamico che stabilizza la veglia e regola l'appetito.",
            "LEPTINA": "Ormone della sazietà prodotto dal tessuto adiposo. Segnala le riserve energetiche.",
            "DOPAMINA": "Neurotrasmettitore della ricompensa. Ottimizza le funzioni esecutive.",
            "ACETILCOLINA": "Modulatore della plasticità sinaptica. Fondamentale per memoria e attenzione.",
            "GABA": "Neurotrasmettitore inibitorio. Riduce l'eccitabilità e stabilizza il sistema.",
            "MELATONINA": "Indoloammina pineale. Regola il ritmo circadiano e agisce come antiossidante.",
            "CORTISOLO": "Glucocorticoide del risveglio: prepara il corpo allo stress metabolico diurno.",
            "ADRENALINA": "Epinefrina: attiva il sistema simpatico per una risposta fisica immediata.",
            "INSULINA": "Ormone anabolico pancreatico. Regola l'omeostasi del glucosio.",
            "SOMATOTROPINA": "Ormone della crescita (GH). Cruciale per la riparazione dei tessuti.",
            "ADENOSINA": "Sottoprodotto energetico (ATP). Crea la pressione omeostatica del sonno.",
            "LUCE NATURALE": "Esposizione solare precoce per resettare i ritmi circadiani.",
            "COLAZIONE PROT.": "Apporto proteico per fornire aminoacidi precursori dei neurotrasmettitori.",
            "FOCUS ATTIVO": "Finestra di massima vigilanza cognitiva e coordinazione.",
            "PAUSA NUTRIZIONE": "Sincronizzazione degli orologi periferici tramite nutrienti controllati.",
            "FOCUS ANALITICO": "Fase ottimale per compiti di precisione, supportata dall'acetilcolina.",
            "MOVIMENTO": "Attività fisica per sfruttare il picco di forza muscolare pomeridiana.",
            "DECOMPRESSIONE": "Riduzione degli stimoli simpatici verso il sistema parasimpatico.",
            "RELAX ATTIVO": "Attività a basso impatto per smaltire il cortisolo residuo.",
            "NO LUCE BLU": "Blocco frequenze 450-480nm per prevenire l'inibizione della melatonina.",
            "BUIO TOTALE": "Assenza di fotoni per massimizzare la secrezione di melatonina.",
            "LUCE ART. 10K LUX": "Fotobiomodulazione invernale: simula lo spettro solare.",
            "SOLE DIRETTO 10M": "Ottimizza il rilascio di melatonina circa 14 ore dopo.",
            "INTEGRA VITAMINA D": "Supporto per l'espressione genica circadiana e il sistema immunitario.",
            "IDRATAZIONE + SALI": "Ripristino elettroliti per il potenziale d'azione neuronale.",
            "THERMO-RELAX (CALDO)": "Favorisce la vasodilatazione per abbassare la temperatura centrale.",
            // --- NUOVE MOLECOLE (IT) ---
"SEROTONINA": "Neurotrasmettitore stabilizzatore dell'umore. Precursore della melatonina, fondamentale per il benessere emotivo e la sazietà diurna.",
"OSSITOCINA": "Ormone della connessione sociale e della fiducia. Riduce i livelli di cortisolo e promuove il rilassamento parasimpatico.",
"ENDORFINE": "Peptidi oppioidi endogeni. Agiscono come analgesici naturali e inducono una sensazione di benessere post-attività fisica.",
"GRELINA": "Ormone gastrico che stimola il senso di fame. Segnala al cervello la necessità di introdurre nutrienti per il mantenimento energetico.",
            "default": "Dato bio-sincronizzato tramite modulo Biotech Core."
        },
        en: {
            "GLYMPHATIC REGEN": "GLYMPHATIC SYSTEM: CNS clearance mechanism. Astrocytes facilitate metabolic waste flushing.",
            "CORTISOL SPIKE": "Peak adrenal activation to elevate glucose for daytime demands.",
            "HIGH VIGILANCE": "Optimal alertness driven by orexin and low adenosine load.",
            "MAX ALERTNESS": "Window of maximum neural processing speed and coordination.",
            "LEPTIN RESPONSE": "Hormonal satiety signal shifting metabolism toward storage.",
            "COGNITIVE MAINT.": "Attention stabilization phase before the afternoon dip.",
            "PHYSICAL PEAK": "Maximum cardiovascular efficiency and muscle strength.",
            "ANABOLIC WINDOW": "Optimal period for cellular repair and protein synthesis.",
            "NEURONAL CALM": "Transition to the parasympathetic system. Melatonin prep.",
            "MELATONIN ONSET": "Onset of pineal secretion signaling biological night.",
            "TISSUE REPAIR": "Deep regenerative process mediated by GH during sleep.",
            "BRAIN CLEARANCE": "Glymphatic activation for beta-amyloid and metabolic debris removal.",
            "CIRCADIAN RESET": "Suprachiasmatic nuclei synchronization via light and heat.",
            "COGNITIVE PEAK": "Maximum prefrontal cortex efficiency and problem solving.",
            "METABOLIC SATIETY": "Post-prandial management: insulin and leptin balancing.",
            "SYNAPTIC STABILITY": "Maintenance of action potentials and neural plasticity.",
            "EFFICIENCY MAX": "Symmetry between heart rate and motor recruitment.",
            "PROTEIN SYNTHESIS": "mTor pathway activation for structural tissue repair.",
            "RECOVERY MODE": "Parasympathetic dominance. Lowering of heart rate.",
            "CLEARANCE START": "Biochemical transition: core temperature drop.",
            "OREXIN": "Hypothalamic neuropeptide that stabilizes wakefulness.",
            "LEPTIN": "Satiety hormone produced by adipose tissue.",
            "DOPAMINE": "Reward neurotransmitter. Optimizes executive functions.",
            "ACETYLCHOLINE": "Synaptic plasticity modulator. Essential for memory.",
            "GABA": "Inhibitory neurotransmitter. Stabilizes the nervous system.",
            "MELATONIN": "Pineal indoleamine. Regulates circadian rhythms.",
            "CORTISOL": "Awakening glucocorticoid: prepares for metabolic stress.",
            "ADRENALINE": "Epinephrine: activates the sympathetic system.",
            "INSULIN": "Anabolic pancreatic hormone. Regulates glucose.",
            "SOMATOTROPIN": "Growth Hormone (GH). Crucial for tissue repair.",
            "ADENOSINE": "ATP byproduct creating homeostatic sleep pressure.",
            "NATURAL LIGHT": "Early solar exposure to reset circadian rhythms.",
            "PROTEIN BREAKFAST": "Provides amino acid precursors for neurotransmitters.",
            "ACTIVE FOCUS": "Window of maximum alertness and coordination.",
            "NUTRITION BREAK": "Synchronization of peripheral clocks via nutrients.",
            "ANALYTICAL FOCUS": "Optimal phase for precision tasks.",
            "WORKOUT": "Physical activity during peak body temperature.",
            "DOWNTIME": "Reduction of sympathetic stimuli.",
            "ACTIVE RELAX": "Low-impact activity to clear residual cortisol.",
            "NO BLUE LIGHT": "Blocking 450-480nm light to prevent melatonin inhibition.",
            "TOTAL DARKNESS": "Absence of photons to stimulate the pineal gland.",
            "10K LUX ART. LIGHT": "Winter photobiomodulation: simulates solar spectrum.",
            "DIRECT SUN 10M": "Optimizes melatonin release 14 hours later.",
            "VITAMIN D INTAKE": "Support for circadian genes and immune system.",
            "HYDRATION + SALTS": "Electrolyte restoration for neural potential.",
            "WARM THERMO-RELAX": "Promotes vasodilation to lower core temperature.",
            // --- NEW MOLECULES (EN) ---
"SEROTONIN": "Mood-stabilizing neurotransmitter. Precursor to melatonin, essential for emotional well-being and daytime satiety.",
"OXYTOCIN": "Hormone of social connection and trust. Reduces cortisol levels and promotes parasympathetic relaxation.",
"ENDORPHINS": "Endogenous opioid peptides. Act as natural painkillers and induce post-exercise euphoria.",
"GHRELIN": "Gastric hormone that stimulates appetite. Signals the brain for energy intake and maintenance.",
            "default": "Bio-synchronized data via Biotech Core module."
        }
    };

    // --- 1. MONITOR STAGIONALE ---
    function initSeasonMonitor() {
        const countdownEl = document.getElementById('modern-countdown');
        if (!countdownEl) return;
        let dataDisplay = document.getElementById('bio-data-display') || document.createElement('div');
        if (!dataDisplay.id) { dataDisplay.id = 'bio-data-display'; countdownEl.innerHTML = ''; countdownEl.appendChild(dataDisplay); }

        const lang = {
            seasons: isIt ? { spring: "PRIMAVERA", summer: "ESTATE", autumn: "AUTUNNO", winter: "INVERNO" } : { spring: "SPRING", summer: "SUMMER", autumn: "AUTUMN", winter: "WINTER" },
            phase: isIt ? "FASE CICLO" : "CYCLE PHASE"
        };

        const updateBioCycle = () => {
            const now = new Date(), year = now.getFullYear(), seasonKey = getCurrentSeason();
            const start = new Date(year, 0, 1), end = new Date(year + 1, 0, 1);
            const progress = ((now - start) / (end - start)) * 100, daysLeft = Math.floor((end - now) / 86400000);
            const tooltipMsg = isIt ? 'Monitoraggio dell\'inclinazione assiale terrestre e impatto metabolico.' : 'Earth axial tilt monitoring and metabolic impact.';
            dataDisplay.innerHTML = `
                <div class="bio-season-label" data-bio-tip="${tooltipMsg}">${lang.seasons[seasonKey]} ${lang.phase}</div>
                <div class="bio-progress-data" data-bio-tip="${tooltipMsg}">${progress.toFixed(2)}% <span class="bio-t-minus">| T-MINUS: ${daysLeft}${isIt ? 'G' : 'D'}</span></div>
            `;
        };
        updateBioCycle(); setInterval(updateBioCycle, 3600000);
    }

    // --- 2. OROLOGIO BIO-CIRCADIANO ---
    function initBioClock() {
        const clockEl = document.getElementById('clock2');
        if (!clockEl) return;

        const circadianMap = {
    0:  { it: ["RIGENERAZIONE GLINFATICA", "PULIZIA CEREBRALE", "ADENOSINA", "BUIO TOTALE"], en: ["GLYMPHATIC REGEN", "BRAIN CLEARANCE", "ADENOSINE", "TOTAL DARKNESS"] },
    3:  { it: ["RIPARAZIONE TESSUTI", "PICCO SOMATOTROPINA", "SOMATOTROPINA", "SOGNO PROFONDO"], en: ["TISSUE REPAIR", "GH PEAK", "SOMATOTROPIN", "DEEP DREAMING"] },
    6:  { it: ["PICCO DI CORTISOLO", "RESET CIRCADIANO", "CORTISOLO", "LUCE NATURALE"], en: ["CORTISOL SPIKE", "CIRCADIAN RESET", "CORTISOL", "NATURAL LIGHT"] },
    8:  { it: ["STABILITÀ EMOTIVA", "SINTESI SEROTONINA", "SEROTONINA", "ESPOSIZIONE SOLARE"], en: ["EMOTIONAL STABILITY", "SEROTONIN SYNTHESIS", "SEROTONIN", "SUN EXPOSURE"] },
    11: { it: ["MASSIMA ALLERTA", "PICCO COGNITIVO", "DOPAMINA", "FOCUS ATTIVO"], en: ["MAX ALERTNESS", "COGNITIVE PEAK", "DOPAMINE", "ACTIVE FOCUS"] },
    12: { it: ["STIMOLO ORESSIGENICO", "PICCO GRELINA", "GRELINA", "PAUSA NUTRIZIONE"], en: ["OREXIGENIC STIMULUS", "GHRELIN PEAK", "GHRELIN", "NUTRITION BREAK"] },
    13: { it: ["RISPOSTA LEPTINICA", "SAZIETÀ METABOLICA", "LEPTINA", "PAUSA NUTRIZIONE"], en: ["LEPTIN RESPONSE", "METABOLIC SATIETY", "LEPTIN", "NUTRITION BREAK"] },
    15: { it: ["MANTENIMENTO COGNITIVO", "STABILITÀ SINAPTICA", "ACETILCOLINA", "FOCUS ANALITICO"], en: ["COGNITIVE MAINT.", "SYNAPTIC STABILITY", "ACETYLCHOLINE", "ANALYTICAL FOCUS"] },
    17: { it: ["PICCO FISICO", "RILASCIO ENDORFINE", "ENDORFINE", "MOVIMENTO"], en: ["PHYSICAL PEAK", "ENDORPHIN RELEASE", "ENDORPHINS", "WORKOUT"] },
    19: { it: ["FINESTRA ANABOLICA", "SINTESI PROTEICA", "INSULINA", "DECOMPRESSIONE"], en: ["ANABOLIC WINDOW", "PROTEIN SYNTHESIS", "INSULIN", "DOWNTIME"] },
    21: { it: ["RELAZIONE SOCIALE", "RILASCIO OSSITOCINA", "OSSITOCINA", "RELAX ATTIVO"], en: ["SOCIAL CONNECTION", "OXYTOCIN RELEASE", "OXYTOCIN", "ACTIVE RELAX"] },
    23: { it: ["RILASCIO MELATONINA", "INIZIO PULIZIA", "MELATONINA", "NO LUCE BLU"], en: ["MELATONIN ONSET", "CLEARANCE START", "MELATONIN", "NO BLUE LIGHT"] }
};

        const getDynamicAdvice = (h, base) => {
            const s = getCurrentSeason();
            if (h >= 6 && h < 9) {
                if (s === "winter") return isIt ? "LUCE ART. 10K LUX" : "10K LUX ART. LIGHT";
                if (s === "summer") return isIt ? "SOLE DIRETTO 10M" : "DIRECT SUN 10M";
            }
            if (h >= 10 && h < 13 && (s === "winter" || s === "autumn")) return isIt ? "INTEGRA VITAMINA D" : "VITAMIN D INTAKE";
            if (h >= 13 && h < 17 && s === "summer") return isIt ? "IDRATAZIONE + SALI" : "HYDRATION + SALTS";
            if (h >= 20 && s === "winter") return isIt ? "THERMO-RELAX (CALDO)" : "WARM THERMO-RELAX";
            return base;
        };

        const updateClock = () => {
            const now = new Date(), hour = now.getHours();
            const keys = Object.keys(circadianMap).map(Number).reverse();
            const currentKey = keys.find(k => hour >= k) || 0;
            const data = circadianMap[currentKey][isIt ? 'it' : 'en'];
            const advice = getDynamicAdvice(hour, data[3]);
            const timeStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} | ${pad(hour)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
            const dict = isIt ? bioExplanations.it : bioExplanations.en;

            const mDesc = dict[data[2].toUpperCase()] || dict["default"];
            const aDesc = dict[advice.toUpperCase()] || dict["default"];
            const sDesc = dict[data[0].toUpperCase()] || dict["default"];
            const sysDesc = dict[data[1].toUpperCase()] || (isIt ? "Stato operativo Biotech Core." : "Biotech Core operational state.");

            clockEl.innerHTML = `
                <div class="hud-inline-row">
                    <span data-bio-tip="${mDesc}">${isIt ? 'MOLECOLA' : 'MOLECULE'}: <b class="bio-data-value">${data[2]}</b></span>
                    <span class="separator">|</span>
                    <span data-bio-tip="${aDesc}">${isIt ? 'CONSIGLIO' : 'ADVICE'}: <b class="bio-data-value">${advice}</b></span>
                </div>
                <span class="bio-status-label" data-bio-tip="${sDesc}">${data[0]}</span>
                <span class="bio-clock-time">${timeStr}</span>
                <span class="bio-system-state" data-bio-tip="${sysDesc}">SYS STATE: ${data[1]}</span>
            `;
        };
        updateClock(); setInterval(updateClock, 1000);
    }

    // --- 3. SALUTO SETTIMANALE ---
    function initWeeklyGreeting() {
        const weekElement = document.getElementById("week");
        if (!weekElement) return;
        const createSpans = (text, start) => text.split('').map((char, index) => `<span style='--i:${start + index}'>${char === ' ' ? '&nbsp;' : char}</span>`).join('');
        const messages = { it: ['buona domenica!', 'buon lunedì!', 'buon martedì!', 'buon mercoledì!', 'buon giovedì!', 'buon venerdì!', 'buon sabato!'], en: ['happy sunday!', 'happy monday!', 'happy tuesday!', 'happy wednesday!', 'happy thursday!', 'happy friday!', 'happy saturday!'] };
        const titles = { it: 'Biotech Project vi augura ', en: 'Biotech Project wishes you ' };
        const greetings = { it: ['Buonanotte', 'Buongiorno', 'Buon pomeriggio', 'Buonasera'], en: ['Good night', 'Good morning', 'Good afternoon', 'Good evening'] };
        const now = new Date(), hour = now.getHours(), today = now.getDay();
        let gIdx = hour < 6 ? 0 : hour < 14 ? 1 : hour < 18 ? 2 : 3;
        window.requestAnimationFrame(() => {
            const daySpans = createSpans(messages[isIt ? 'it' : 'en'][today], 26);
            const titleSpans = createSpans(titles[isIt ? 'it' : 'en'], 1);
            weekElement.innerHTML = `<div class="greeting-time">${greetings[isIt ? 'it' : 'en'][gIdx]}</div>${titleSpans + daySpans}`;
        });
    }

    // --- 4. TOOLTIP GESTORE ---
    function initBiotechTooltips() {
        let tooltipEl = document.querySelector('.biotech-tooltip') || document.createElement('div');
        if (!tooltipEl.className) { tooltipEl.className = 'biotech-tooltip'; document.body.appendChild(tooltipEl); }
        document.addEventListener('mouseover', (e) => { const target = e.target.closest('[data-bio-tip]'); if (target) { tooltipEl.textContent = target.getAttribute('data-bio-tip'); tooltipEl.style.display = 'block'; } });
        document.addEventListener('mousemove', (e) => { if (tooltipEl.style.display === 'block') { tooltipEl.style.left = e.clientX + 'px'; tooltipEl.style.top = (e.clientY + 25) + 'px'; } });
        document.addEventListener('mouseout', (e) => { if (e.target.closest('[data-bio-tip]')) tooltipEl.style.display = 'none'; });
    }

    initSeasonMonitor(); initBioClock(); initWeeklyGreeting(); initBiotechTooltips();
});
// Fine Biotech Core Engine