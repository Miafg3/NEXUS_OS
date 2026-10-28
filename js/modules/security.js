// ALERTAS DE SEGURIDAD DE DEMOSTRACIÓN

import { initialAlerts } from "../data/demo-data.js";
import { escapeHTML, formatNumber } from "../utils.js";
import { addActivity, showToast } from "../components/notifications.js";

let alerts = structuredClone(initialAlerts);
let blockedEvents = 1432;

function alertClass(type) {
    return (
        {
        Crítica: "bg-rose-500/10 text-rose-400",
        Alta: "bg-amber-500/10 text-amber-400",
        Media: "bg-sky-500/10 text-sky-400",
        }[type] || "bg-slate-800 text-slate-400"
    );
}

export function getAlerts() {
    return alerts;
}

export function getPendingAlerts() {
    return alerts.filter((alert) => alert.status === "Pendiente").length;
}

export function getBlockedEvents() {
    return blockedEvents;
}

export function incrementBlockedEvents(amount = 1) {
    blockedEvents += amount;
    renderSecurity();
}

export function renderSecurity() {
    
    const pending = getPendingAlerts();

    document.querySelector("#metric-alerts").textContent = pending;
    document.querySelector("#sidebar-alert-count").textContent = pending;
    document.querySelector("#security-pending").textContent = pending;
    document.querySelector("#security-blocked").textContent = formatNumber(blockedEvents);
    document.querySelector("#metric-blocked").textContent = formatNumber(blockedEvents);

    document.querySelector("#security-table").innerHTML = alerts.length ? alerts.map((alert) => `
        <tr class="transition hover:bg-slate-900/40">
            <td class="whitespace-nowrap px-5 py-4"><span class="rounded-md px-2 py-1 text-xs ${alertClass(alert.type)}">${escapeHTML(alert.type)}</span></td>
            <td class="min-w-64 px-5 py-4 text-slate-300">${escapeHTML(alert.description)}</td>
            <td class="whitespace-nowrap px-5 py-4 font-mono text-xs text-slate-500">${escapeHTML(alert.time)}</td>
            <td class="whitespace-nowrap px-5 py-4 text-xs ${alert.status === "Pendiente" ? "text-amber-400" : "text-emerald-400"}">${escapeHTML(alert.status)}</td>
            <td class="whitespace-nowrap px-5 py-4">${alert.status === "Pendiente" ? `<button data-alert-id="${alert.id}" class="text-xs text-emerald-400 hover:text-emerald-300">Revisar</button>` : `<span class="text-xs text-slate-600">Revisada</span>`}</td>
        </tr>
    `).join("") : `<tr><td colspan="5" class="px-5 py-12 text-center text-sm text-slate-500">No hay alertas registradas.</td></tr>`;
}

export function resetSecurity() {
    alerts = structuredClone(initialAlerts);
    blockedEvents = 1432;
    renderSecurity();
}

export function initializeSecurity() {

    document.querySelector("#security-table").addEventListener("click", (event) => {

        const button = event.target.closest("button[data-alert-id]");
        if (!button) return;

        const alert = alerts.find((item) => item.id === Number(button.dataset.alertId));
        if (!alert || alert.status !== "Pendiente") return;

        alert.status = "Revisada";
        addActivity("success", "Alerta revisada", alert.description);
        showToast("Alerta marcada como revisada.");
        renderSecurity();
    });

    document.querySelector("#resolve-all-alerts").addEventListener("click", () => {

        if (!getPendingAlerts()) {
            showToast("No hay alertas pendientes.", "info");
            return;
        }

        alerts.forEach((alert) => (alert.status = "Revisada"));
        addActivity("success", "Alertas revisadas", "Se revisaron todas las alertas de demostración.");
        renderSecurity();
        showToast("Todas las alertas han sido revisadas.");
    });

    renderSecurity();
}
