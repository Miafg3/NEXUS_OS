// GRÁFICAS DE RENDIMIENTO

let chartInstances = {};
const labels = Array.from({ length: 12 }, (_, index) => `${index * 5} min`);
const cpuHistory = labels.map(() => Math.round(Math.random() * 45 + 20));
const ramHistory = labels.map(() => Math.round(Math.random() * 20 + 50));
const networkHistory = labels.map(() => Number((Math.random() * 20 + 2).toFixed(1)));

function createChart(canvasId, chartLabels, datasets) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === "undefined") return null;

    return new Chart(canvas, {
        type: "line",
        data: { labels: chartLabels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 250 },
            interaction: { intersect: false, mode: "index" },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderWidth: 1,
                    titleColor: "#e2e8f0",
                    bodyColor: "#cbd5e1",
                    padding: 12,
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: "#64748b", maxTicksLimit: 7 },
                    border: { display: false },
                },
                y: {
                    beginAtZero: true,
                    grid: { color: "rgba(148,163,184,0.08)" },
                    ticks: { color: "#64748b" },
                    border: { display: false },
                },
            },
            elements: {
                point: { radius: 0, hoverRadius: 4 },
                line: { tension: 0.35, borderWidth: 2 },
            },
        },
    });
}

export function initializeCharts() {
    if (typeof Chart === "undefined") {
        console.warn("Chart.js no se pudo cargar. Las gráficas no estarán disponibles.",);
        return;
    }

    Chart.defaults.font.family = "ui-monospace, SFMono-Regular, Menlo, monospace";
    Chart.defaults.font.size = 10;

    chartInstances.performance = createChart("performance-chart", labels, [
        { label: "CPU", data: cpuHistory, borderColor: "#34d399", backgroundColor: "rgba(52,211,153,0.08)", fill: true },
        { label: "RAM", data: ramHistory, borderColor: "#a78bfa", backgroundColor: "rgba(167,139,250,0.05)", fill: false }
    ]);

    chartInstances.cpu = createChart("cpu-chart", labels, [
        { label: "CPU", data: cpuHistory, borderColor: "#38bdf8", backgroundColor: "rgba(56,189,248,0.08)", fill: true }
    ]);

    chartInstances.ram = createChart("ram-chart", labels, [
        { label: "RAM", data: ramHistory, borderColor: "#a78bfa", backgroundColor: "rgba(167,139,250,0.08)", fill: true },
    ]);

    chartInstances.network = createChart("network-chart", labels, [
        { label: "Tráfico", data: networkHistory, borderColor: "#34d399", backgroundColor: "rgba(52,211,153,0.08)", fill: true },
    ]);

    window.nexusCharts = {
        resize() {
            Object.values(chartInstances).forEach((chart) => chart?.resize());
        },
        update() {
            Object.values(chartInstances).forEach((chart) => chart?.update("none"));
        },
    };
}

export function updateChartHistory(cpu, ram, network) {
    cpuHistory.push(cpu);
    ramHistory.push(ram);
    networkHistory.push(network);

    cpuHistory.shift();
    ramHistory.shift();
    networkHistory.shift();

    window.nexusCharts?.update();
}

export function resetChartHistory() {
    cpuHistory.splice(0, cpuHistory.length, ...labels.map(() => Math.round(Math.random() * 45 + 20)));
    ramHistory.splice(0, ramHistory.length, ...labels.map(() => Math.round(Math.random() * 20 + 50)));
    networkHistory.splice(0, networkHistory.length, ...labels.map(() => Number((Math.random() * 20 + 2).toFixed(1))));
    window.nexusCharts?.update();
}