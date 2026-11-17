// Estructura de la cartilla (main div), en el orden de arriba hacia abajo:
// cartilla1 (Oftalmología), cartilla2 (Cristalino a Tratamiento) y cartilla3 (Encabezado y optometría).
// Cada campo tiene su propia línea. Los campos "area" son multilínea con líneas guía.

const C = (clave, etiqueta) => ({ tipo: 'linea', clave, etiqueta });
const A = (clave, etiqueta) => ({ tipo: 'area', clave, etiqueta });
const T = (etiqueta) => ({ tipo: 'subtitulo', etiqueta });
const F = (clave, etiqueta) => ({ tipo: 'fecha', clave, etiqueta });
const H = (etiqueta) => ({ tipo: 'historial', clave: 'historial', etiqueta });

export const SECCIONES_CARTILLA = [
  {
    clave: 'cartilla1',
    titulo: 'Oftalmología',
    filas: [
      [C('orbita', 'Órbita')],
      [C('apLagrimal', 'Ap. Lagrimal')],
      [C('parpados', 'Párpados')],
      [A('parpadosNotas', '')],
      [C('conjuntiva', 'Conjuntiva')],
      [A('conjuntivaNotas', '')],
      [C('esclera', 'Esclera')],
      [C('corneaMeeCdOd', 'Córnea MEE CD OD'), C('corneaCdOi', 'CD OI')],
      [C('meePcOctCtOd', 'MEE/PC/OCT CT OD'), C('meePcOctCtOi', 'CT OI')],
      [C('imPcOpdWtwOd', 'IM/PC/OPD WTW OD'), C('imPcOpdWtwOi', 'WTW OI')],
      [A('corneaNotas', '')],
      [C('camaraAntProf', 'Cámara Ant. Prof.')],
      [C('caEpitelioOd', 'CA Epitelio OD'), C('caEpitelioOi', 'OI')],
      [C('caEndotelioOd', 'CA Endotelio OD'), C('caEndotelioOi', 'OI')],
      [C('humorAcuoso', 'Humor Acuoso')],
      [C('gonioscopia', 'Gonioscopía')],
      [C('irisEstroma', 'Iris (estroma)')],
      [C('dpfOd', 'DPF OD'), C('dpfOi', 'DPF OI')],
      [C('dpmOd', 'DPM OD'), C('dpmOi', 'DPM OI')],
      [C('evOd', 'EV OD'), C('evOi', 'EV OI')],
      [C('pupila', 'Pupila')],
    ],
  },
  {
    clave: 'cartilla2',
    filas: [
      [C('cristalino', 'Cristalino')],
      [A('cristalinoNotas', '')],
      [T('Tonometría (Aplanático Goldman / iCare)')],
      [C('tonometriaOd', 'OD'), C('tonometriaOi', 'OI')],
      [C('vitreo', 'Vítreo')],
      [C('retina', 'Retina')],
      [A('retinaNotas', '')],
      [A('examenes', 'Exámenes')],
      [A('examenesNotas', '')],
      [A('impresionDiagnostica', 'Impresión diagnóstica')],
      [A('impresionDiagnosticaNotas', '')],
      [A('tratamiento', 'Tratamiento')],
      [A('tratamientoNotas', '')],
    ],
  },
  {
    clave: 'cartilla3',
    filas: [
      [F('fecha', 'Fecha'), H('H.C. N.º')],
      [C('mdc', 'Mdc.')],
      [A('antecedentes', 'Antecedentes')],
      [C('optometriaAvScOd', 'Optometría AV SC OD'), C('optometriaAvScOi', 'OI')],
      [C('rxActualOd', 'Rx actual OD'), C('rxActualAvOd', 'Av')],
      [C('rxActualOi', 'OI'), C('rxActualAvOi', 'Av')],
      [C('adicionAo', 'Adición AO'), C('adicionAvAo', 'Av')],
      [C('retinoscopiaOd', 'Retinoscopía OD')],
      [C('retinoscopiaArOi', '(AR) OI')],
      [C('qtOd', 'QT: OD'), C('qtOi', 'QT: OI')],
      [T('Subjetivo'), C('subjetivoOjoDominante', 'Ojo dominante')],
      [C('subjetivoOd', 'OD'), C('subjetivoAvOd', 'AV')],
      [C('subjetivoOi', 'OI'), C('subjetivoAvOi', 'AV')],
      [C('subjetivoAdicion', 'Adición'), C('subjetivoAdicionAv', 'AV'), C('subjetivoDp', 'DP')],
      [C('imPcLaOd', 'IM / PC LA OD'), C('imPcLaOi', 'LA OI')],
      [C('qtOd2', 'QT: OD'), C('qtOi2', 'QT: OI')],
      [C('caOd', 'CA OD'), C('caOi', 'CA OI')],
    ],
  },
];

// Lista plana de claves de la cartilla, útil para inicializar valores vacíos.
export const CLAVES_CARTILLA = SECCIONES_CARTILLA.flatMap((s) =>
  s.filas.flat().filter((item) => item.clave && item.tipo !== 'historial').map((item) => item.clave),
);
