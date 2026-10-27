// ACCIONES DEL REGISTRO DE ACTIVIDAD

import { clearActivities, showToast } from "../components/notifications.js";

export function initializeActivity() {
    document.querySelector("#clear-activity").addEventListener("click", () => {
        if (!confirm("¿Deseas eliminar el historial de actividad de esta sesión?")) return;
        clearActivities();
        showToast("Registro de actividad limpiado.", "warning");
    });
}
