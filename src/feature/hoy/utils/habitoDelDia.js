import { diaSemanaISO, diasDesdeEpoch } from "@/utils/fecha";

export function esHabitoDelDia(habito, fechaStr) {
  if (!habito.activo) return false;

  const { tipo, intervalo, diasSemana } = habito.frecuencia;

  if (tipo === "diaria") return true;

  if (tipo === "semanal") {
    return diasSemana?.includes(diaSemanaISO(fechaStr)) ?? false;
  }

  if (tipo === "cada_x_dias") {
    const dias = diasDesdeEpoch(fechaStr);
    return dias % (intervalo || 1) === 0;
  }

  return false;
}

export function getHabitosDelDia(habitos, fechaStr) {
  return habitos.filter((h) => esHabitoDelDia(h, fechaStr));
}
