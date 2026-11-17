// Utilidades de pacientes: nombres, búsqueda y ordenamiento.

export const CAMPOS_BUSQUEDA_PACIENTE = [
  'idPaciente',
  'numeroDeHistorialClinico',
  'statusIdPaciente',
  'nombres',
  'apellidoPaterno',
  'apellidoMaterno',
  'cedula',
  'seguro',
  'email',
  'telefono',
];

export function normalizarTexto(valor) {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

// Apellido paterno primero, luego apellido materno.
export function apellidosPaternoPrimero(paciente) {
  return [paciente.apellidoPaterno, paciente.apellidoMaterno].filter(Boolean).join(' ');
}

export function nombreCompleto(paciente) {
  return [paciente.nombres, apellidosPaternoPrimero(paciente)].filter(Boolean).join(' ');
}

// Cada palabra del texto buscado debe aparecer en algún campo del paciente.
export function buscarPacientes(pacientes, texto) {
  const terminos = normalizarTexto(texto).split(/\s+/).filter(Boolean);
  if (terminos.length === 0) return pacientes;

  return pacientes.filter((paciente) => {
    const valores = CAMPOS_BUSQUEDA_PACIENTE.map((campo) => normalizarTexto(paciente[campo]));
    return terminos.every((termino) => valores.some((valor) => valor.includes(termino)));
  });
}

export function siguienteIdPaciente(pacientes) {
  const maximo = pacientes.reduce((acc, p) => Math.max(acc, Number(p.idPaciente) || 0), 1000);
  return String(maximo + 1);
}
