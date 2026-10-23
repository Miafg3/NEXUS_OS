// NAVEGACIÓN Y MENÚ MÓVIL

const viewTitles = {
    resumen: "Resumen",
    seguridad: "Seguridad",
    procesos: "Procesos",
    rendimiento: "Rendimiento",
    terminal: "Terminal",
    actividad: "Registro de actividad",
    configuracion: "Configuración",
};

function closeSidebar() {
    document.querySelector("#sidebar").classList.add("-translate-x-full");
    document.querySelector("#sidebar-overlay").classList.add("hidden");
}

function openSidebar() {
    document.querySelector("#sidebar").classList.remove("-translate-x-full");
    document.querySelector("#sidebar-overlay").classList.remove("hidden");
}

export function navigate(view) {
    if (!viewTitles[view]) view = "resumen";

    document.querySelectorAll(".section-view").forEach((section) => {
        section.classList.toggle("active", section.id === `view-${view}`);
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
        const active = link.dataset.view === view;
        link.classList.toggle("active", active);

        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });

    document.querySelector("#breadcrumb").textContent = viewTitles[view];

    if (location.hash !== `#${view}`) {
        history.replaceState(null, "", `#${view}`);
    }

    closeSidebar();

    if (view === "rendimiento") {
        requestAnimationFrame(() => {
            window.nexusCharts?.resize();
        });
    }
}

export function initializeNavigation() {
    document.querySelector("#open-sidebar").addEventListener("click", openSidebar);
    document.querySelector("#close-sidebar").addEventListener("click", closeSidebar);
    document.querySelector("#sidebar-overlay").addEventListener("click", closeSidebar);

    document.querySelectorAll("[data-view]").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            navigate(link.dataset.view);
        });
    });

    document.querySelectorAll("[data-go]").forEach((button) => {
        button.addEventListener("click", () => navigate(button.dataset.go));
    });

    window.addEventListener("hashchange", () => {
        navigate(location.hash.replace("#", "") || "resumen");
    });

    navigate(location.hash.replace("#", "") || "resumen");
}
