// Opciones de listas desplegables. Las etiquetas están en español correcto.

export const OPCIONES_STATUS_PACIENTE = [
  'Se recomendó a otro doctor',
  'Tiene pos-operatorio',
  'Viene a consulta',
  'Terapias de calor y spa de párpado',
  'Doctora pediatra',
  'Especialista - contactólogos',
  'N/A',
];

export const OPCIONES_ACTIVIDADES = [
  { valor: 'papelRecetaLentes', etiqueta: 'Papel de receta de lentes' },
  { valor: 'ordenExamenes', etiqueta: 'Orden de exámenes' },
  { valor: 'recetaMedicinas', etiqueta: 'Receta de medicinas' },
  { valor: 'resultadosExamenes', etiqueta: 'Resultados de exámenes' },
  { valor: 'reportesExamenes', etiqueta: 'Reportes de exámenes' },
];

export const OPCIONES_ESTADO_CIVIL = [
  'Soltero(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viudo(a)',
  'Unión libre',
];

export const OPCIONES_TIPO_CONSULTA = [
  'Consulta general',
  'Examen de la vista',
  'Control',
  'Entrega de lentes',
  'Urgencia',
  'Terapia',
];

export const OPCIONES_CONFIRMACION = ['Pendiente', 'Confirmada', 'No confirmada'];

export const OPCIONES_ESTADO_CITAS = ['Activas', 'Canceladas', 'Todas'];

export const TIPO_REGISTRO_ESTADO = 'estado';
export const TIPO_REGISTRO_FACTURACION = 'facturacion';

export const ETIQUETA_ACTIVIDAD = Object.fromEntries(
  OPCIONES_ACTIVIDADES.map((a) => [a.valor, a.etiqueta]),
);
