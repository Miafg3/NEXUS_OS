// TERMINAL SEGURA DE DEMOSTRACIÓN

import { getMetrics } from "./dashboard.js";
import { getProcesses } from "./processes.js";
import { getAlerts, getBlockedEvents, getPendingAlerts } from "./security.js";

function appendTerminalLine(text, className = "") {
    const line = document.createElement("p");
    line.className = className;
    line.textContent = text;
    document.querySelector("#terminal-output").appendChild(line);
    document.querySelector("#terminal-output").scrollTop = document.querySelector("#terminal-output").scrollHeight;
}

function executeCommand(rawCommand) {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;

    appendTerminalLine(`$ ${rawCommand}`, "text-white");

    if (command === "clear") {
        document.querySelector("#terminal-output").replaceChildren();
        return;
    }

    const metrics = getMetrics();
    const processes = getProcesses();
    const alerts = getAlerts();

    const commands = {
        help: [
            "Comandos disponibles:",
            "help      Mostrar ayuda",
            "status    Consultar métricas simuladas",
            "processes Mostrar procesos de ejemplo",
            "security  Consultar alertas",
            "date      Mostrar fecha y hora",
            "clear     Limpiar la consola",
        ],
        status: [
            "NEXUS_OS - ESTADO DE DEMOSTRACIÓN",
            `CPU: ${metrics.cpu.toFixed(1)}%`,
            `RAM: ${metrics.ram.toFixed(1)}%`,
            `Red: ${metrics.network.toFixed(1)} MB/s`,
            `Procesos registrados: ${processes.length}`,
            `Alertas pendientes: ${getPendingAlerts()}`,
            "Fuente: datos simulados.",
        ],
        processes: [
            "PID      PROCESO                         ESTADO",
            ...processes.slice(0, 8).map((process) =>
                `${String(process.pid).padEnd(8)} ${process.name.slice(0, 25).padEnd(25)} ${process.status}`,
            )
        ],
        security: [
            "RESUMEN DE SEGURIDAD SIMULADO",
            `Eventos bloqueados: ${getBlockedEvents()}`,
            `Alertas pendientes: ${getPendingAlerts()}`,
            `Alertas registradas: ${alerts.length}`,
            "No se han realizado comprobaciones reales de seguridad.",
        ],
        date: [new Date().toLocaleString("es-MX")],
    };

    if (!commands[command]) {
        appendTerminalLine(`Comando no reconocido: ${rawCommand}`, "text-rose-400");
        appendTerminalLine('Escribe "help" para ver los comandos disponibles.', "text-slate-500");
        return;
    }

    commands[command].forEach((line) => appendTerminalLine(line, "text-emerald-400"));
    appendTerminalLine("");
}

export function initializeTerminal() {
    document.querySelector("#terminal-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const input = document.querySelector("#terminal-input");
        executeCommand(input.value);
        input.value = "";
    });

    document.querySelector("#clear-terminal").addEventListener("click", () => {
        document.querySelector("#terminal-output").replaceChildren();
    });

    document.querySelectorAll("[data-command]").forEach((button) => {
        button.addEventListener("click", () => {
            const target = document.querySelector("#terminal-output");

            document.querySelectorAll(".section-view").forEach((section) => {
                section.classList.toggle("active", section.id === "view-terminal");
            });

            document.querySelector("#breadcrumb").textContent = "Terminal";
            history.replaceState(null, "", "#terminal");
            executeCommand(button.dataset.command);
        });
    });
}