// PUNTO DE ENTRADA DE NEXUS_OS

import { initializeNavigation } from "./components/navigation.js";
import { initializeNotifications, setActivityData,} from "./components/notifications.js";
import { initializeCharts } from "./components/charts.js";
import { initialActivity } from "./data/demo-data.js";
import { initializeDashboard } from "./modules/dashboard.js";
import { initializeSecurity } from "./modules/security.js";
import { initializeProcesses } from "./modules/processes.js";
import { initializeTerminal } from "./modules/terminal.js";
import { initializeActivity } from "./modules/activity.js";
import { initializeSettings } from "./modules/settings.js";

// INICIALIZACIÓN DE LA APLICACIÓN

function initializeApp() {
    setActivityData(initialActivity, [
        {
            title: "Panel iniciado",
            description: "La interfaz está lista.",
            time: new Date(),
        },
        {
            title: "Datos de demostración",
            description: "Las métricas son simuladas.",
            time: new Date(),
        },
    ]);

    initializeNavigation();
    initializeNotifications();
    initializeProcesses();
    initializeSecurity();
    initializeCharts();
    initializeDashboard();
    initializeTerminal();
    initializeActivity();
    initializeSettings();

    window.lucide?.createIcons();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
} else {
    initializeApp();
}
