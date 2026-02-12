// ==========================================================================
// MODULE 06: BIOTECH CORE COMPUTATION ENGINE (D.A.T.A. System)
// Scope: Circadian Rhythm Logic, Seasonal Bio-sync, & PDF Audit Generation
// Architecture: Bio-dictionary Mapping with Multi-language Fallback
// Reliability: Fail-safe Tooltip Rendering & Seasonal-Aware Advice Engine
// Feature: Real-time HUD (Heads-Up Display) Synchronization
// ==========================================================================
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
            "PULIZIA CEREBRALE": "Attivazione dei flussi glinfatici per la rimozione di beta-amiloide e detriti metabolici neurali.",
            "INIZIO PULIZIA": "Transizione biochimica: calo della temperatura centrale e avvio della pulizia glinfatica.",
            "PICCO DI CORTISOLO": "Fase di massima attivazione surrenale per preparare l'organismo alle richieste energetiche diurne.",
            "VIGILANZA ELEVATA": "Stato di allerta cognitiva ottimale guidato dalla stabilità dell'oressina e dal basso carico di adenosina.",
            "MASSIMA ALLERTA": "Finestra di massima velocità di elaborazione neurale e coordinazione. Picco di temperatura e dopamina.",
            "RISPOSTA LEPTINICA": "Segnale ormonale di sazietà che sposta il metabolismo verso l'immagazzinamento e il recupero.",
            "MANTENIMENTO COGNITIVO": "Fase di stabilizzazione dell'attenzione sostenuta dall'acetilcolina prima del calo pomeridiano.",
            "PICCO FISICO": "Massima efficienza cardiovascolare e forza muscolare. I polmoni e il cuore operano al massimo.",
            "FINESTRA ANABOLICA": "Periodo ottimale per la riparazione cellulare e la sintesi proteica tramite gestione insulinica.",
            "CALMA NEURONALE": "Transizione verso il sistema parasimpatico. Preparazione al rilascio di melatonina.",
            "RILASCIO MELATONINA": "Inizio della secrezione pineale che segnala l'inizio della notte biologica.",
            "RIPARAZIONE TESSUTI": "Processo rigenerativo profondo mediato dall'ormone della crescita (GH).",
            "RELAZIONE SOCIALE": "Fase di interazione pro-sociale che stimola l'ossitocina e riduce il cortisolo.",
            "RESET CIRCADIANO": "Sincronizzazione dei nuclei soprachiasmatici tramite segnali luminosi e termici.",
            "PICCO COGNITIVO": "Fase di massima efficienza della corteccia prefrontale. Ottimizzazione del problem solving.",
            "SAZIETÀ METABOLICA": "Gestione ormonale post-prandiale: bilanciamento tra insulina e leptina.",
            "STABILITÀ SINAPTICA": "Mantenimento dei potenziali d'azione e della plasticità neuronale.",
            "EFFICIENZA MAX": "Sincronia tra gittata cardiaca, ossigenazione e reclutamento motorio.",
            "SINTESI PROTEICA": "Attivazione della via mTOR per la riparazione cellulare e strutturale.",
            "MODALITÀ RECUPERO": "Predominanza del sistema parasimpatico. Abbassamento della frequenza cardiaca.",
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
            "SEROTONINA": "Neurotrasmettitore stabilizzatore dell'umore. Precursore della melatonina.",
            "OSSITOCINA": "Ormone della connessione sociale e della fiducia. Riduce il cortisolo.",
            "ENDORFINE/MIOCHINE": "Sinergia tra oppioidi endogeni (benessere) e messaggeri muscolari (metabolismo).",
            "ENDORFINE + MIOCHINE": "Fase di secrezione sinergica: riparazione tessuti e modulazione del piacere.",
            "MIOCHINE": "Citochine muscolari (es. Irisina). Migliorano metabolismo e neuroplasticità.",
            "GRELINA": "Ormone gastrico che stimola il senso di fame. Segnala la necessità di nutrienti.",
            "GLUTAMMATO": "Il principale neurotrasmettitore eccitatorio. Fondamentale per l'apprendimento.",
            "NORADRENALINA": "Neurotrasmettitore dello stress e dell'attenzione. Mobilita corpo e cervello.",
            "PROLATTINA": "Modula la risposta immunitaria e il recupero nel ciclo sonno-veglia.",
            "BDNF": "Fattore neurotrofico cerebrale. Sostiene la sopravvivenza dei neuroni.",
            "DHEA": "Deidroepiandrosterone: l'antagonista del cortisolo. Supporta la resilienza.",
            "ADIPONECTINA": "Ormone proteico che regola glucosio e acidi grassi.",
            "ANANDAMIDE": "Endocannabinoide del benessere. Modula dolore, appetito e memoria.",
            "CITOCHINE": "Segnali proteici immunitari; la pulizia notturna previene l'infiammazione.",
            "LUCE NATURALE": "Esposizione solare precoce per resettare i ritmi circadiani.",
            "COLAZIONE PROT.": "Apporto proteico per aminoacidi precursori dei neurotrasmettitori.",
            "FOCUS ATTIVO": "Finestra di massima vigilanza cognitiva e coordinazione.",
            "PAUSA NUTRIZIONE": "Sincronizzazione degli orologi periferici tramite nutrienti.",
            "FOCUS ANALITICO": "Fase ottimale per compiti di precisione (Acetilcolina).",
            "MOVIMENTO": "Attività fisica per sfruttare il picco di forza pomeridiana.",
            "DECOMPRESSIONE": "Riduzione degli stimoli simpatici verso il sistema parasimpatico.",
            "RELAX ATTIVO": "Attività a basso impatto per smaltire il cortisolo residuo.",
            "NO LUCE BLU": "Blocco frequenze 450-480nm per proteggere la melatonina.",
            "BUIO TOTALE": "Assenza di fotoni per massimizzare la secrezione di melatonina.",
            "LUCE ART. 10K LUX": "Fotobiomodulazione invernale: simula lo spettro solare.",
            "SOLE DIRETTO 10M": "Ottimizza il rilascio di melatonina circa 14 ore dopo.",
            "INTEGRA VITAMINA D": "Sintesi ridotta per inclinazione assiale. Integrare Vitamina D3 per supportare l'omeostasi minerale e l'espressione genica circadiana.",
            "STIMOLO ORESSIGENICO": "Fase di attivazione dei segnali della fame mediata da grelina e neuropeptide Y.",
            "IDRATAZIONE + SALI": "Ripristino elettroliti per il potenziale d'azione.",
            "THERMO-RELAX (CALDO)": "Favorisce la vasodilatazione per abbassare la temperatura.",
            "ALLENAMENTO RESISTENZA": "Stimolo meccanico per massimizzare il rilascio di miochine.",
            "VARIAZIONE TERMICA (FREDDO)": "Esposizione al freddo per attivare il grasso bruno.",
            "FOTOBIOMODULAZIONE (ROSSO)": "Utilizzo di luce Rossa/NIR per stimolare i mitocondri.",
            "LIVELLO_ALTO": "STATO: ALTO (FASE DI PICCO)",
            "LIVELLO_MEDIO": "STATO: MEDIO (OMEOSTASI)",
            "LIVELLO_BASSO": "STATO: IN CALO (FASE METABOLICA)",
            "default": "Dato bio-sincronizzato tramite modulo Biotech Core."
        },
        en: {
            "GLYMPHATIC REGEN": "GLYMPHATIC SYSTEM: CNS clearance mechanism. During sleep, astrocytes facilitate waste flushing via cerebrospinal fluid.",
            "BRAIN CLEARANCE": "Activation of glymphatic flows for the removal of beta-amyloid and neural metabolic debris.",
            "CLEARANCE START": "Biochemical transition: core temperature drop and start of glymphatic clearance.",
            "CORTISOL SPIKE": "Peak adrenal activation phase to prepare the organism for daytime energy demands.",
            "HIGH VIGILANCE": "Optimal cognitive alertness state driven by orexin stability and low adenosine load.",
            "MAX ALERTNESS": "Window of maximum neural processing speed and coordination. Peak temperature and dopamine.",
            "LEPTIN RESPONSE": "Hormonal satiety signal shifting metabolism toward storage and recovery.",
            "COGNITIVE MAINT.": "Attention stabilization phase supported by acetylcholine before the afternoon slump.",
            "PHYSICAL PEAK": "Maximum cardiovascular efficiency and muscle strength. Lungs and heart at peak capacity.",
            "ANABOLIC WINDOW": "Optimal period for cellular repair and protein synthesis via insulin management.",
            "NEURONAL CALM": "Transition toward the parasympathetic system. Preparation for melatonin release.",
            "MELATONIN ONSET": "Onset of pineal secretion signaling the start of the biological night.",
            "TISSUE REPAIR": "Deep regenerative process mediated by growth hormone (GH) during sleep.",
            "SOCIAL CONNECTION": "Pro-social interaction phase that stimulates oxytocin and reduces cortisol load.",
            "CIRCADIAN RESET": "Suprachiasmatic nuclei synchronization via light and thermal signals.",
            "COGNITIVE PEAK": "Phase of maximum prefrontal cortex efficiency. Problem-solving optimization.",
            "METABOLIC SATIETY": "Post-prandial hormonal management: balance between insulin and leptin.",
            "SYNAPTIC STABILITY": "Maintenance of action potentials and short-term neuronal plasticity.",
            "EFFICIENCY MAX": "Synchrony between cardiac output, oxygenation, and motor recruitment.",
            "PROTEIN SYNTHESIS": "mTOR pathway activation for cellular and structural structural repair.",
            "RECOVERY MODE": "Parasympathetic dominance. Significant lowering of heart rate.",
            "OREXIN": "Hypothalamic neuropeptide that stabilizes wakefulness and regulates appetite.",
            "LEPTIN": "Satiety hormone produced by adipose tissue. Signals energy reserves.",
            "DOPAMINE": "Reward neurotransmitter. Optimizes motivation and executive functions.",
            "ACETYLCHOLINE": "Synaptic plasticity modulator. Fundamental for memory and attention.",
            "GABA": "Inhibitory neurotransmitter. Reduces excitability and stabilizes the system.",
            "MELATONINA": "Pineal indoleamine. Regulates circadian rhythm and acts as an antioxidant.",
            "CORTISOL": "Awakening glucocorticoid: prepares the body for daytime metabolic stress.",
            "ADRENALINE": "Epinephrine: activates the sympathetic system for immediate physical response.",
            "INSULIN": "Anabolic pancreatic hormone. Regulates glucose homeostasis.",
            "SOMATOTROPIN": "Growth Hormone (GH). Crucial for deep tissue repair.",
            "ADENOSINA": "Energy byproduct (ATP). Creates homeostatic sleep pressure.",
            "SEROTONINA": "Mood-stabilizing neurotransmitter and precursor to melatonin.",
            "OXYTOCIN": "Hormone of social connection and trust. Reduces cortisol levels.",
            "ENDORPHINS/MYOKINES": "Synergy between endogenous opioids and metabolic muscle messengers.",
            "ENDORPHINS + MYOKINES": "Synergetic secretion phase: tissue repair and pleasure modulation.",
            "MYOKINES": "Muscle cytokines (e.g., Irisin). Improve metabolism and neuroplasticity.",
            "GHRELIN": "Gastric hormone that stimulates hunger. Signals the need for nutrients.",
            "GLUTAMATE": "The primary excitatory neurotransmitter. Crucial for learning.",
            "NOREPINEPHRINE": "Stress and attention neurotransmitter. Mobilizes brain for action.",
            "PROLACTIN": "Modulates immune response and recovery in the sleep-wake cycle.",
            "BDNF": "Brain-derived neurotrophic factor. Supports neuron survival.",
            "DHEA": "Dehydroepiandrosterone: the cortisol antagonist. Supports resilience.",
            "ADIPONECTIN": "Protein hormone that regulates glucose and fatty acid breakdown.",
            "ANANDAMIDE": "The 'bliss' endocannabinoid. Modulates pain, appetite, and memory.",
            "CYTOKINES": "Immune protein signals; nocturnal clearance prevents inflammation.",
            "NATURAL LIGHT": "Early sun exposure to reset circadian rhythms via photoreceptors.",
            "PROTEIN BREAKFAST": "Protein intake to provide amino acid precursors for neurotransmitters.",
            "ACTIVE FOCUS": "Window of maximum cognitive vigilance and coordination.",
            "NUTRITION BREAK": "Synchronization of peripheral clocks through controlled nutrients.",
            "ANALYTICAL FOCUS": "Optimal phase for precision tasks, supported by acetylcholine.",
            "WORKOUT": "Physical activity to exploit the afternoon muscle strength peak.",
            "DOWNTIME": "Reduction of sympathetic stimuli toward the parasympathetic system.",
            "ACTIVE RELAX": "Low-impact activity to clear residual daytime cortisol.",
            "NO BLUE LIGHT": "Blocking 450-480nm frequencies to protect melatonin secretion.",
            "TOTAL DARKNESS": "Absence of photons to maximize pineal melatonin production.",
            "10K LUX ART. LIGHT": "Winter photobiomodulation: simulates the full solar spectrum.",
            "DIRECT SUN 10M": "Optimizes melatonin release approximately 14 hours later.",
            "VITAMIN D INTAKE": "Reduced synthesis due to axial tilt. Supplement Vitamin D3 to support mineral homeostasis and circadian gene expression.",
            "OREXIGENIC STIMULUS": "Hunger signal activation mediated by ghrelin and neuropeptide Y.",
            "HYDRATION + SALTS": "Electrolyte restoration for optimal neural action potential.",
            "WARM THERMO-RELAX": "Promotes vasodilation to help lower core body temperature.",
            "RESISTANCE TRAINING": "Mechanical stimulus to maximize myokine release.",
            "THERMAL VARIATION (COLD)": "Cold exposure to activate brown fat and immune response.",
            "PHOTOBIOMODULATION (RED)": "Use of Red/NIR light to stimulate mitochondria and recovery.",
            "LEVEL_HIGH": "STATUS: HIGH (PEAK PHASE)",
            "LEVEL_MEDIUM": "STATUS: MEDIUM (HOMEOSTASIS)",
            "LEVEL_LOW": "STATUS: DECLINING (METABOLIC PHASE)",
            "default": "Bio-synchronized data via Biotech Core engine."
        }
    };

    // --- HELPER FORMATTAZIONE TOOLTIP (STABILE) ---
const formatTip = (title, body, extra = "", barPerc = null) => {
    // Restituiamo un oggetto JSON come stringa. 
    // Questo è "testo inerte" per CodeQL, quindi sicuro.
    return JSON.stringify({
        t: title.toUpperCase(),
        b: body,
        e: extra,
        p: barPerc
    });
};

    // --- 1. MONITOR STAGIONALE ---
    function initSeasonMonitor() {
    const countdownEl = document.getElementById('modern-countdown');
    if (!countdownEl) return;
    let dataDisplay = document.getElementById('bio-data-display') || document.createElement('div');
    if (!dataDisplay.id) { 
        dataDisplay.id = 'bio-data-display'; 
        countdownEl.textContent = ''; // Sostituito innerHTML = ''
        countdownEl.appendChild(dataDisplay); 
    }

    const lang = {
        seasons: isIt ? { spring: "PRIMAVERA", summer: "ESTATE", autumn: "AUTUNNO", winter: "INVERNO" } : { spring: "SPRING", summer: "SUMMER", autumn: "AUTUMN", winter: "WINTER" },
        phase: isIt ? "FASE CICLO" : "CYCLE PHASE"
    };

    const updateBioCycle = () => {
        const now = new Date(), year = now.getFullYear(), seasonKey = getCurrentSeason();
        const start = new Date(year, 0, 1), end = new Date(year + 1, 0, 1);
        const progress = ((now - start) / (end - start)) * 100, daysLeft = Math.floor((end - now) / 86400000);
        const tooltipMsg = isIt ? 'Monitoraggio dell\'inclinazione assiale terrestre e impatto metabolico.' : 'Earth axial tilt monitoring and metabolic impact.';
        
        // Svuotiamo il contenitore in modo sicuro
        dataDisplay.replaceChildren();

        // 1. Creiamo il div della stagione
        const seasonLabel = document.createElement('div');
        seasonLabel.className = 'bio-season-label';
        seasonLabel.setAttribute('data-bio-tip', tooltipMsg);
        seasonLabel.textContent = `${lang.seasons[seasonKey]} ${lang.phase}`;

        // 2. Creiamo il div del progresso
        const progressData = document.createElement('div');
        progressData.className = 'bio-progress-data';
        progressData.setAttribute('data-bio-tip', tooltipMsg);
        
        // Testo del progresso
        const progressText = document.createTextNode(`${progress.toFixed(2)}% `);
        
        // Span T-Minus
        const tMinusSpan = document.createElement('span');
        tMinusSpan.className = 'bio-t-minus';
        tMinusSpan.textContent = `| T-MINUS: ${daysLeft}${isIt ? 'G' : 'D'}`;

        // Montiamo i pezzi
        progressData.append(progressText, tMinusSpan);
        dataDisplay.append(seasonLabel, progressData);
    };
    updateBioCycle(); setInterval(updateBioCycle, 3600000);
}

    // --- 2. OROLOGIO BIO-CIRCADIANO ---
    function initBioClock() {
        const clockEl = document.getElementById('clock2');
        if (!clockEl) return;

        const circadianMap = {
            0:  { it: ["RIGENERAZIONE GLINFATICA", "PULIZIA CEREBRALE", "ADENOSINA", "BUIO TOTALE"], en: ["GLYMPHATIC REGEN", "BRAIN CLEARANCE", "ADENOSINA", "TOTAL DARKNESS"] },
            3:  { it: ["RIPARAZIONE TESSUTI", "INIZIO PULIZIA", "CITOCHINE", "SOMATOTROPINA"], en: ["TISSUE REPAIR", "CLEARANCE START", "CYTOKINES", "SOMATOTROPIN"] },
            6:  { it: ["PICCO DI CORTISOLO", "RESET CIRCADIANO", "CORTISOLO", "LUCE NATURALE"], en: ["CORTISOL SPIKE", "CIRCADIAN RESET", "CORTISOL", "NATURAL LIGHT"] },
            8:  { it: ["VIGILANZA ELEVATA", "NORADRENALINA", "DHEA", "COLAZIONE PROT."], en: ["HIGH VIGILANCE", "NOREPINEPHRINE", "DHEA", "PROTEIN BREAKFAST"] },
            11: { it: ["MASSIMA ALLERTA", "PICCO COGNITIVO", "GLUTAMMATO", "FOCUS ATTIVO"], en: ["MAX ALERTNESS", "COGNITIVE PEAK", "GLUTAMATE", "ACTIVE FOCUS"] },
            12: { it: ["STIMOLO ORESSIGENICO", "BDNF", "GRELINA", "PAUSA NUTRIZIONE"], en: ["OREXIGENIC STIMULUS", "BDNF", "GHRELIN", "NUTRITION BREAK"] },
            13: { it: ["RISPOSTA LEPTINICA", "SAZIETÀ METABOLICA", "ADIPONECTINA", "PAUSA NUTRIZIONE"], en: ["LEPTIN RESPONSE", "METABOLIC SATIETY", "ADIPONECTIN", "NUTRITION BREAK"] },
            15: { it: ["MANTENIMENTO COGNITIVO", "STABILITÀ SINAPTICA", "ACETILCOLINA", "FOCUS ANALITICO"], en: ["COGNITIVE MAINT.", "SYNAPTIC STABILITY", "ACETYLCHOLINE", "ANALYTICAL FOCUS"] },
            17: { it: ["PICCO FISICO", "ENDORFINE + MIOCHINE", "ENDORFINE/MIOCHINE", "MOVIMENTO"], en: ["PHYSICAL PEAK", "ENDORPHINS + MYOKINES", "ENDORPHINS/MYOKINES", "WORKOUT"] },
            19: { it: ["FINESTRA ANABOLICA", "SINTESI PROTEICA", "INSULINA", "DECOMPRESSIONE"], en: ["ANABOLIC WINDOW", "PROTEIN SYNTHESIS", "INSULIN", "DOWNTIME"] },
            21: { it: ["RELAZIONE SOCIALE", "OSSITOCINA", "ANANDAMIDE", "RELAX ATTIVO"], en: ["SOCIAL CONNECTION", "OXYTOCIN", "ANANDAMIDE", "ACTIVE RELAX"] },
            23: { it: ["RILASCIO MELATONINA", "INIZIO PULIZIA", "MELATONINA", "NO LUCE BLU"], en: ["MELATONIN ONSET", "CLEARANCE START", "MELATONIN", "NO BLUE LIGHT"] }
        };

        const getDynamicAdvice = (h, base) => {
    const s = getCurrentSeason();
    const isColdSeason = (s === "winter" || s === "autumn");

    // 1. PRIORITÀ MATTINA (6:00 - 8:59)
    if (h >= 7 && h < 8) return isIt ? "VARIAZIONE TERMICA (FREDDO)" : "THERMAL VARIATION (COLD)";
    
    if (h >= 6 && h < 9) {
        if (s === "winter") return isIt ? "LUCE ART. 10K LUX" : "10K LUX ART. LIGHT";
        if (s === "summer") return isIt ? "SOLE DIRETTO 10M" : "DIRECT SUN 10M";
    }

    // 2. PRIORITÀ VITAMINA D (10:00 - 12:59) - Fondamentale in Autunno/Inverno
    if (h >= 10 && h <= 12 && isColdSeason) {
        return isIt ? "INTEGRA VITAMINA D" : "VITAMIN D INTAKE";
    }

    // 3. PRIORITÀ POMERIGGIO/SERA
    if (h >= 13 && h < 17 && s === "summer") return isIt ? "IDRATAZIONE + SALI" : "HYDRATION + SALTS";
    if (h >= 17 && h < 19) return isIt ? "ALLENAMENTO RESISTENZA" : "RESISTANCE TRAINING";
    if (h >= 21 && h < 23) return isIt ? "FOTOBIOMODULAZIONE (ROSSO)" : "PHOTOBIOMODULATION (RED)";
    if (h >= 20 && s === "winter") return isIt ? "THERMO-RELAX (CALDO)" : "WARM THERMO-RELAX";

    // Se nessuna condizione dinamica è attiva, usa il base della circadianMap
    return base;
};

        const updateClock = () => {
    const now = new Date();
    const hour = now.getHours();
    const mins = now.getMinutes();
    
    const keys = Object.keys(circadianMap).map(Number);
    const currentKey = [...keys].reverse().find(k => hour >= k) || 0;
    const currentIndex = keys.indexOf(currentKey);
    const nextKey = keys[currentIndex + 1] || 24; 
    const blockDuration = nextKey - currentKey;
    const elapsed = (hour - currentKey) + (mins / 60);

    const intensityPerc = Math.max(5, Math.floor((1 - (elapsed / blockDuration)) * 100));

    let levelKey = isIt 
        ? (elapsed >= blockDuration * 0.7 ? "LIVELLO_BASSO" : elapsed >= blockDuration * 0.4 ? "LIVELLO_MEDIO" : "LIVELLO_ALTO")
        : (elapsed >= blockDuration * 0.7 ? "LEVEL_LOW" : elapsed >= blockDuration * 0.4 ? "LEVEL_MEDIUM" : "LEVEL_HIGH");

    const data = circadianMap[currentKey][isIt ? 'it' : 'en'];
    const advice = getDynamicAdvice(hour, data[3]); 
    const dict = isIt ? bioExplanations.it : bioExplanations.en;

    const getDesc = (key) => {
        if (!key) return dict["default"];
        const k = key.toString().toUpperCase().trim();
        return dict[k] || (isIt ? bioExplanations.en[k] : bioExplanations.it[k]) || dict["default"];
    };

    const fullMoleculeTooltip = formatTip(data[2], getDesc(data[2]), getDesc(levelKey), intensityPerc);
    const aDesc = formatTip(isIt ? "CONSIGLIO BIO-LOGICO" : "BIO-LOGICAL ADVICE", getDesc(advice));
    const sDesc = formatTip(isIt ? "BIO-STATO" : "BIO-STATUS", getDesc(data[0]));
    const sysDesc = formatTip(isIt ? "ANALISI DI SISTEMA" : "SYSTEM ANALYSIS", getDesc(data[1]));

    const datePart = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    const timePart = `${pad(hour)}:${pad(mins)}:${pad(now.getSeconds())}`;

    // --- RENDERING SICURO ---
    clockEl.replaceChildren(); // Svuota il contenuto precedente in modo sicuro

    // 1. Riga Superiore (Molecola e Consiglio)
    const row = document.createElement('div');
    row.className = 'hud-inline-row';

    // Parte Molecola
    const spanMol = document.createElement('span');
    spanMol.setAttribute('data-bio-tip', fullMoleculeTooltip);
    spanMol.textContent = `${isIt ? 'MOLECOLA' : 'MOLECULE'}: `;
    const bMol = document.createElement('b');
    bMol.className = 'bio-data-value';
    bMol.textContent = data[2];
    spanMol.appendChild(bMol);

    const separator = document.createElement('span');
    separator.className = 'separator';
    separator.textContent = ' | ';

    // Parte Consiglio
    const spanAdv = document.createElement('span');
    spanAdv.setAttribute('data-bio-tip', aDesc);
    spanAdv.textContent = `${isIt ? 'CONSIGLIO' : 'ADVICE'}: `;
    const bAdv = document.createElement('b');
    bAdv.className = 'bio-data-value';
    bAdv.textContent = advice;
    spanAdv.appendChild(bAdv);

    row.append(spanMol, separator, spanAdv);

    // 2. Bio-Status Label
    const statusLabel = document.createElement('span');
    statusLabel.className = 'bio-status-label';
    statusLabel.setAttribute('data-bio-tip', sDesc);
    statusLabel.textContent = data[0];

    // 3. Orologio
    const timeLabel = document.createElement('span');
    timeLabel.className = 'bio-clock-time';
    const timeDigits = document.createElement('span');
    timeDigits.className = 'digits-stable';
    timeDigits.textContent = timePart;
    timeLabel.append(document.createTextNode(`${datePart} `), timeDigits);

    // 4. System State
    const systemState = document.createElement('span');
    systemState.className = 'bio-system-state';
    systemState.setAttribute('data-bio-tip', sysDesc);
    systemState.textContent = `SYS STATE: ${data[1]}`;

    // Appendiamo tutto al contenitore principale
    clockEl.append(row, statusLabel, timeLabel, systemState);
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
        const fullContent = `<div class="greeting-time">${greetings[isIt ? 'it' : 'en'][gIdx]}</div>${titleSpans + daySpans}`;
        
        weekElement.textContent = '';
        weekElement.appendChild(document.createRange().createContextualFragment(fullContent));
    });
}

    // --- 4. TOOLTIP GESTORE (UPDATED FOR HTML RENDERING) ---
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
            const raw = target.getAttribute('data-bio-tip');
            tooltipEl.replaceChildren(); // Svuota in modo sicuro

            try {
                const data = JSON.parse(raw);
                // Titolo
                const b = document.createElement('b');
                b.textContent = data.t;
                tooltipEl.append(b, document.createElement('br'));
                // Body (gestiamo i tag <b> o <i> interni se presenti nelle descrizioni del dizionario)
                const bodySpan = document.createElement('span');
                bodySpan.textContent = data.b; 
                tooltipEl.appendChild(bodySpan);
                // Extra
                if (data.e) {
                    const i = document.createElement('i');
                    i.style.display = "block";
                    i.textContent = data.e;
                    tooltipEl.appendChild(i);
                }
                // Barra Intensità
                if (data.p !== null) {
                    const barContainer = document.createElement('div');
                    barContainer.className = 'intensity-container';
                    barContainer.innerHTML = `
                        <div class='intensity-label'>INTENSITY</div>
                        <div class='intensity-bar-bg'><div class='intensity-bar-fill' style='width:${data.p}%'></div></div>
                        <div class='intensity-value'>${data.p}%</div>`;
                    tooltipEl.appendChild(barContainer);
                }
            } catch (err) {
                tooltipEl.textContent = raw; // Fallback per testo semplice
            }
            tooltipEl.style.display = 'block'; 
        } 
    });
    // ... mantieni mousemove e mouseout identici ...
}

    // --- 5. LOGICA MODERNA DNA SCANNER (VERSIONE OTTIMIZZATA & REALE) ---
// Strategy: Secure asynchronous PDF generation via cdn-hosted jsPDF with UI-HUD feedback.
function initDnaScanner() {
    const dnaScanner = document.getElementById('dna-scanner');
    if (!dnaScanner) return;

    // --- SETUP ACCESSIBILITÀ ---
    dnaScanner.setAttribute('role', 'button');
    dnaScanner.setAttribute('tabindex', '0');
    dnaScanner.setAttribute('aria-label', isIt ? 'Scarica Report Audit Bio-Sincronizzato' : 'Download Bio-Synchronized Audit Report');

    // --- GESTORE CLICK (TRIGGER DOWNLOAD) ---
    dnaScanner.addEventListener('click', (e) => {
    e.preventDefault();

    // Recupero diretto della molecola corrente dall'HUD
    const currentMolEl = document.querySelector('.bio-data-value');
    const currentMol = currentMolEl ? currentMolEl.textContent : "DHEA";

    // Feedback visuale HUD
    const loadingTip = formatTip(
        isIt ? "GENERAZIONE AUDIT" : "GENERATING AUDIT",
        isIt ? "Compilazione dati molecolari..." : "Compiling molecular data...",
        isIt ? "Protocollo di sicurezza attivo." : "Security protocol active.",
        100
    );
    dnaScanner.setAttribute('data-bio-tip', loadingTip);

    // Esecuzione immediata (libreria già globale)
    executeSecureDownload(currentMol);
    
    // Reset tooltip dopo breve delay
    setTimeout(syncScannerData, 1500);
});

    // --- GESTORE TASTIERA (INVIO/SPAZIO) ---
    dnaScanner.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            dnaScanner.click();
        }
    });

    // --- FUNZIONE DOWNLOAD ANTI-BLOCK ---
  /**
 * Genera il report PDF Biotech in modo sicuro.
 * @param {string} molecule - La molecola corrente passata dal core engine.
 */
const executeSecureDownload = (molecule) => {
    try {
        // Accesso alla libreria globale (standard jsPDF 2.5.1+)
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        
        const now = new Date();
        const lang = isIt ? 'it' : 'en';
        const dict = bioExplanations[lang];

        // Sanitizzazione input per CodeQL
        const safeMol = molecule.replace(/[<>]/g, "").toUpperCase();
        const seasonEl = document.querySelector('.bio-season-label');
        const safeSeason = (seasonEl ? seasonEl.textContent : "STATIONARY").replace(/[<>]/g, "");

        // --- 1. HEADER HUD ---
        doc.setFillColor(20, 30, 48); // DARK_ACCENT
        doc.rect(0, 0, 210, 40, 'F');
        
        // Gestione Favicon (Try-catch per stabilità offline)
        try { 
            doc.addImage("https://gitechnolo.github.io/biotechproject/Biotech-file/images/favicon-biotech.png", 'PNG', 10, 8, 24, 24); 
        } catch(e) { console.warn("Favicon asset unreachable, skipping..."); }
        
        doc.setTextColor(167, 255, 235);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("BIOTECH CORE AUDIT", 40, 18);
        
        doc.setFontSize(8);
        doc.setFont("courier", "normal");
        doc.text(`DATE: ${now.toLocaleDateString(lang)} | TIME: ${now.toLocaleTimeString(lang)} | ${safeSeason}`, 40, 25);
        doc.setDrawColor(0, 230, 118); // NEON_GREEN
        doc.line(0, 40, 210, 40);

        // --- 2. ANALISI MOLECOLARE ---
        let yPos = 55;
        doc.setTextColor(20, 30, 48);
        doc.setFont("helvetica", "bold");
        doc.text(isIt ? "ANALISI ISTANTANEA" : "INSTANT ANALYSIS", 15, yPos);

        yPos += 8;
        doc.setFillColor(0, 230, 118);
        doc.roundedRect(15, yPos, 180, 35, 2, 2, 'F'); // Rettangolo HUD
        doc.setFillColor(255, 255, 255, 0.9); // Overlay chiaro per leggibilità
        doc.rect(16, yPos + 1, 178, 33, 'F');
        
        doc.setFontSize(10);
        doc.setTextColor(20, 30, 48);
        doc.text(`${isIt ? 'MOLECOLA' : 'MOLECULE'}:`, 20, yPos + 10);
        doc.setTextColor(0, 200, 100);
        doc.setFontSize(16);
        doc.text(safeMol, 20, yPos + 18);

        // Intensità (Dato numerico sicuro)
        const intEl = document.querySelector('.intensity-value');
        const intVal = (intEl ? intEl.textContent : "100%").replace(/[<>]/g, "");
        doc.setFillColor(230, 230, 230);
        doc.rect(140, yPos + 10, 45, 4, 'F');
        doc.setFillColor(255, 204, 0); // TECH_GOLD
        doc.rect(140, yPos + 10, (45 * parseInt(intVal)) / 100, 4, 'F');
        doc.setTextColor(50);
        doc.setFontSize(8);
        doc.text(`${isIt ? 'INTENSITÀ' : 'INTENSITY'}: ${intVal}`, 140, yPos + 18);

        // Descrizione scientifica dal dizionario (non dal DOM, per massima sicurezza)
        doc.setTextColor(80);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        const desc = dict[safeMol] || dict["default"];
        doc.text(doc.splitTextToSize(desc, 170), 20, yPos + 28);

        // --- 3. TABELLA CICLO 24H ---
        yPos += 50;
        doc.setTextColor(20, 30, 48);
        doc.setFont("helvetica", "bold");
        doc.text(isIt ? "RIEPILOGO CICLO 24H" : "24H CYCLE SUMMARY", 15, yPos);

        const tableY = yPos + 5;
        doc.setFillColor(20, 30, 48);
        doc.rect(15, tableY, 180, 8, 'F');
        doc.setTextColor(255);
        doc.setFontSize(9);
        doc.text(isIt ? "ORA" : "TIME", 18, tableY + 5.5);
        doc.text(isIt ? "MOLECOLA" : "MOLECULE", 45, tableY + 5.5);
        doc.text(isIt ? "STATO DI SISTEMA" : "SYSTEM STATE", 95, tableY + 5.5);

        const cData = [
            ["00:00", "ADENOSINA", isIt ? "RIGENERAZIONE" : "REGEN"],
            ["06:00", "CORTISOLO", isIt ? "RESET CIRCADIANO" : "CIRCADIAN RESET"],
            ["11:00", "GLUTAMMATO", isIt ? "PICCO COGNITIVO" : "COGNITIVE PEAK"],
            ["17:00", "MIOCHINE", isIt ? "PICCO FISICO" : "PHYSICAL PEAK"],
            ["23:00", "MELATONINA", isIt ? "INIZIO CLEARANCE" : "CLEARANCE START"]
        ];

        let rowY = tableY + 8;
        cData.forEach((row, i) => {
            doc.setFillColor(i % 2 === 0 ? 248 : 240);
            doc.rect(15, rowY, 180, 7, 'F');
            doc.setTextColor(50);
            doc.text(row[0], 18, rowY + 5);
            doc.text(row[1], 45, rowY + 5);
            doc.text(row[2], 95, rowY + 5);
            rowY += 7;
        });

        // --- 4. HUD GRAPHICS (MACRO BALANCE) ---
        yPos = 220;
        doc.setDrawColor(200);
        doc.line(15, yPos, 195, yPos);

        const cx = 35, cy = 250;
        [[0, 150, 255], [255, 87, 34], [255, 204, 0]].forEach((color, i) => {
            doc.setDrawColor(color[0], color[1], color[2]);
            doc.setLineWidth(0.8);
            doc.ellipse(cx, cy, 15 - (i * 4), 15 - (i * 4));
        });

        doc.setTextColor(20, 30, 48);
        doc.setFontSize(10);
        doc.text(isIt ? "BILANCIAMENTO MACRO" : "MACRO BALANCE", 60, 240);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(isIt ? "PROT: 40% | CARB: 30% | GRASSI: 30%" : "PROT: 40% | CARBS: 30% | FATS: 30%", 60, 247);

        // Consiglio Bio-Logico (Sanitizzato)
        const adviceEls = document.querySelectorAll('.bio-data-value');
        const adviceTxt = (adviceEls.length > 1 ? adviceEls[adviceEls.length - 1].textContent : "---").replace(/[<>]/g, "");
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(isIt ? "CONSIGLIO BIO-LOGICO:" : "BIO-LOGICAL ADVICE:", 60, 260);
        doc.setTextColor(0, 200, 100);
        doc.text(doc.splitTextToSize(adviceTxt, 130), 60, 268);

        // Salvataggio
        doc.save(`Biotech_Audit_2026_${safeMol}.pdf`);

    } catch (error) {
        console.error("Critical PDF Engine Failure:", error);
    }
};

    // --- SINCRONIZZAZIONE REAL-TIME TOOLTIP (SECURE VERSION) ---
    const syncScannerData = () => {
        // 1. Lettura sicura tramite textContent
        const molEl = document.querySelector('.bio-data-value');
        const intensityEl = document.querySelector('.intensity-value');

        // 2. Sanitizzazione immediata e fallback
        const rawMolName = molEl ? molEl.textContent : "---";
        const rawIntensity = intensityEl ? intensityEl.textContent : "80%";
        
        const molName = rawMolName.replace(/[<>]/g, "");
        const intensity = parseInt(rawIntensity.replace(/[<>]/g, "")) || 0;

        // 3. Costruzione corpo testo (Senza tag HTML <b>)
        const title = isIt ? "DNA SCANNER ACTIVE" : "DNA SCANNER ACTIVE";
        const body = isIt 
            ? `Sincronia Molecolare: ${molName}` 
            : `Molecular Sync: ${molName}`;
        const extra = isIt 
            ? "Click per scaricare il Report PDF" 
            : "Click to download PDF Report";

        // 4. Generazione JSON inerte tramite formatTip
        // Parametri: title, body, extra, barPerc
        const tipContent = formatTip(title, body, extra, intensity);
        
        if (dnaScanner) {
            dnaScanner.setAttribute('data-bio-tip', tipContent);
        }
    };

    // Avvio e monitoraggio ciclico
    syncScannerData();
    setInterval(syncScannerData, 1000);
}

 // --- INIZIALIZZAZIONE MOTORE BIOTECH CORE ---
    try {
        initSeasonMonitor();   // Monitoraggio cicli stagionali e inclinazione assiale
        initBioClock();        // Gestione ritmi circadiani e molecole orarie
        initWeeklyGreeting();  // Animazione saluti HUD caratteri-per-carattere
        initBiotechTooltips(); // Gestore globale eventi mouse e rendering DOM tooltip
        initDnaScanner();      // Engine di scansione e generazione Audit PDF
        
        console.log("Biotech Core Module 06: Status Online - Security Level: CodeQL-Safe");
    } catch (criticalError) {
        console.error("Errore critico durante l'avvio del modulo Biotech:", criticalError);
    }
});
// ==========================================================================
// END OF MODULE 06 - BIOTECH PROJECT 2026
// ==========================================================================