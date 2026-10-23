// NOTIFICACIONES Y REGISTRO DE EVENTOS

import { escapeHTML, getTime } from "../utils.js";

let activities = [];
let notifications = [];
let notificationCount = 0;

const activityStyles = {
    success: "bg-emerald-500/10 text-emerald-400",
    warning: "bg-amber-500/10 text-amber-400",
    error: "bg-rose-500/10 text-rose-400",
    info: "bg-sky-500/10 text-sky-400",
};

const activityIcons = {
    success: "check-circle",
    warning: "alert-triangle",
    error: "x-circle",
    info: "activity",
};

export function setActivityData(initialActivities = [], initialNotifications = []) {
    activities = [...initialActivities];
    notifications = [...initialNotifications];
    notificationCount = notifications.length;
    renderActivity();
    renderNotifications();
}

export function showToast(message, type = "success") {
    const preferences = window.nexusPreferences;
    if (preferences && !preferences.notifications) return;

    const styles = {
        success: "border-emerald-500/20 text-emerald-400",
        warning: "border-amber-500/20 text-amber-400",
        error: "border-rose-500/20 text-rose-400",
        info: "border-sky-500/20 text-sky-400",
    };

    const icons = {
        success: "check-circle",
        warning: "alert-triangle",
        error: "x-circle",
        info: "info",
    };

    const toast = document.createElement("div");
    toast.className = `toast flex items-start gap-3 rounded-xl border bg-slate-950 p-4 shadow-2xl ${styles[type] || styles.info}`;

    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", icons[type] || icons.info);
    icon.className = "mt-0.5 h-5 w-5 shrink-0";

    const text = document.createElement("p");
    text.className = "text-sm leading-6 text-slate-200";
    text.textContent = message;

    toast.append(icon, text);
    document.querySelector("#toast-container").appendChild(toast);
    window.lucide?.createIcons();

    setTimeout(() => toast.remove(), 3500);
}

export function addActivity(type, title, description) {
    activities.unshift({ type, title, description, time: new Date() });
    activities = activities.slice(0, 100);

    notifications.unshift({ title, description, time: new Date() });
    notifications = notifications.slice(0, 20);
    notificationCount++;

    renderActivity();
    renderNotifications();
}

export function getActivities() {
    return activities;
}

export function clearActivities() {
    activities = [];
    renderActivity();
}

export function resetActivityData() {
    activities = [];
    notifications = [];
    notificationCount = 0;
    renderActivity();
    renderNotifications();
}

export function renderActivity() {
    const recent = activities.slice(0, 5);
    const recentContainer = document.querySelector("#recent-activity");
    const fullContainer = document.querySelector("#activity-list");

    if (recentContainer) {
        recentContainer.innerHTML = recent.map((activity) => `
            <div class="flex gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${activityStyles[activity.type] || activityStyles.info}">
                    <i data-lucide="${activityIcons[activity.type] || activityIcons.info}" class="h-4 w-4"></i>
                </div>

                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <p class="text-sm font-medium text-slate-200">${escapeHTML(activity.title)}</p>
                        <span class="text-[10px] text-slate-600">${activity.time.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <p class="mt-1 text-xs leading-5 text-slate-500">${escapeHTML(activity.description)}</p>
                </div>
            </div>
        `,).join("");
    }

    if (fullContainer) {
        fullContainer.innerHTML = activities.length ? activities.map((activity) => `
            <div class="flex gap-4 p-5">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activityStyles[activity.type] || activityStyles.info}">
                    <i data-lucide="${activityIcons[activity.type] || activityIcons.info}" class="h-5 w-5"></i>
                </div>

                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <h4 class="text-sm font-medium text-white">${escapeHTML(activity.title)}</h4>
                        <time class="text-xs text-slate-500">${activity.time.toLocaleString("es-MX")}</time>
                    </div>
                    <p class="mt-2 text-sm leading-6 text-slate-400">${escapeHTML(activity.description)}</p>
                </div>
            </div>
        `).join("") : `<div class="p-10 text-center text-sm text-slate-500">No hay eventos registrados.</div>`;
    }

    window.lucide?.createIcons();
}

export function renderNotifications() {
    const dot = document.querySelector("#notification-dot");
    const list = document.querySelector("#notification-list");

    if (dot) dot.classList.toggle("hidden", notificationCount === 0);

    if (list) {
        list.innerHTML = notifications.length ? notifications.slice(0, 8).map((notification) => `
            <div class="border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                <p class="text-sm font-medium text-slate-200">${escapeHTML(notification.title)}</p>
                <p class="mt-1 text-xs leading-5 text-slate-500">${escapeHTML(notification.description)}</p>
                <p class="mt-2 text-[10px] text-slate-600">${notification.time.toLocaleTimeString("es-MX")}</p>
            </div>
        `).join("") : `<p class="text-sm text-slate-500">No hay notificaciones.</p>`;
    }
}

export function initializeNotifications() {
    document.querySelector("#notification-button").addEventListener("click", () => {
        document.querySelector("#notification-panel").classList.toggle("hidden");
        notificationCount = 0;
        document.querySelector("#notification-dot").classList.add("hidden");
    });

    document.querySelector("#close-notifications").addEventListener("click", () => {
        document.querySelector("#notification-panel").classList.add("hidden");
    });

    document.querySelector("#profile-menu").addEventListener("click", () => {
        showToast("Perfil de administrador de demostración.", "info");
    });
}
