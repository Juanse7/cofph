// Campo estilo formulario impreso: etiqueta seguida de una línea inferior.
// Se usa en Datos Personales, Cartilla e Historial para que se vea como el documento original.

export function CampoLinea({
  etiqueta,
  valor,
  onChange,
  tipo = 'text',
  soloLectura = false,
  ancho = 'auto',
  placeholder,
  id,
  opciones,
  ayuda,
}) {
  const clases = ['linea', `linea--${ancho}`];
  if (soloLectura) clases.push('linea--lectura');

  let control;
  if (opciones) {
    control = (
      <select id={id} className="linea-input" value={valor ?? ''} disabled={soloLectura} onChange={(e) => onChange(e.target.value)}>
        <option value="">- Seleccionar -</option>
        {opciones.map((op) => {
          const v = typeof op === 'string' ? op : op.valor;
          const t = typeof op === 'string' ? op : op.etiqueta;
          return (
            <option key={v} value={v}>
              {t}
            </option>
          );
        })}
      </select>
    );
  } else if (tipo === 'checkbox') {
    control = (
      <input
        id={id}
        type="checkbox"
        className="linea-check"
        checked={Boolean(valor)}
        disabled={soloLectura}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  } else {
    control = (
      <input
        id={id}
        type={tipo}
        className="linea-input"
        value={valor ?? ''}
        readOnly={soloLectura}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <label className={clases.join(' ')}>
      {etiqueta && <span className="linea-etiqueta">{etiqueta}</span>}
      {control}
      {ayuda && <small className="linea-ayuda">{ayuda}</small>}
    </label>
  );
}

// Área de texto con líneas, para campos multilínea (en vez de caja típica).
export function AreaLinea({ etiqueta, valor, onChange, soloLectura = false, filas = 3, id, ancho = 'completo' }) {
  return (
    <label className={`linea linea--${ancho} linea--area ${soloLectura ? 'linea--lectura' : ''}`}>
      {etiqueta && <span className="linea-etiqueta">{etiqueta}</span>}
      <textarea
        id={id}
        className="linea-input linea-textarea"
        rows={filas}
        value={valor ?? ''}
        readOnly={soloLectura}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
