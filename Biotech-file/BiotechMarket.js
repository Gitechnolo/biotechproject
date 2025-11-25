import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { FileText, Calendar, Target, Users, AlertTriangle, GitBranch, Terminal } from 'lucide-react';

// Dati hard-coded storici (input per il modello ML simulato)
const historicalData = [120, 135, 150, 170, 160, 180, 210]; // 2017–2023
const years = [
    "2017", "2018", "2019", "2020", "2021", "2022", "2023",
    "2024", "2025", "2026", "2027", "2028", "2029"
];

// --- MODELLO ML SIMULATO: REGRESSIONE POLINOMIALE QUADRATICA ---

/**
 * Funzione di "addestramento" che calcola i parametri (a, b, c) di una curva quadratica (y = ax^2 + bx + c).
 * Simulazione semplificata per rappresentare un modello non lineare (come una rete neurale semplice).
 */
const trainPolynomialModel = (data) => {
    const N = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    for (let i = 0; i < N; i++) {
        const x = i; // L'indice funge da variabile temporale (tempo = 0, 1, 2, ...)
        const y = data[i];
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    }

    // Calcolo dei parametri base della regressione lineare (b = pendenza, c = intercetta)
    const b_lin = (N * sumXY - sumX * sumY) / (N * sumXX - sumX * sumX);
    const c_lin = (sumY - b_lin * sumX) / N;

    // SIMULAZIONE DEL PARAMETRO QUADRATICO (a) per introdurre accelerazione (curvatura).
    // Questo simula la non-linearità tipica delle reti neurali.
    const a_poly = b_lin / 50; 
    
    // Il modello finale è { a: parametro quadratico, b: parametro lineare, c: intercetta }
    return { a: a_poly, b: b_lin, c: c_lin };
};

/**
 * Funzione di "previsione" che utilizza il modello quadratico addestrato per generare i valori futuri.
 */
const generateForecast = (model, N_start, forecastLength) => {
    const { a, b, c } = model;
    const newForecast = [];

    for (let i = 0; i < forecastLength; i++) {
        const x = N_start + i; // Continua l'indice temporale
        // Previsione: y = a*x^2 + b*x + c (Curva non lineare)
        const prediction = Math.round(a * x * x + b * x + c);
        newForecast.push(prediction);
    }
    return newForecast;
};

// --- SCHEDA DEL MODELLO (METADATI DI AUDITABILITÀ) ---
const ModelCardTemplate = {
    forecast_id: "CYBER-MKT-V3.1-NN-",
    version: "3.1",
    creation_date: new Date().toISOString(),
    last_review: "2024-11-25",
    responsible_party: "Ufficio Strategia e Valutazione Rischi (USVR)",
    methodology: "La previsione è stata generata utilizzando un modello Polinomiale Quadratico (Simulazione di Rete Neurale Semplice), una forma non lineare di regressione addestrata sui dati storici. Questo modello proietta un trend accelerato (curva). Non sono state utilizzate librerie esterne per mantenere il codice autocontenuto.",
    data_provenance: "I dati storici (2017-2023) provengono dal 'Global Cyber Security Market Report 2024' (fonte simulata).",
    disclaimer: "Questa proiezione è puramente indicativa e non costituisce una consulenza finanziaria. Ogni decisione basata su questi dati deve essere verificata con analisi finanziarie indipendenti.",
};

// --- Componente Grafico su Canvas ---
const CanvasGraph = React.memo(({ width, height, data, historicalLength, years }) => {
    const canvasRef = useRef(null);

    const mapValue = (value, min, max, toMin, toMax) => {
        return toMin + (toMax - toMin) * (value - min) / (max - min);
    };

    const drawGraph = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        const W = width;
        const H = height;
        const PADDING_LEFT = 50;
        const PADDING_BOTTOM = 30;
        const CHART_HEIGHT = H - PADDING_BOTTOM - 40;
        const CHART_WIDTH = W - PADDING_LEFT - 10;
        const TOTAL_POINTS = data.length;
        const STEP_X = CHART_WIDTH / (TOTAL_POINTS - 1);

        const minY = Math.min(...data) * 0.9;
        const maxY = Math.max(...data) * 1.1;

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "transparent";
        ctx.fillRect(0, 0, W, H);

        const getY = (value) => {
            return mapValue(value, minY, maxY, CHART_HEIGHT, 40);
        };

        // --- Asse X (anni) e Griglia ---
        ctx.strokeStyle = '#374151'; 
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);

        for (let i = 0; i < TOTAL_POINTS; i++) {
            const x = PADDING_LEFT + i * STEP_X;
            // Linee Verticali Griglia
            ctx.beginPath();
            ctx.moveTo(x, CHART_HEIGHT);
            ctx.lineTo(x, 40);
            ctx.stroke();

            // Etichette asse X
            ctx.fillStyle = i < historicalLength ? "#9CA3AF" : "#4ade80";
            ctx.font = "10px sans-serif";
            ctx.textAlign = 'center';
            ctx.fillText(years[i], x, H - 10);
        }

        ctx.setLineDash([]); 

        // --- Asse Y (valori) ---
        ctx.strokeStyle = '#374151';
        ctx.beginPath();
        ctx.moveTo(PADDING_LEFT, 40);
        ctx.lineTo(PADDING_LEFT, CHART_HEIGHT);
        ctx.stroke();

        // Linee Orizzontali Griglia
        const yLabels = [minY, (minY + maxY) / 2, maxY];
        yLabels.forEach(val => {
            const y = getY(val);
            ctx.strokeStyle = '#374151';
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(PADDING_LEFT, y);
            ctx.lineTo(W - 10, y);
            ctx.stroke();

            // Etichette asse Y
            ctx.fillStyle = "#9CA3AF";
            ctx.textAlign = 'right';
            ctx.font = "10px sans-serif";
            ctx.fillText(Math.round(val).toString(), PADDING_LEFT - 5, y + 4);
        });
        ctx.setLineDash([]); 


        // --- Dati Storici (linea bianca) ---
        ctx.strokeStyle = "#F3F4F6";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(PADDING_LEFT, getY(data[0]));
        for (let i = 1; i < historicalLength; i++) {
            ctx.lineTo(PADDING_LEFT + i * STEP_X, getY(data[i]));
        }
        ctx.stroke();

        // --- Previsioni (linea tratteggiata verde) ---
        ctx.save();
        ctx.setLineDash([8, 6]);
        ctx.strokeStyle = "#4ade80";
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Inizia dalla fine dei dati storici
        ctx.moveTo(PADDING_LEFT + (historicalLength - 1) * STEP_X, getY(data[historicalLength - 1]));
        for (let i = historicalLength; i < TOTAL_POINTS; i++) {
            ctx.lineTo(PADDING_LEFT + i * STEP_X, getY(data[i]));
        }
        ctx.stroke();
        ctx.restore();

        // --- Punti: Storici (bianchi) ---
        ctx.fillStyle = "#F3F4F6";
        for (let i = 0; i < historicalLength; i++) {
            ctx.beginPath();
            ctx.arc(PADDING_LEFT + i * STEP_X, getY(data[i]), 4, 0, 2 * Math.PI);
            ctx.fill();
        }

        // --- Punti: Previsioni (verdi) ---
        ctx.fillStyle = "#4ade80";
        for (let i = historicalLength; i < TOTAL_POINTS; i++) {
            ctx.beginPath();
            ctx.arc(PADDING_LEFT + i * STEP_X, getY(data[i]), 4, 0, 2 * Math.PI);
            ctx.fill();
        }

        // --- Titolo ---
        ctx.fillStyle = "#F3F4F6";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = 'left';
        ctx.fillText("Crescita Mercato CyberSecurity (Valori Indicativi)", PADDING_LEFT, 20);

    }, [width, height, data, historicalLength, years]);

    useEffect(() => {
        drawGraph();
    }, [drawGraph]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full h-full"
        />
    );
});

// Componente principale dell'applicazione
const App = () => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [forecastData, setForecastData] = useState([]);
    const [modelLog, setModelLog] = useState(null);

    const historicalLength = historicalData.length;
    const forecastLength = 6; // Previsione 2024-2029

    // Combina dati storici e previsioni per il grafico
    const allData = useMemo(() => [...historicalData, ...forecastData], [forecastData]);

    // --- LOGICA DI PREVISIONE E LOGGING ---
    useEffect(() => {
        // 1. Addestra il modello (ora un Polinomiale Quadratico)
        const trainedModel = trainPolynomialModel(historicalData);

        // 2. Genera la previsione
        const newForecast = generateForecast(trainedModel, historicalLength, forecastLength);

        // 3. Crea il log di previsione
        const logEntry = {
            timestamp: new Date().toISOString(),
            source: "Modello ML Simulato (Polinomiale Quadratico)",
            input: historicalData,
            model_params: trainedModel,
            output: newForecast,
            status: "Successo"
        };

        // 4. Aggiorna lo stato
        setForecastData(newForecast);
        setModelLog(logEntry);
    }, []); // Esegue solo una volta all'avvio

    // Gestisce la reattività del canvas
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const DataRow = ({ icon: Icon, title, value, colorClass = 'text-gray-300' }) => (
        <div className="flex items-start p-3 bg-gray-800 rounded-lg shadow-md mb-2 transition duration-300 hover:bg-gray-700">
            <Icon className={`w-5 h-5 mr-3 mt-1 ${colorClass}`} />
            <div>
                <p className="text-sm font-semibold text-gray-400">{title}</p>
                <p className={`text-base font-medium ${colorClass}`}>{value}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-green-400">Sistema di Previsione Auditabile (Basato su ML Simulato)</h1>
                <p className="text-gray-400 mt-1">Tracciabilità e Contesto per la Previsione del Mercato Cibernetico</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonna Grafico */}
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-2xl relative">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200 border-b border-gray-700 pb-2">Visualizzazione Previsione</h2>
                    <div ref={containerRef} className="w-full" style={{ height: '350px' }}>
                        {dimensions.width > 0 && dimensions.height > 0 && (
                            <CanvasGraph 
                                width={dimensions.width} 
                                height={dimensions.height} 
                                data={allData} 
                                historicalLength={historicalLength}
                                years={years}
                            />
                        )}
                    </div>
                     {/* Legenda dinamica */}
                     <div className="flex justify-center space-x-6 mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center text-gray-300">
                            <span className="w-4 h-0.5 bg-white mr-2 rounded-full"></span>
                            <span className="text-sm">Storico ({years[0]}-{years[historicalLength - 1]})</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                            <span className="w-4 h-0.5 bg-green-400 border-b border-dashed border-green-400 mr-2"></span>
                            <span className="text-sm">Previsione ({years[historicalLength]}-{years[allData.length - 1]})</span>
                        </div>
                    </div>
                </div>

                {/* Colonna Scheda Modello (Model Card) */}
                <div className="lg:col-span-1">
                    {/* Scheda Modello */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-yellow-400 border-b border-gray-700 pb-2 flex items-center">
                            <FileText className="w-5 h-5 mr-2" /> Scheda del Modello (Audit Trail)
                        </h2>
                        <DataRow
                            icon={Target}
                            title="ID Previsione"
                            value={ModelCardTemplate.forecast_id + ModelCardTemplate.version}
                            colorClass="text-yellow-300"
                        />
                        <DataRow
                            icon={GitBranch}
                            title="Versione Previsione"
                            value={`V${ModelCardTemplate.version}`}
                            colorClass="text-yellow-300"
                        />
                        <DataRow
                            icon={Users}
                            title="Parte Responsabile"
                            value={ModelCardTemplate.responsible_party}
                        />

                        <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-300">Dettagli di Tracciabilità</h3>
                        
                        {/* Metodologia */}
                        <div className="p-4 bg-gray-700 rounded-lg mb-4">
                            <p className="text-sm font-semibold text-gray-400 mb-1 flex items-center">
                                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span> Metodologia (ML)
                            </p>
                            <p className="text-sm text-gray-300 leading-relaxed">{ModelCardTemplate.methodology}</p>
                        </div>

                        {/* Provenienza Dati */}
                        <div className="p-4 bg-gray-700 rounded-lg mb-4">
                            <p className="text-sm font-semibold text-gray-400 mb-1 flex items-center">
                                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span> Provenienza Dati Storici
                            </p>
                            <p className="text-sm text-gray-300 leading-relaxed">{ModelCardTemplate.data_provenance}</p>
                        </div>
                    </div>

                    {/* Log di Previsione */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl">
                        <h2 className="text-xl font-semibold mb-4 text-indigo-400 border-b border-gray-700 pb-2 flex items-center">
                            <Terminal className="w-5 h-5 mr-2" /> Log di Esecuzione (Trace)
                        </h2>
                        {modelLog ? (
                            <div className="space-y-3 text-sm">
                                <p className="text-gray-300">
                                    <span className="font-semibold text-indigo-300">Timestamp:</span> {new Date(modelLog.timestamp).toLocaleString('it-IT')}
                                </p>
                                <p className="text-gray-300">
                                    <span className="font-semibold text-indigo-300">Fonte:</span> {modelLog.source}
                                </p>
                                <div className="bg-gray-700 p-3 rounded-lg">
                                    <p className="font-semibold text-gray-400 mb-1">Input Storico (2017-2023):</p>
                                    <p className="text-xs text-gray-300 break-all">{JSON.stringify(modelLog.input)}</p>
                                </div>
                                <div className="bg-gray-700 p-3 rounded-lg">
                                    <p className="font-semibold text-gray-400 mb-1">Parametri Modello (a, b, c):</p>
                                    <p className="text-xs text-gray-300 break-all">
                                        Parametro Quadratico (a): {modelLog.model_params.a.toFixed(6)}<br/>
                                        Parametro Lineare (b): {modelLog.model_params.b.toFixed(4)}<br/>
                                        Intercetta (c): {modelLog.model_params.c.toFixed(4)}
                                    </p>
                                </div>
                                <div className="bg-green-800/40 p-3 rounded-lg border border-green-700">
                                    <p className="font-semibold text-green-300 mb-1">Output Previsione (2024-2029):</p>
                                    <p className="text-xs text-green-300 break-all">{JSON.stringify(modelLog.output)}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400">Generazione della previsione in corso...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Disclaimer/Audit - Spostato in fondo per chiarezza */}
            <div className="mt-8 p-4 bg-red-900/40 border border-red-700 rounded-xl">
                <p className="text-sm font-bold text-red-400 mb-1 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" /> Avviso / Disclaimer (Audit)
                </p>
                <p className="text-xs text-red-300 leading-relaxed">{ModelCardTemplate.disclaimer}</p>
            </div>
        </div>
    );
};

export default App;   