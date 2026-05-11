import { hoy, addDias, toISO } from "@/utils/fecha";
import { esHabitoDelDia } from "@/feature/hoy/utils/habitoDelDia";

export function calcularRacha(habito, registros) {
  const hoyStr = hoy();
  const regHoy = registros.find((r) => r.habitoId === habito.id && r.fecha === hoyStr);
  let fecha = regHoy?.completado ? hoyStr : addDias(hoyStr, -1);
  let racha = 0;

  for (let i = 0; i < 365; i++) {
    if (esHabitoDelDia(habito, fecha)) {
      const reg = registros.find((r) => r.habitoId === habito.id && r.fecha === fecha);
      if (reg?.completado) {
        racha++;
      } else {
        break;
      }
    }
    fecha = addDias(fecha, -1);
  }
  return racha;
}

export function calcularTotalCompletados(habitoId, registros) {
  return registros.filter((r) => r.habitoId === habitoId && r.completado).length;
}

export function calcularPorcentajeMes(habito, registros) {
  const hoyDate = new Date();
  const year = hoyDate.getFullYear();
  const month = hoyDate.getMonth();
  const diasEnMes = new Date(year, month + 1, 0).getDate();

  let programados = 0;
  let completados = 0;

  for (let d = 1; d <= hoyDate.getDate(); d++) {
    const fechaStr = toISO(new Date(year, month, d, 12));
    if (esHabitoDelDia(habito, fechaStr)) {
      programados++;
      const reg = registros.find((r) => r.habitoId === habito.id && r.fecha === fechaStr);
      if (reg?.completado) completados++;
    }
  }

  return programados === 0 ? 0 : Math.round((completados / programados) * 100);
}

// Returns array of { fecha, programado, completado, futuro } for N weeks
export function generarGrilla(habito, registros, semanas = 16) {
  const hoyDate = new Date();
  hoyDate.setHours(12, 0, 0, 0);

  // Start from the Monday semanas weeks ago
  const diaSemanaHoy = hoyDate.getDay() === 0 ? 6 : hoyDate.getDay() - 1;
  const start = new Date(hoyDate);
  start.setDate(hoyDate.getDate() - diaSemanaHoy - (semanas - 1) * 7);

  const grid = [];
  for (let week = 0; week < semanas; week++) {
    const col = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(start);
      date.setDate(start.getDate() + week * 7 + day);
      const fechaStr = toISO(date);
      const programado = esHabitoDelDia(habito, fechaStr);
      const reg = registros.find((r) => r.habitoId === habito.id && r.fecha === fechaStr);
      col.push({
        fecha: fechaStr,
        mes: date.getMonth(),
        programado,
        completado: reg?.completado ?? false,
        futuro: date > hoyDate,
      });
    }
    grid.push(col);
  }
  return grid;
}
