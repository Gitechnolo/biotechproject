# 🏛️ BiotechProject: Hub Esecutivo 2026
> **Briefing Strategico per Dirigenti Sanitari, Clinici e Stakeholder**

---

## Visione Strategica (Concetti ad Alto Impatto)

### 1. Resilienza Autonoma: Il Sistema Immunitario e Hardening 3G (v6.1 – v6.4.0-HARDENED)
- **La Strategia:** Un'architettura "Anti-Fragile". Attraverso il **Biotech Guardian**, il sistema monitora le prestazioni in tempo reale e attiva autonomamente una risposta immunitaria (**Patch Engine**) se qualsiasi operazione supera i 100ms. In `v6.4.0-HARDENED`, questo evolve nella strategia **"Silent Sampling + Smart Promotion"** (guidata da una soglia TTFB di 600ms), eliminando la fragilità della rete 3G e i saltelli di layout sotto severo throttling.
- **La Prova:** [ADR-011: Integrità di Sistema e Risposta Immunitaria](https://github.com/Gitechnolo/biotechproject/issues/27) e [ADR-011v6.4-HARDENED](https://github.com/Gitechnolo/biotechproject/issues/27#issuecomment-6811684075).

### 2. Rendering Parallelo: Liberazione del Thread Principale (v6.4)
- **La Visione:** Fluidità assoluta raggiunta. Abbiamo disaccoppiato la reattività dell'interfaccia utente (UI) dal rendering pesante e dall'inizializzazione tramite **BiotechCoreWorker** (`OffscreenCanvas`) e coordinamento del ciclo di vita `INIT_CORE`, preservando la disponibilità del thread principale per l'interazione e l'accessibilità (A11y).
- **La Prova:** Validato in condizioni di rete degradata (simulazione di 3G lento / latenza 400ms), mantenendo **TBT tra 16 e 42 ms** e **CLS a 0.0126** nelle run di audit *hardened* del 20 novembre 2026.

### 3. Sicurezza Senza Compromessi (Cifratura a Riposo e Baseline Evolutiva)
- **La Strategia:** Vault locale cifrato con ciclo di vita controllato. I record sensibili salvati localmente in IndexedDB (`WeightsVault_Secure`) sono protetti a riposo con **AES-GCM 256** tramite chiave di dispositivo non estraibile (`extractable: false` in `VaultKeys_Device`), payload versionati `v: 2`, timestamp cifrato interno e **finestra di *retention* automatica a 7 giorni**, senza degradare la reattività del worker o del thread principale. Nell'attuale **baseline pre-autenticazione** non è ancora presente un segreto detenuto dall'utente; i ganci per le evoluzioni future (derivazione chiave da segreto utente / WebAuthn PRF, payload `v: 3` e CSP restrittiva) restano documentati nel codice e nel *threat model*.
- **La Prova:** Fare riferimento a [ADR-011: Integrità di Sistema e Risposta Immunitaria](https://github.com/Gitechnolo/biotechproject/issues/27) e agli artefatti di *compliance* in `docs/compliance/`.

### 4. Inclusività Universale (WCAG 2.2 AAA)
- **La Visione:** Una piattaforma che non lascia indietro nessuno. Verificata tramite audit automatizzati e test manuali con screen reader, la piattaforma include controlli multimediali bilingui utilizzabili da tastiera e **Sonificazione ARIA** in "Modalità Clinica", garantendo la totale accessibilità anche su hardware datato o reti degradate (3G/Edge).
- **La Prova:** Fare riferimento a [ADR-007 | Issue #20: Audit Stateless Edge WCAG 2.2 AAA](https://github.com/Gitechnolo/biotechproject/issues/20).

> [!TIP]
> **Paradigma Architetturale: "Logica Distillata da IA, Autonomia Edge-Native"**
> BiotechProject valorizza la sintesi dell'intelligenza artificiale come catalizzatore per tradurre sofisticati protocolli clinici in **"Motori Discreti" in Vanilla JS ad alte prestazioni**. Questo processo garantisce che, sebbene lo sviluppo sia accelerato da strumenti all'avanguardia, l'esecuzione finale rimanga **autonoma al 100%, isolata (*air-gapped*) e multithread**. Il risultato è un sistema a costi operativi zero e con forte controllo dei dati all'Edge, progettato con confini di sicurezza espliciti e percorsi di aggiornamento puliti per le fasi successive.

---

## 🗺️ Mappa di Navigazione Esecutiva (Approfondimento)

| Stakeholder | Interesse Chiave | Documento Consigliato | Beneficio Reale |
| :--- | :--- | :--- | :--- |
| **Tutti gli Stakeholder** | **Ciclo di Vita del Progetto** | [**Tabella di Marcia Strategica 2026**](https://github.com/users/Gitechnolo/projects/2) | Piena visibilità sui traguardi futuri, stabilità a lungo termine e tracciamento attivo delle Issue. |
| **Clinici** | Privacy e UX | [Resilience Report](https://github.com/Gitechnolo/biotechproject/blob/main/docs/Rapporto_Equità_Architetturale_Resilienza_IT.pdf) | Archiviazione locale cifrata con *retention* a 7 giorni e interfaccia fluida anche in reparti con segnale debole. |
| **Acquisti/Procurement** | Efficienza e Ciclo di Vita | [SRE Performance Report](https://github.com/Gitechnolo/biotechproject/blob/main/docs/biotech-performance-report.pdf) | Operativo sull'hardware legacy esistente; minori costi di manutenzione e ganci evolutivi chiari. |
| **IT Manager** | Scalabilità e Stack Tecnologico | [Parallel Core Architecture](https://github.com/Gitechnolo/biotechproject/issues/27#issuecomment-4359060827) | Ciclo di vita del worker ordinato, baseline del vault su payload `v: 2` e percorso documentato verso auth e CSP. |
| **Compliance/SRE** | Audit e Affidabilità | [ADR-011v6.4-HARDENED](https://github.com/Gitechnolo/biotechproject/issues/27#issuecomment-6811684075) | Baseline verificata con confini del *threat model*, evidenze di *compliance* e telemetria 3G. |

---

## 📊 Benchmark di Prestazione (`v6.4.0-vault-hardened-3gslow` — Audit 19–20 Nov 2026)
*Misurato in condizioni simulate di 3G lento (latenza 400ms):*

| Metrica | Riferimento 19 Nov (`2026-11-19.json`) | Run 3 del 20 Nov (`2026-11-20.json`) | Intervallo 20 Nov (Run 1–3) | Stato / Note |
| :--- | :--- | :--- | :--- | :--- |
| **Total Blocking Time (TBT)** | `9 ms` | `22 ms` | `16 – 42 ms` | 🟢 **Thread principale ben controllato con l'hardening del vault** |
| **Stabilità Visiva (CLS)** | `0.0910` | `0.0126` | `0.0126` (costante) | 🟢 **Ampiamente sotto la soglia 0.10** |
| **Document Time (`docTime`)** | `7012 ms` | `6565 ms` | `6457 – 6565 ms` | 🟢 **Completamento del documento più rapido** |
| **Largest Contentful Paint (LCP)** | `4016 ms` (`IMG#videoPoster`) | `5743 ms` (`IMG#videoPoster`) | `5680 – 5743 ms` | ℹ️ **Si assesta su `IMG#videoPoster` (*lazy*) dopo un paint testuale precedente** |

### 💡 Note Tecniche e Telemetria Grezza
- **Hardening del Vault e del Ciclo di Vita:** `vaultReady` (`INIT_CORE`) disaccoppia la prontezza del vault dal caricamento delle traduzioni, usa chiavi `AES-GCM 256` non estraibili (`extractable: false`), salva payload `v: 2` senza testo in chiaro su disco e applica una *retention* a 7 giorni, documentando al contempo i limiti *same-origin* pre-autenticazione.
- **Report di Telemetria Grezzi:**
  - Riferimento Commento (19 Nov 2026): [`biotech-bench-v6.4.0-vault-hardened-3gslow-2026-11-19.json`](https://github.com/Gitechnolo/biotechproject/blob/main/docs/compliance/biotech-bench-v6.4.0-vault-hardened-3gslow-2026-11-19.json)
  - Audit Hardened (20 Nov 2026): [`biotech-bench-v6.4.0-vault-hardened-3gslow-2026-11-20.json`](https://github.com/Gitechnolo/biotechproject/blob/main/docs/compliance/biotech-bench-v6.4.0-vault-hardened-3gslow-2026-11-20.json)

---

## 🌐 Internazionalizzazione e Accessibilità

> [!NOTE]
> **Localizzazione Linguistica:** Questa documentazione è la versione ufficiale in lingua italiana, strutturata per l'audit istituzionale e per preservare la massima coerenza con gli standard SRE e clinici globali. Per i documenti tecnici profondi non ancora localizzati (come le singole ADR), si rimanda alla versione inglese o all'utilizzo di strumenti di traduzione nativi del browser, che garantiscono un'accuratezza elevata sulla nostra nomenclatura tecnologica.

---

*Per ulteriori richieste tecniche, contattare il team all'indirizzo teambiotechproject@proton.me*