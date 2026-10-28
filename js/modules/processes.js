// GESTIÓN DE PROCESOS DE DEMOSTRACIÓN

import { initialProcesses } from "../data/demo-data.js";
import { escapeHTML } from "../utils.js";
import { addActivity, showToast } from "../components/notifications.js";

let processes = structuredClone(initialProcesses);
let nextPid = 6000;

function statusClass(status) {
    return {
        Running: "bg-emerald-500/10 text-emerald-400",
        Background: "bg-amber-500/10 text-amber-400",
        Stopped: "bg-rose-500/10 text-rose-400"
    }[status] || "bg-slate-800 text-slate-400";
}

function renderRecentProcesses() {
    document.querySelector("#recent-processes").innerHTML = processes.slice(0, 4).map(process => `
            <tr class="transition hover:bg-slate-900/40">
                <td class="whitespace-nowrap px-5 py-4 font-mono text-xs text-slate-500">#${process.pid}</td>
                <td class="min-w-40 px-5 py-4 font-mono text-xs text-slate-300">${escapeHTML(process.name)}</td>
                <td class="whitespace-nowrap px-5 py-4 text-xs text-slate-400">${process.cpu.toFixed(1)}%</td>
                <td class="whitespace-nowrap px-5 py-4"><span class="rounded-md px-2 py-1 text-[10px] ${statusClass(process.status)}">${escapeHTML(process.status)}</span></td>
            </tr>
    `).join("");
}

export function renderProcesses() {
    
    const query = document.querySelector("#process-search")?.value.toLowerCase().trim() || "";
    const filter = document.querySelector("#process-filter")?.value || "all";
    const sort = document.querySelector("#process-sort")?.value || "pid";

    const filtered = processes.filter((process) => {
        const matchesQuery = String(process.pid).includes(query) || process.name.toLowerCase().includes(query);
        const matchesStatus = filter === "all" || process.status === filter;
        return matchesQuery && matchesStatus;
    });

    filtered.sort((a, b) => {
        if (sort === "cpu") return b.cpu - a.cpu;
        if (sort === "name") return a.name.localeCompare(b.name);
        return a.pid - b.pid;
    });

    document.querySelector("#process-table").innerHTML = filtered.length ? filtered.map(process => `
            <tr class="transition hover:bg-slate-900/50">
                <td class="whitespace-nowrap px-5 py-4 font-mono text-slate-500">#${process.pid}</td>
                <td class="min-w-52 px-5 py-4 font-mono text-xs text-emerald-400">${escapeHTML(process.name)}</td>
                <td class="whitespace-nowrap px-5 py-4 text-slate-300">${process.cpu.toFixed(1)}%</td>
                <td class="whitespace-nowrap px-5 py-4 font-mono text-xs text-slate-400">${escapeHTML(process.time)}</td>
                <td class="whitespace-nowrap px-5 py-4"><span class="rounded-md px-2 py-1 text-xs ${statusClass(process.status)}">${escapeHTML(process.status)}</span></td>
                <td class="whitespace-nowrap px-5 py-4">
                    ${process.status === "Stopped"
                        ? `<button data-action="start" data-pid="${process.pid}" class="mr-2 text-xs text-emerald-400 hover:text-emerald-300">Iniciar</button>`
                        : `<button data-action="stop" data-pid="${process.pid}" class="mr-2 text-xs text-amber-400 hover:text-amber-300">Detener</button>`
                    }
                    <button data-action="delete" data-pid="${process.pid}" class="text-xs text-rose-400 hover:text-rose-300">Eliminar</button>
                </td>
            </tr>
    `).join("") : `<tr><td colspan="6" class="px-5 py-12 text-center text-sm text-slate-500">No se encontraron procesos.</td></tr>`;

    document.querySelector("#process-count").textContent = `${filtered.length} de ${processes.length} procesos`;
    document.querySelector("#process-total").textContent = processes.length;
    document.querySelector("#process-running").textContent = processes.filter(item => item.status === "Running").length;
    document.querySelector("#process-stopped").textContent = processes.filter(item => item.status === "Stopped").length;

    renderRecentProcesses();
}

export function getProcesses() {
    return processes;
}

export function resetProcesses() {
    processes = structuredClone(initialProcesses);
    nextPid = 6000;
    renderProcesses();
}

export function initializeProcesses() {

    ["process-search", "process-filter", "process-sort"].forEach((id) => {
        const element = document.getElementById(id);
        element.addEventListener(id === "process-search" ? "input" : "change", renderProcesses);
    });

    document.querySelector("#process-table").addEventListener("click", (event) => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const pid = Number(button.dataset.pid);
        const process = processes.find((item) => item.pid === pid);
        if (!process) return;

        const action = button.dataset.action;

        if (action === "start" || action === "stop") {
            process.status = action === "start" ? "Running" : "Stopped";
            addActivity("info", action === "start" ? "Proceso iniciado" : "Proceso detenido", `Proceso de demostración #${pid}: ${process.name}`);
            showToast(`Proceso #${pid} ${action === "start" ? "iniciado" : "detenido"} en la simulación.`);
        }

        if (action === "delete") {
            processes = processes.filter((item) => item.pid !== pid);
            addActivity("warning", "Proceso eliminado", `Se eliminó el registro #${pid}.`);
            showToast("Registro de proceso eliminado.", "warning");
        }

        renderProcesses();
    });

    document.querySelector("#add-process").addEventListener("click", () => {
        const name = prompt("Nombre del proceso de demostración:");
        if (!name || !name.trim()) return;

        processes.push({
            pid: nextPid++,
            name: name.trim().slice(0, 100),
            cpu: Number((Math.random() * 15 + 1).toFixed(1)),
            time: "00:00:01",
            status: "Running",
        });

        renderProcesses();
        addActivity("success", "Proceso agregado", name.trim());
        showToast("Proceso agregado a la demostración.");
    });

    renderProcesses();
}
