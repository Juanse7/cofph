// Una cita está activa salvo que se haya marcado como cancelada.
// Las citas guardadas antes de este campo no lo tienen, así que se consideran activas.
export function estaActiva(cita) {
  return cita.activa !== false;
}
