// reportPerformance.js

// Function to fetch performance data / populate the Chart.js graph
async function fetchPerformanceData() {
    try {
        const response = await fetch('data/performance-latest.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        populateChart(data);
        fillProgressCircles(data);
    } catch (error) {
        console.error('Error fetching performance data:', error);
    }
}

// Function to populate the Chart.js graph
function populateChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',  // Change this to your preferred chart type
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Performance',
                data: data.values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to fill .progress-circle elements with data
function fillProgressCircles(data) {
    const progressElements = document.querySelectorAll('.progress-circle');
    progressElements.forEach((el, index) => {
        if (data.progress && data.progress[index]) {
            el.style.width = `${data.progress[index]}%`;
            el.textContent = `${data.progress[index]}%`;
        } else {
            console.warn(`No progress data for element at index ${index}`);
        }
    });
}

// Initialize the fetching process
fetchPerformanceData();