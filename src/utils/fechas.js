// Utilidades de fecha y hora. Trabajan en hora local para evitar desfases de zona horaria.
// Formato de fecha: 'YYYY-MM-DD'. Formato de fecha y hora: 'YYYY-MM-DDTHH:mm'.

const dosDigitos = (n) => String(n).padStart(2, '0');

export function fechaDesdeDate(date) {
  return `${date.getFullYear()}-${dosDigitos(date.getMonth() + 1)}-${dosDigitos(date.getDate())}`;
}

export function hoyISO() {
  return fechaDesdeDate(new Date());
}

export function ahoraDateTimeISO() {
  const d = new Date();
  return `${fechaDesdeDate(d)}T${dosDigitos(d.getHours())}:${dosDigitos(d.getMinutes())}`;
}

// Fecha y hora actual con segundos (YYYY-MM-DDTHH:mm:ss). Se usa para registros que se guardan al momento.
export function ahoraDateTimeConSegundosISO() {
  const d = new Date();
  return `${fechaDesdeDate(d)}T${dosDigitos(d.getHours())}:${dosDigitos(d.getMinutes())}:${dosDigitos(d.getSeconds())}`;
}

// Completa una fecha y hora sin segundos con ":00", para compararla con las que sí los tienen.
export function normalizarFechaHora(valor) {
  if (!valor) return '';
  return valor.length === 16 ? `${valor}:00` : valor;
}

// Como formatearFechaHora, pero muestra también los segundos cuando el valor los tiene.
export function formatearFechaHoraCompleta(iso) {
  if (!iso) return '';
  const base = formatearFechaHora(iso);
  return iso.length >= 19 ? `${base}:${iso.slice(17, 19)}` : base;
}

export function parteFecha(valor) {
  return valor ? valor.slice(0, 10) : '';
}

export function parteHora(valor) {
  return valor && valor.length >= 16 ? valor.slice(11, 16) : '';
}

export function combinarFechaHora(fecha, hora) {
  if (!fecha) return '';
  return `${fecha}T${hora || '00:00'}`;
}

export function fechaAObjeto(iso) {
  if (!iso) return null;
  const [y, m, d] = parteFecha(iso).split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatearFecha(iso) {
  if (!iso) return '';
  const [y, m, d] = parteFecha(iso).split('-');
  return `${d}/${m}/${y}`;
}

export function formatearFechaHora(iso) {
  if (!iso) return '';
  const hora = parteHora(iso);
  return hora ? `${formatearFecha(iso)} ${hora}` : formatearFecha(iso);
}

// Ejemplo: "Martes, 17 de noviembre de 2026" (solo la primera letra en mayúscula).
export function formatearFechaLarga(iso) {
  const d = fechaAObjeto(iso);
  if (!d) return '';
  const texto = d.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return '';
  const nacimiento = fechaAObjeto(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad -= 1;
  return edad >= 0 ? edad : '';
}

export function mismaFecha(isoA, fechaB) {
  return parteFecha(isoA) === parteFecha(fechaB);
}
