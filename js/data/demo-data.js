// DATOS INICIALES DE DEMOSTRACIÓN

export const initialProcesses = [
    {
        pid: 931,
        name: "./clima.sh --background",
        cpu: 12.4,
        time: "00:14:22",
        status: "Running"
    },
    {
        pid: 1204,
        name: "git fetch origin main",
        cpu: 4.2,
        time: "00:02:05",
        status: "Background"
    },
    {
        pid: 4412,
        name: "ssh-agent",
        cpu: 1.1,
        time: "00:00:10",
        status: "Stopped"
    },
    {
        pid: 2081,
        name: "node server.js",
        cpu: 18.6,
        time: "00:08:41",
        status: "Running"
    },
    {
        pid: 3052,
        name: "database-sync",
        cpu: 7.8,
        time: "00:05:12",
        status: "Background"
    },
    {
        pid: 5091,
        name: "backup-service",
        cpu: 2.3,
        time: "00:01:54",
        status: "Running"
    }
];

export const initialAlerts = [
    {
        id: 1,
        type: "Crítica",
        description: "Intento de acceso no autorizado (simulado)",
        time: "22:14:03",
        status: "Pendiente"
    },
    {
        id: 2,
        type: "Alta",
        description: "Actividad inusual de red (simulada)",
        time: "22:12:41",
        status: "Pendiente"
    },
    {
        id: 3,
        type: "Media",
        description: "Proceso detenido inesperadamente (simulado)",
        time: "22:09:18",
        status: "Pendiente"
    }
];

export const initialActivity = [
    {
        type: "success",
        title: "Panel iniciado",
        description: "Interfaz de demostración preparada.",
        time: new Date()
    },
    {
        type: "info",
        title: "Servicios de ejemplo cargados",
        description: "Datos iniciales disponibles.",
        time: new Date()
    },
    {
        type: "warning",
        title: "Alertas de demostración",
        description: "Hay eventos pendientes de revisión.",
        time: new Date()
    }
];

export const defaultPreferences = {
    autoRefresh: true,
    animations: true,
    notifications: true,
};

export const STORAGE_KEY = "nexus-os-preferences-v1";
