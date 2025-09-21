// reportPerformance.js

// Function to fetch performance data and populate the Chart.js graph
async function fetchPerformanceData() {
    try {
        const response = await fetch('data/performance-latest.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const rawData = await response.json();

        // ✅ Estrai e trasforma i dati per adattarli a Chart.js e ai cerchi
        const chartData = {
            labels: rawData.pages.map(page => page.slug || page.label || 'Pagina sconosciuta'),
            values: rawData.pages.map(page => page.performanceScore !== undefined ? page.performanceScore : 0),
            progress: rawData.pages.map(page => page.performanceScore !== undefined ? page.performanceScore : 0)
        };

        populateChart(chartData);
        fillProgressCircles(chartData);

    } catch (error) {
        console.error('Error fetching or processing performance data:', error);

        // Opzionale: mostra dati di esempio se il JSON non è disponibile
        const fallbackData = {
            labels: ['Homepage', 'Cuore', 'Apparato', 'Cellula'],
            values: [85, 76, 90, 68],
            progress: [85, 76, 90, 68]
        };
        populateChart(fallbackData);
        fillProgressCircles(fallbackData);
    }
}

// Function to populate the Chart.js graph
function populateChart(data) {
    const ctx = document.getElementById('myChart');
    if (!ctx) {
        console.warn('❌ Canvas con id "myChart" non trovato nel DOM');
        return;
    }

    const myChart = new Chart(ctx, {
        type: 'bar', // Puoi cambiare in 'line', 'radar', ecc.
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Punteggio di Performance',
                data: data.values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Performance delle pagine'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Punteggio (0-100)'
                    }
                }
            }
        }
    });
}

// Function to fill .progress-circle elements with data
function fillProgressCircles(data) {
    const progressElements = document.querySelectorAll('.progress-circle');
    if (data.progress.length === 0) {
        console.warn('❌ Nessun dato di progresso disponibile');
        return;
    }

    progressElements.forEach((el, index) => {
        const value = data.progress[index];
        if (value !== undefined) {
            // Imposta larghezza e testo
            el.style.width = `${value}%`;
            el.textContent = `${value}%`;
            // Aggiunge una classe per stili avanzati (opzionale)
            el.classList.add('filled');
        } else {
            console.warn(`No progress data for element at index ${index}`);
            el.textContent = '0%';
        }
    });
}

// Initialize the fetching process
fetchPerformanceData();   