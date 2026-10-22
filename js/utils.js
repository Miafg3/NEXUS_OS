// FUNCIONES COMPARTIDAS

export function escapeHTML(value) {
    return String(value).replace(
        /[&<>"']/g,
        (character) =>
        ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        })[character],
    );
}

export function formatNumber(value) {
    return new Intl.NumberFormat("es-MX").format(value);
}

export function getTime() {
    return new Date().toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

export function cloneData(value) {
    return JSON.parse(JSON.stringify(value));
}

export function createIcon(name, className = "h-4 w-4") {
    return `<i data-lucide="${name}" class="${className}"></i>`;
}
