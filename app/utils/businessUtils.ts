/**
 * Verifica si un negocio está abierto actualmente basado en sus horarios
 * Formato esperado en horarios[dia]: "HH:MM - HH:MM" o "HH:MM a HH:MM" 
 */
export function isBusinessOpen(horarios: any): boolean {
    if (!horarios) return true; // Si no hay horarios definidos, lo consideramos abierto por defecto o manejalo como prefieras

    const now = new Date();
    // Ajuste para zona horaria local if needed, pero Date() suele ser local del navegador
    const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const currentDay = days[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const range = horarios[currentDay];
    if (!range || range === "Cerrado" || range.toLowerCase().includes("cerrado")) {
        return false;
    }

    // Intentamos parsear rangos como "09:00 - 20:00" o "09:00 a 20:00"
    try {
        const parts = range.split(/[-a]/);
        if (parts.length !== 2) return true; // Formato desconocido, no filtramos

        const [startStr, endStr] = parts.map((s: string) => s.trim());

        const parseTime = (t: string) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        const start = parseTime(startStr);
        let end = parseTime(endStr);

        // Caso especial: Abierto hasta después de medianoche (ej: 18:00 - 02:00)
        if (end < start) {
            return currentTime >= start || currentTime <= end;
        }

        return currentTime >= start && currentTime <= end;
    } catch (e) {
        console.error("Error al parsear horario:", range, e);
        return true; // Ante la duda, lo mostramos
    }
}
