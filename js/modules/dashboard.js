// INDICADORES DEL DASHBOARD

import { updateChartHistory } from "../components/charts.js";
import { addActivity, showToast } from "../components/notifications.js";
import { formatNumber } from "../utils.js";
import { getProcesses } from "./processes.js";
import { getPendingAlerts, incrementBlockedEvents, renderSecurity, resetSecurity} from "./security.js";
import { resetProcesses, renderProcesses } from "./processes.js";
import { resetChartHistory } from "../components/charts.js";
import { resetActivityData } from "../components/notifications.js";

let cpu = 42.8;
let ram = 64.2;
let network = 12.4;
let autoRefreshTimer = null;

export function getMetrics() {
    return { cpu, ram, network };
}

export function updateMetrics() {
    cpu = Number(Math.min(95, Math.max(5, cpu + (Math.random() - 0.5) * 12)).toFixed(1));
    ram = Number(Math.min(92, Math.max(25, ram + (Math.random() - 0.5) * 4)).toFixed(1));
    network = Number(Math.max(0.5, network + (Math.random() - 0.5) * 5).toFixed(1));

    document.querySelector("#metric-cpu").textContent = `${cpu.toFixed(1)}%`;
    document.querySelector("#metric-ram").textContent = `${ram.toFixed(1)}%`;
    document.querySelector("#cpu-bar").style.width = `${cpu}%`;
    document.querySelector("#ram-bar").style.width = `${ram}%`;

    const cpuStatus = document.querySelector("#cpu-status");
    cpuStatus.textContent = cpu >= 80 ? "Elevado" : cpu >= 60 ? "Moderado" : "Normal";
    cpuStatus.className = `mb-1 text-xs ${cpu >= 80 ? "text-rose-400" : cpu >= 60 ? "text-amber-400" : "text-emerald-400"}`;

    document.querySelector("#performance-cpu").textContent = `${cpu.toFixed(1)}%`;
    document.querySelector("#performance-ram").textContent = `${ram.toFixed(1)}%`;
    document.querySelector("#performance-network").textContent = `${network.toFixed(1)} MB/s`;

    updateChartHistory(cpu, ram, network);
}

export function startAutoRefresh() {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = setInterval(() => {
        if (window.nexusPreferences?.autoRefresh) updateMetrics();
    }, 5000);
}

function updateClock() {
    document.querySelector("#current-date").textContent = new Date().toLocaleString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

export function initializeDashboard() {

    updateClock();
    setInterval(updateClock, 1000);
    startAutoRefresh();

    document.querySelector("#refresh-button").addEventListener("click", () => {
        
        updateMetrics();
        renderProcesses();
        renderSecurity();

        addActivity(
            "info", 
            "Datos actualizados", 
            "Se actualizaron los valores de demostración."
        );

        showToast("Datos de demostración actualizados.");

        const icon = document.querySelector("#refresh-button i");
        icon?.classList.add("animate-spin");
        setTimeout(() => icon?.classList.remove("animate-spin"), 500);
    });

    document.querySelector("#deploy-button").addEventListener("click", () => {
        const button = document.querySelector("#deploy-button");
        button.disabled = true;
        button.classList.add("opacity-60", "cursor-not-allowed");
        button.innerHTML = `<i data-lucide="loader-circle" class="h-4 w-4 animate-spin"></i>Procesando...`;
        window.lucide?.createIcons();

        addActivity(
            "info",
            "Demostración iniciada",
            "Se inició una operación simulada."
        );

        setTimeout(() => {
            incrementBlockedEvents(Math.floor(Math.random() * 15 + 1));
            button.disabled = false;
            button.classList.remove("opacity-60", "cursor-not-allowed");
            button.innerHTML = `<i data-lucide="rocket" class="h-4 w-4"></i>Ejecutar demostración`;
            window.lucide?.createIcons();

            addActivity(
                "success",
                "Demostración completada",
                "La operación simulada finalizó correctamente.",
            );

            renderSecurity();
            showToast("Demostración completada correctamente.");
        }, 1000);
    });

    document.querySelector("#reset-demo").addEventListener("click", () => {

        if (!confirm("¿Restablecer los datos de demostración? Se perderán los cambios de esta sesión.")) return;

        resetProcesses();
        resetSecurity();
        resetActivityData();

        cpu = 42.8;
        ram = 64.2;
        network = 12.4;

        document.querySelector("#metric-cpu").textContent = `${cpu.toFixed(1)}%`;
        document.querySelector("#metric-ram").textContent = `${ram.toFixed(1)}%`;
        document.querySelector("#cpu-bar").style.width = `${cpu}%`;
        document.querySelector("#ram-bar").style.width = `${ram}%`;
        document.querySelector("#performance-cpu").textContent = `${cpu.toFixed(1)}%`;
        document.querySelector("#performance-ram").textContent = `${ram.toFixed(1)}%`;
        document.querySelector("#performance-network").textContent = `${network.toFixed(1)} MB/s`;

        resetChartHistory();
        renderSecurity();
        renderProcesses();

        addActivity(
            "success",
            "Demostración restablecida",
            "Se restauraron los datos iniciales.",
        );

        showToast("Datos de demostración restablecidos.");
    });
}
