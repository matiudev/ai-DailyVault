const MESES = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","septiembre","octubre","noviembre","diciembre",
];
const DIAS_SEMANA = ["dom","lun","mar","mié","jue","vie","sáb"];

export function hoy() {
  const d = new Date();
  return toISO(d);
}

export function toISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

// Parses "YYYY-MM-DD" safely without timezone issues
export function parseISO(fechaStr) {
  const [y, m, d] = fechaStr.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function addDias(fechaStr, n) {
  const d = parseISO(fechaStr);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function formatFecha(fechaStr) {
  const todayStr = hoy();
  const date = parseISO(fechaStr);
  const dia = date.getDate();
  const mes = MESES[date.getMonth()];

  if (fechaStr === todayStr) return `Hoy · ${dia} de ${mes}`;
  if (fechaStr === addDias(todayStr, -1)) return `Ayer · ${dia} de ${mes}`;
  return `${DIAS_SEMANA[date.getDay()]}, ${dia} de ${mes}`;
}

// ISO weekday: 1=lunes ... 7=domingo
export function diaSemanaISO(fechaStr) {
  const d = parseISO(fechaStr);
  const jsDay = d.getDay(); // 0=dom
  return jsDay === 0 ? 7 : jsDay;
}

// Days since 2024-01-01 (used for "cada_x_dias" frequency)
const EPOCH = new Date(2024, 0, 1, 12, 0, 0);
export function diasDesdeEpoch(fechaStr) {
  const d = parseISO(fechaStr);
  return Math.round((d - EPOCH) / (1000 * 60 * 60 * 24));
}
