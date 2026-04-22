/**
 * =============================================================================
 * BIOTECH-SRE-PATCH-ENGINE // VERSION 6.3.0 (INTELLIGENT IMMUNE RESPONSE)
 * =============================================================================
 * [STRATEGY]: Event-Driven Resilience Scaler & Mesh UI Orchestrator.
 * [GOAL]: Dynamic UX adaptation & P2P Handshake Management.
 * [COMPLIANCE]: ADR-008 (Anti-Loop) / ADR-011 / ADR-012 (Mesh-Privacy).
 * -----------------------------------------------------------------------------
   PATCH ENGINE TOPOLOGY 2026 - MESH ACTIVE
   ========================================
   
   [EXTERNAL SIGNALS] ────────┐
             │                ▼
             ├─► 'biotech:resilience-needed' ──► [HIERARCHY PROTECTOR]
             │   (From SRE Guardian)                   ║
             │                                         ╠═► STATE: CLINICAL
             └─► 'Worker: DISPLAY_QR' ────────┐        ╚═► STATE: HIGH (Lock)
                                              ▼
          [MESH UI ORCHESTRATOR] ◄───── [INJECTION ENGINE]
                   ║                          │
                   ╠══► injectMeshPortal() ───┼─► DOM: #biotech-mesh-portal
                   ║    (Handshake UI)        │
                   ║                          └─► requestAnimationFrame
                   ╚══► confirmPairing() 
                        (Safe-Confirm Logic)
   
   [FEEDBACK LAYER]
   ║─► ARIA-Live: 'biotech-alert-buffer' (WCAG 2.2 AAA)
   ╚─► SRE Log: Diagnostic Output (Terminal Style)
 * -----------------------------------------------------------------------------
 * STATUS: ACTIVE // MESH_UI_ENABLED // HIERARCHY_PROTECTION_OK
 * =============================================================================
 */

const BiotechPatchEngine = (() => {
    let lastAction = 0;
    const COOLDOWN = 5000; 

    /**
     * [NEW ADR-012] Gestisce la creazione del portale P2P (QR-Handshake)
     */
    const injectMeshPortal = (handshakeData) => {
        if (document.getElementById('biotech-mesh-portal')) return;

        window.requestAnimationFrame(() => {
            const portal = document.createElement('div');
            portal.id = 'biotech-mesh-portal';
            portal.setAttribute('role', 'dialog');
            portal.setAttribute('aria-modal', 'true');
            portal.setAttribute('aria-labelledby', 'mesh-title');

            // Struttura coerente con il terminale SRE e il CSS fornito
            portal.innerHTML = `
                <div class="mesh-container">
                    <h3 id="mesh-title" class="sre-title" style="color: #00ffa2; margin-bottom: 15px;">
                        🧬 BIOTECH MESH HANDSHAKE
                    </h3>
                    <div id="qr-target" style="background: #fff; padding: 10px; display: inline-block; border-radius: 4px;">
                        <div style="width: 150px; height: 150px; color: #000; font-size: 0.6rem;">
                            [QR: ${handshakeData.substring(0, 15)}...]
                        </div>
                    </div>
                    <div class="sre-terminal" style="margin-top: 15px; text-align: left;">
                        <code>STATUS: WAITING_FOR_PEER...<br>NODE_ID: ${atob(handshakeData).nodeId || 'PENDING'}</code>
                    </div>
                    <div class="sre-action-zone">
                        <button id="close-mesh-btn" class="tech-nav-btn sre-btn" style="margin-top: 10px;">
                            ANNULLA CONNESSIONE
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(portal);

            // Gestione chiusura manuale (Audit-Log Ready)
            document.getElementById('close-mesh-btn').onclick = () => {
                portal.remove();
                console.log("%c🛡️ Mesh: Pairing cancelled by user.", "color: #ff9800;");
            };
        });
    };

    /**
     * [NEW ADR-012] Aggiorna la Modal in stato "Safe-Confirm" dopo il pairing
     */
    const confirmPairingSuccess = (peerInfo) => {
        const portal = document.querySelector('.mesh-container');
        if (!portal) return;

        window.requestAnimationFrame(() => {
            portal.innerHTML = `
                <h3 class="sre-title" style="color: #00ffa2;">✅ PAIRING COMPLETATO</h3>
                <div class="sre-terminal" style="margin-top: 10px; border-color: #00ffa2;">
                    <code>CONNECTED_TO: ${peerInfo.name || 'Remote Node'}<br>ENCRYPTION: AES-GCM-256<br>STATUS: READY_FOR_SYNC</code>
                </div>
                <div class="sre-action-zone">
                    <button id="final-confirm-btn" class="tech-nav-btn sre-btn" style="background: rgba(0, 255, 162, 0.2) !important; border-color: #00ffa2 !important;">
                        PROCEDI ALLA DASHBOARD
                    </button>
                </div>
            `;

            document.getElementById('final-confirm-btn').onclick = () => {
                document.getElementById('biotech-mesh-portal').remove();
                // Notifica al Guardian del successo
                window.dispatchEvent(new CustomEvent('biotech:mesh-sync-complete'));
            };
        });
    };

    /**
     * Gestisce l'emergenza segnalata dal Guardian.
     */
    const handleEmergency = (event) => {
        const now = performance.now();
        if (now - lastAction < COOLDOWN) return;

        lastAction = now;
        const report = event.detail;

        window.requestAnimationFrame(() => {
            const currentStatus = document.documentElement.getAttribute('data-resilience');
            if (currentStatus !== 'high') {
                document.documentElement.setAttribute('data-resilience', 'clinical');
                
                const buffer = document.getElementById('biotech-alert-buffer');
                if (buffer) buffer.innerText = "Ottimizzazione automatica delle performance in corso.";

                const logStyle = (typeof SRE_LOG_MAIN !== 'undefined') 
                    ? SRE_LOG_MAIN.syntax + SRE_LOG_MAIN.patch 
                    : 'background: #ff9800; color: #fff; padding: 2px 5px; font-weight: bold; border-radius: 3px;';
                
                console.log(`%c🛠️ Patch: Applied Clinical Mode (${report.type})`, logStyle);
            }
        });
    };

    return {
        listen: () => {
            window.addEventListener('biotech:resilience-needed', handleEmergency);
            
            // Listener per i messaggi dal Worker v1.3.0
            window.addEventListener('message', (e) => {
                if (e.data.action === 'DISPLAY_QR') injectMeshPortal(e.data.data);
                if (e.data.action === 'P2P_CONNECTED') confirmPairingSuccess(e.data.peer);
            });

            console.log(`%c💉 Patch Engine: Active & Mesh-Ready (v6.3.0)`, 'color: #00ffa2; font-weight: bold;');
        },
        // Esposizione per attivazione manuale da pulsante HTML
        triggerMesh: () => {
            if (window.BiotechWorker) {
                window.BiotechWorker.postMessage({ action: 'INIT_MESH_HANDSHAKE', taskId: `mesh_init_${Date.now()}` });
            }
        }
    };
})();

BiotechPatchEngine.listen();

/* * =============================================================================
 * END OF BIOTECH_PATCH_ENGINE // SYSTEM_PROTECTED
 * =============================================================================
 */