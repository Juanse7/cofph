// Definición de los registros que aparecen en el panel derecho del Historial.
// Cada registro es un div propio. "fecha" marca campos de fecha y hora,
// "area" marca campos multilínea, "archivos" indica que el formulario acepta archivos.

export const TIPO_ESTADO = 'estado';
export const TIPO_FACTURACION = 'facturacion';
export const TIPO_DIBUJO = 'dibujo';

export const DEFINICION_REGISTRO = {
  estado: {
    titulo: 'Estado del paciente',
    campos: [{ clave: 'estado', etiqueta: 'Estado del paciente' }],
  },
  facturacion: {
    titulo: 'Apartado de facturación',
    campos: [
      { clave: 'ruc', etiqueta: 'RUC' },
      { clave: 'facturaNumero', etiqueta: 'N.º de factura' },
      { clave: 'detalles', etiqueta: 'Detalles', area: true },
    ],
  },
  papelRecetaLentes: {
    titulo: 'Papel de receta de lentes',
    campos: [
      { clave: 'fechaDeReceta', etiqueta: 'Fecha de receta', fecha: true },
      { clave: 'recetaLentes', etiqueta: 'Receta de lentes', area: true },
    ],
  },
  ordenExamenes: {
    titulo: 'Orden de exámenes',
    campos: [
      { clave: 'fechaOrdenDeExamenes', etiqueta: 'Fecha de orden de exámenes', fecha: true },
      { clave: 'detallesDeExamenes', etiqueta: 'Detalles de exámenes', area: true },
    ],
  },
  recetaMedicinas: {
    titulo: 'Receta de medicinas',
    campos: [
      { clave: 'fechaRecetaMedicinas', etiqueta: 'Fecha de receta de medicinas', fecha: true },
      { clave: 'recetas', etiqueta: 'Recetas', area: true },
    ],
  },
  resultadosExamenes: {
    titulo: 'Resultados de exámenes',
    archivos: true,
    campos: [
      { clave: 'fechaDeResultados', etiqueta: 'Fecha de resultados', fecha: true },
      { clave: 'detallesDeResultados', etiqueta: 'Detalles de resultados', area: true },
    ],
  },
  reportesExamenes: {
    titulo: 'Reportes de exámenes',
    archivos: true,
    campos: [
      { clave: 'fechaReporteDeExamenes', etiqueta: 'Fecha de reporte de exámenes', fecha: true },
      { clave: 'seguro', etiqueta: 'Seguro médico', soloLectura: true },
      { clave: 'detalles', etiqueta: 'Detalles', area: true },
    ],
  },
  dibujo: {
    titulo: 'Dibujo',
    campos: [{ clave: 'imagen', etiqueta: 'Dibujo', imagen: true }],
  },
};

// Campo de fecha de cada actividad: se usa como fecha del registro en el panel derecho.
export function campoFechaDe(tipo) {
  const definicion = DEFINICION_REGISTRO[tipo];
  return definicion?.campos.find((campo) => campo.fecha)?.clave;
}
