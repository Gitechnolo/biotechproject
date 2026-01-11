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
// BIOTECH CORE ENGINE - SYNCHRONIZED EDITION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // --- SINCRONIZZAZIONE LINGUA CON IL SISTEMA MODULARE ---
    // Legge dal localStorage come lo script principale
    const getActiveLang = () => {
        return localStorage.getItem('preferred-language') || 
               (navigator.language.startsWith('en') ? 'en' : 'it');
    };
    
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

    // --- DIZIONARI SCIENTIFICI POTENZIATI (IT/EN) ---
    const bioExplanations = {
        it: {
            // --- ETICHETTE DI STATO (data[0]) ---
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
            // --- MOLECOLE (data[2]) ---
            "ORESSINA": "Neuropeptide ipotalamico che stabilizza la veglia e regola l'appetito. Fondamentale per la stabilità dei cicli sonno-veglia.",
            "LEPTINA": "Ormone della sazietà prodotto dal tessuto adiposo. Segnala al cervello lo stato delle riserve energetiche.",
            "DOPAMINA": "Neurotrasmettitore della ricompensa e della motivazione. Ottimizza le funzioni esecutive della corteccia prefrontale.",
            "ACETILCOLINA": "Modulatore della plasticità sinaptica. Fondamentale per la memoria a lungo termine e l'attenzione sostenuta.",
            "GABA": "Neurotrasmettitore inibitorio. Riduce l'eccitabilità neuronale, stabilizzando il sistema nervoso contro lo stress.",
            "MELATONINA": "Indoloammina pineale. Regola il ritmo circadiano e agisce come potente antiossidante mitocondriale.",
            "CORTISOLO": "Glucocorticoide del risveglio: eleva la glicemia e prepara il corpo allo stress metabolico diurno.",
            "ADRENALINA": "Epinefrina: attiva il sistema simpatico. Aumenta la gittata cardiaca per una risposta fisica immediata.",
            "INSULINA": "Ormone anabolico pancreatico. Regola l'omeostasi del glucosio e l'uptake cellulare di aminoacidi.",
            "SOMATOTROPINA": "Ormone della crescita (GH). Cruciale per la riparazione dei tessuti e il metabolismo lipidico notturno.",
            "ADENOSINA": "Sottoprodotto del metabolismo energetico (ATP). Il suo accumulo crea la pressione omeostatica del sonno.",
            // --- CONSIGLI (data[3] & Dynamic) ---
            "LUCE NATURALE": "Esposizione precoce ai fotoni solari per sopprimere l'inerzia del sonno e resettare i ritmi circadiani.",
            "COLAZIONE PROT.": "L'apporto proteico mattutino fornisce precursori aminoacidici per la sintesi dei neurotrasmettitori.",
            "FOCUS ATTIVO": "Finestra di massima vigilanza cognitiva e coordinazione neuromuscolare.",
            "PAUSA NUTRIZIONE": "Sincronizzazione degli orologi periferici (fegato/pancreas) tramite l'assunzione controllata di nutrienti.",
            "FOCUS ANALITICO": "Fase ottimale per compiti di precisione e logica, supportata dalla stabilità dell'acetilcolina.",
            "MOVIMENTO": "Attività fisica per sfruttare il picco di temperatura corporea e forza muscolare pomeridiana.",
            "DECOMPRESSIONE": "Riduzione degli stimoli simpatici per favorire la transizione verso il sistema parasimpatico.",
            "RELAX ATTIVO": "Attività a basso impatto per facilitare lo smaltimento del cortisolo residuo.",
            "NO LUCE BLU": "Blocco delle frequenze luminose 450-480nm per prevenire l'inibizione della melatonina.",
            "BUIO TOTALE": "Assenza di fotoni per stimolare la ghiandola pineale e massimizzare la secrezione di melatonina.",
            "LUCE ART. 10K LUX": "Fotobiomodulazione invernale: simula lo spettro solare per resettare l'orologio circadiano.",
            "SOLE DIRETTO 10M": "L'esposizione ai fotoni solari mattutini ottimizza il rilascio di melatonina circa 14 ore dopo.",
            "INTEGRA VITAMINA D": "Supporto fondamentale per l'espressione genica circadiana e il sistema immunitario.",
            "IDRATAZIONE + SALI": "Ripristino degli elettroliti per mantenere il potenziale d'azione neuronale durante il calore estivo.",
            "THERMO-RELAX (CALDO)": "Il calore superficiale favorisce la vasodilatazione periferica, abbassando la temperatura centrale per il sonno.",
            "default": "Dato bio-sincronizzato in tempo reale tramite modulo Biotech Core."
        },
        en: {
            // --- STATE LABELS (data[0]) ---
            "GLYMPHATIC REGEN": "GLYMPHATIC SYSTEM: CNS clearance mechanism. During sleep, astrocytes facilitate metabolic waste flushing via cerebrospinal fluid.",
            "CORTISOL SPIKE": "Peak adrenal activation phase to elevate blood glucose and prepare the body for daytime energy demands.",
            "HIGH VIGILANCE": "Optimal cognitive alertness state driven by orexin stability and low adenosine load.",
            "MAX ALERTNESS": "Window of maximum neural processing speed and coordination. Peak body temperature and dopamine levels.",
            "LEPTIN RESPONSE": "Hormonal satiety signal shifting metabolism toward storage and post-prandial recovery.",
            "COGNITIVE MAINT.": "Attention stabilization phase supported by acetylcholine before the afternoon metabolic dip.",
            "PHYSICAL PEAK": "Maximum cardiovascular efficiency and muscle strength. Heart and lungs operate at peak capacity.",
            "ANABOLIC WINDOW": "Optimal period for cellular repair and protein synthesis driven by insulin management.",
            "NEURONAL CALM": "Transition to the parasympathetic system. Heart rate reduction and preparation for melatonin release.",
            "MELATONIN ONSET": "Onset of pineal secretion signaling the beginning of the biological night to the body.",
            "TISSUE REPAIR": "Deep regenerative process mediated by growth hormone (GH) during early sleep stages.",
            // --- MOLECULES (data[2]) ---
            "OREXIN": "Hypothalamic neuropeptide that stabilizes wakefulness and regulates appetite. Key for sleep-wake cycle stability.",
            "LEPTIN": "Satiety hormone produced by adipose tissue. It signals the state of energy reserves to the brain.",
            "DOPAMINE": "Reward and motivation neurotransmitter. Optimizes executive functions in the prefrontal cortex.",
            "ACETYLCHOLINE": "Synaptic plasticity modulator. Essential for long-term memory and sustained attention.",
            "GABA": "Inhibitory neurotransmitter. Reduces neuronal excitability, stabilizing the nervous system against stress.",
            "MELATONIN": "Pineal indoleamine. Regulates circadian rhythms and acts as a powerful mitochondrial antioxidant.",
            "CORTISOL": "Awakening glucocorticoid: elevates blood glucose and prepares the body for diurnal metabolic stress.",
            "ADRENALINE": "Epinephrine: activates the sympathetic system. Increases cardiac output for immediate physical response.",
            "INSULIN": "Anabolic pancreatic hormone. Regulates glucose homeostasis and cellular amino acid uptake.",
            "SOMATOTROPIN": "Growth Hormone (GH). Crucial for tissue repair and nocturnal lipid metabolism.",
            "ADENOSINE": "ATP energy metabolism byproduct. Its accumulation creates homeostatic sleep pressure.",
            // --- ADVICE (data[3] & Dynamic) ---
            "NATURAL LIGHT": "Early exposure to solar photons to suppress sleep inertia and reset circadian rhythms.",
            "PROTEIN BREAKFAST": "Morning protein intake provides amino acid precursors for neurotransmitter synthesis.",
            "ACTIVE FOCUS": "Window of maximum cognitive alertness and neuromuscular coordination.",
            "NUTRITION BREAK": "Synchronization of peripheral clocks (liver/pancreas) through controlled nutrient intake.",
            "ANALYTICAL FOCUS": "Optimal phase for precision and logic tasks, supported by acetylcholine stability.",
            "WORKOUT": "Physical activity to leverage the afternoon peak in body temperature and muscle strength.",
            "DOWNTIME": "Reduction of sympathetic stimuli to favor the transition toward the parasympathetic system.",
            "ACTIVE RELAX": "Low-impact activity to facilitate the clearance of residual cortisol.",
            "NO BLUE LIGHT": "Blocking 450-480nm light frequencies to prevent melatonin inhibition.",
            "TOTAL DARKNESS": "Absence of photons to stimulate the pineal gland and maximize melatonin secretion.",
            // --- DYNAMIC ADVICE KEYS (Matches getDynamicAdvice) ---
            "10K LUX ART. LIGHT": "Winter photobiomodulation: simulates the solar spectrum to reset the circadian clock.",
            "DIRECT SUN 10M": "Morning photon exposure optimizes melatonin release approximately 14 hours later.",
            "VITAMIN D INTAKE": "Critical support for circadian gene expression and the immune system.",
            "HYDRATION + SALTS": "Electrolyte restoration to maintain neuronal action potential during summer heat.",
            "WARM THERMO-RELAX": "Surface heat promotes peripheral vasodilation, lowering core temperature for sleep induction.",
            "default": "Bio-synchronized data via Biotech Core module."
        }
    };

    // --- 1. ANNUAL CYCLE & SEASON MONITOR ---
function initSeasonMonitor() {
    const countdownEl = document.getElementById('modern-countdown');
    if (!countdownEl) return;

    // RILEVAZIONE LINGUA SINCRONIZZATA
    const currentLang = localStorage.getItem('preferred-language') || 
                       (navigator.language.startsWith('en') ? 'en' : 'it');
    const isIt = currentLang === 'it';

    let dataDisplay = document.getElementById('bio-data-display') || document.createElement('div');
    if (!dataDisplay.id) {
        dataDisplay.id = 'bio-data-display';
        countdownEl.innerHTML = '';
        countdownEl.appendChild(dataDisplay);
    }

    const lang = {
        seasons: isIt 
            ? { spring: "PRIMAVERA", summer: "ESTATE", autumn: "AUTUNNO", winter: "INVERNO" }
            : { spring: "SPRING", summer: "SUMMER", autumn: "AUTUMN", winter: "WINTER" },
        phase: isIt ? "FASE CICLO" : "CYCLE PHASE"
    };

    const updateBioCycle = () => {
        const now = new Date();
        const year = now.getFullYear();
        const seasonKey = getCurrentSeason();
        const start = new Date(year, 0, 1);
        const end = new Date(year + 1, 0, 1);
        const progress = ((now - start) / (end - start)) * 100;
        const daysLeft = Math.floor((end - now) / 86400000);

        dataDisplay.innerHTML = `
            <div class="bio-season-label" data-bio-tip="${isIt ? 'Monitoraggio dell\'inclinazione assiale terrestre e impatto metabolico.' : 'Earth axial tilt monitoring and metabolic impact.'}">${lang.seasons[seasonKey]} ${lang.phase}</div>
            <div class="bio-progress-data">
                ${progress.toFixed(2)}% 
                <span class="bio-t-minus">| T-MINUS: ${daysLeft}${isIt ? 'G' : 'D'}</span>
            </div>
        `;
    };
    updateBioCycle();
    setInterval(updateBioCycle, 3600000);
}

    // --- 2. OROLOGIO BIO-CIRCADIANO ---
    function initBioClock() {
        const clockEl = document.getElementById('clock2');
        if (!clockEl) return;

        const circadianMap = {
            0:  { it: ["RIGENERAZIONE GLINFATICA", "PULIZIA CEREBRALE", "ADENOSINA", "BUIO TOTALE"], en: ["GLYMPHATIC REGEN", "BRAIN CLEARANCE", "ADENOSINE", "TOTAL DARKNESS"] },
            3:  { it: ["PICCO SOMATOTROPINA", "RIPARAZIONE TESSUTI", "SOMATOTROPINA", "SOGNO PROFONDO"], en: ["GH PEAK", "TISSUE REPAIR", "SOMATOTROPIN", "DEEP DREAMING"] },
            6:  { it: ["PICCO DI CORTISOLO", "RESET CIRCADIANO", "CORTISOLO", "LUCE NATURALE"], en: ["CORTISOL SPIKE", "CIRCADIAN RESET", "CORTISOL", "NATURAL LIGHT"] },
            9:  { it: ["ATTIVAZIONE ORESSINA", "VIGILANZA ELEVATA", "ORESSINA", "COLAZIONE PROT."], en: ["OREXIN ACTIVATION", "HIGH VIGILANCE", "OREXIN", "PROTEIN BREAKFAST"] },
            11: { it: ["MASSIMA ALLERTA", "PICCO COGNITIVO", "DOPAMINA", "FOCUS ATTIVO"], en: ["MAX ALERTNESS", "COGNITIVE PEAK", "DOPAMINE", "ACTIVE FOCUS"] },
            13: { it: ["RISPOSTA LEPTINICA", "SAZIETÀ METABOLICA", "LEPTINA", "PAUSA NUTRIZIONE"], en: ["LEPTIN RESPONSE", "METABOLIC SATIETY", "LEPTIN", "NUTRITION BREAK"] },
            15: { it: ["MANTENIMENTO COGNITIVO", "STABILITÀ SINAPTICA", "ACETILCOLINA", "FOCUS ANALITICO"], en: ["COGNITIVE MAINT.", "SYNAPTIC STABILITY", "ACETYLCHOLINE", "ANALYTICAL FOCUS"] },
            17: { it: ["PICCO FISICO", "EFFICIENZA MAX", "ADRENALINA", "MOVIMENTO"], en: ["PHYSICAL PEAK", "EFFICIENCY MAX", "ADRENALINE", "WORKOUT"] },
            19: { it: ["FINESTRA ANABOLICA", "SINTESI PROTEICA", "INSULINA", "DECOMPRESSIONE"], en: ["ANABOLIC WINDOW", "PROTEIN SYNTHESIS", "INSULIN", "DOWNTIME"] },
            21: { it: ["CALMA NEURONALE", "MODALITÀ RECUPERO", "GABA", "RELAX ATTIVO"], en: ["NEURONAL CALM", "RECOVERY MODE", "GABA", "ACTIVE RELAX"] },
            23: { it: ["RILASCIO MELATONINA", "INIZIO PULIZIA", "MELATONINA", "NO LUCE BLU"], en: ["MELATONIN ONSET", "CLEARANCE START", "MELATONIN", "NO BLUE LIGHT"] }
        };

        const getDynamicAdvice = (h, base) => {
    const s = getCurrentSeason();
    if (h >= 6 && h < 9) {
        if (s === "winter") return isIt ? "LUCE ART. 10K LUX" : "10K LUX ART. LIGHT";
        if (s === "summer") return isIt ? "SOLE DIRETTO 10M" : "DIRECT SUN 10M";
    }
    // NOTA: Qui usiamo le chiavi esatte del dizionario EN
    if (h >= 10 && h < 13 && (s === "winter" || s === "autumn")) 
        return isIt ? "INTEGRA VITAMINA D" : "VITAMIN D INTAKE";
    
    if (h >= 13 && h < 17 && s === "summer") 
        return isIt ? "IDRATAZIONE + SALI" : "HYDRATION + SALTS";
    
    if (h >= 20 && s === "winter") 
        return isIt ? "THERMO-RELAX (CALDO)" : "WARM THERMO-RELAX";
        
    return base;
};

        const updateClock = () => {
    const now = new Date();
    const hour = now.getHours();
    const keys = Object.keys(circadianMap).map(Number).reverse();
    const currentKey = keys.find(k => hour >= k) || 0;
    
    // 1. Recupera i dati (IT o EN) in base alla lingua attiva
    const data = circadianMap[currentKey][isIt ? 'it' : 'en'];
    
    // 2. Recupera il consiglio dinamico e genera la stringa oraria
    const advice = getDynamicAdvice(hour, data[3]);
    const timeStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} | ${pad(hour)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    // 3. Seleziona il dizionario corretto
    const dict = isIt ? bioExplanations.it : bioExplanations.en;

    // 4. RICERCA TOOLTIP: Usa il testo visualizzato (data[2] e advice) come chiave
    const molecolaKey = data[2].toUpperCase().trim();
    const adviceKey = advice.toUpperCase().trim();

    const molecolaDesc = dict[molecolaKey] || dict["default"];
    const adviceDesc = dict[adviceKey] || dict["default"];

    // 5. GESTIONE STATO / GLINFATICO
    let statusDesc;
    if (hour < 6 || hour >= 23) {
        // Se è notte, cerca la chiave specifica per il Sistema Glinfatico nella lingua attiva
        const glinfaticKey = isIt ? "RIGENERAZIONE GLINFATICA" : "GLYMPHATIC REGEN";
        statusDesc = dict[glinfaticKey] || dict["default"];
    } else {
        // Durante il giorno, usa il nome dello stato visualizzato (data[0]) come chiave
        const statusKey = data[0].toUpperCase().trim();
        statusDesc = dict[statusKey] || (isIt ? "Stato attuale dei processi biologici." : "Current state of biological processes.");
    }

    // 6. RENDERING HTML
    clockEl.innerHTML = `
        <div class="hud-inline-row">
            <span data-bio-tip="${molecolaDesc}">${isIt ? 'MOLECOLA' : 'MOLECULE'}: <b class="bio-data-value">${data[2]}</b></span>
            <span class="separator">|</span>
            <span data-bio-tip="${adviceDesc}">${isIt ? 'CONSIGLIO' : 'ADVICE'}: <b class="bio-data-value">${advice}</b></span>
        </div>
        <span class="bio-status-label" data-bio-tip="${statusDesc}">${data[0]}</span>
        <span class="bio-clock-time">${timeStr}</span>
        <span class="bio-system-state" data-bio-tip="${isIt ? 'Stato operativo Biotech Core.' : 'Biotech Core operational state.'}">SYS STATE: ${data[1]}</span>
    `;
};
        updateClock();
        setInterval(updateClock, 1000);
    }

    // --- 3. SALUTO SETTIMANALE ---
    function initWeeklyGreeting() {
        const weekElement = document.getElementById("week");
        if (!weekElement) return;

        const createSpans = (text, start) => text.split('').map((char, index) => 
            `<span style='--i:${start + index}'>${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');

        const messages = {
            it: ['buona domenica!', 'buon lunedì!', 'buon martedì!', 'buon mercoledì!', 'buon giovedì!', 'buon venerdì!', 'buon sabato!'],
            en: ['happy sunday!', 'happy monday!', 'happy tuesday!', 'happy wednesday!', 'happy thursday!', 'happy friday!', 'happy saturday!']
        };
        const titles = { it: 'Biotech Project vi augura ', en: 'Biotech Project wishes you ' };
        const greetings = {
            it: ['Buonanotte', 'Buongiorno', 'Buon pomeriggio', 'Buonasera'],
            en: ['Good night', 'Good morning', 'Good afternoon', 'Good evening']
        };

        const langKey = isIt ? 'it' : 'en';
        const now = new Date();
        const hour = now.getHours();
        const today = now.getDay();

        let gIdx = hour < 6 ? 0 : hour < 14 ? 1 : hour < 18 ? 2 : 3;
        const message = messages[langKey][today];
        const title = titles[langKey];
        const greeting = greetings[langKey][gIdx];

        window.requestAnimationFrame(() => {
            const daySpans = createSpans(message, 26);
            const titleSpans = createSpans(title, 1);
            weekElement.innerHTML = `<div class="greeting-time">${greeting}</div>${titleSpans + daySpans}`;
        });
    }    

    // --- 4. TOOLTIP BIO-INFO (UNIFICATO) ---
    function initBiotechTooltips() {
        let tooltipEl = document.querySelector('.biotech-tooltip');
        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.className = 'biotech-tooltip'; 
            document.body.appendChild(tooltipEl);
        }

        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('[data-bio-tip]');
            if (target) {
                tooltipEl.textContent = target.getAttribute('data-bio-tip');
                tooltipEl.style.display = 'block';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (tooltipEl.style.display === 'block') {
                tooltipEl.style.left = e.clientX + 'px';
                tooltipEl.style.top = (e.clientY + 25) + 'px';
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('[data-bio-tip]')) {
                tooltipEl.style.display = 'none';
            }
        });
    }

    // --- ESECUZIONE ---
    initSeasonMonitor();
    initBioClock();
    initWeeklyGreeting();
    initBiotechTooltips();
});
// Fine Biotech Core Engine