// PREFERENCIAS DE LA INTERFAZ

import { defaultPreferences, STORAGE_KEY } from "../data/demo-data.js";
import { showToast } from "../components/notifications.js";

function loadPreferences() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : { ...defaultPreferences };
    } catch {
        return { ...defaultPreferences };
    }
}

let preferences = loadPreferences();

function savePreferences() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
        showToast("No se pudieron guardar las preferencias.", "warning");
    }
}

function syncSettings() {
    document.querySelector("#auto-refresh-toggle").checked = preferences.autoRefresh;
    document.querySelector("#animations-toggle").checked = preferences.animations;
    document.querySelector("#notifications-toggle").checked = preferences.notifications;

    document.querySelector("#auto-refresh-label").textContent = preferences.autoRefresh ? "Activada" : "Desactivada";
    document.querySelector("#animations-label").textContent = preferences.animations ? "Activadas" : "Desactivadas";
    document.querySelector("#notifications-label").textContent = preferences.notifications ? "Activadas" : "Desactivadas";

    document.body.classList.toggle("reduce-motion", !preferences.animations);
    window.nexusPreferences = preferences;
}

export function getPreferences() {
    return preferences;
}

export function initializeSettings() {

    syncSettings();

    document.querySelector("#auto-refresh-toggle").addEventListener("change", (event) => {
        preferences.autoRefresh = event.target.checked;
        savePreferences();
        syncSettings();
        showToast(`Actualización automática ${preferences.autoRefresh ? "activada" : "desactivada"}.`);
    });

    document.querySelector("#animations-toggle").addEventListener("change", (event) => {
        preferences.animations = event.target.checked;
        savePreferences();
        syncSettings();
        showToast(`Animaciones ${preferences.animations ? "activadas" : "desactivadas"}.`);
    });

    document.querySelector("#notifications-toggle").addEventListener("change", (event) => {
        preferences.notifications = event.target.checked;
        savePreferences();
        syncSettings();
        if (preferences.notifications) showToast("Notificaciones activadas.");
    });
}
