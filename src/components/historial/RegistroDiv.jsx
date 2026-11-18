import { DEFINICION_REGISTRO } from '../../data/historialRegistros.js';
import { formatearFechaHora, formatearFechaHoraCompleta } from '../../utils/fechas.js';

function formatearTamano(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Un registro guardado desde el panel izquierdo. Cada uno es su propio div.
export default function RegistroDiv({ registro }) {
  const definicion = DEFINICION_REGISTRO[registro.tipo];
  if (!definicion) return null;

  return (
    <article className={`tarjeta registro registro--${registro.tipo}`}>
      <header className="registro-cabecera">
        <span className="registro-tipo">{definicion.titulo}</span>
        <time className="registro-fecha" dateTime={registro.fechaHora}>
          {formatearFechaHoraCompleta(registro.fechaHora)}
        </time>
      </header>

      <dl className="registro-datos">
        {definicion.campos.map((campo) => {
          const valor = registro.datos?.[campo.clave];
          if (campo.imagen) {
            return (
              <div key={campo.clave} className="registro-dato registro-dato--area">
                <dd>
                  {valor ? (
                    <img className="registro-imagen" src={valor} alt={campo.etiqueta} />
                  ) : (
                    <span className="celda-tenue">Sin contenido</span>
                  )}
                </dd>
              </div>
            );
          }
          // Campos que solo muestran su valor: el título del registro ya indica qué es.
          if (campo.soloValor) {
            return (
              <div key={campo.clave} className="registro-dato registro-dato--valor">
                <dd>{valor || <span className="celda-tenue">—</span>}</dd>
              </div>
            );
          }
          const texto = campo.fecha ? formatearFechaHora(valor) : valor;
          return (
            <div key={campo.clave} className={campo.area ? 'registro-dato registro-dato--area' : 'registro-dato'}>
              <dt>{campo.etiqueta}</dt>
              <dd>{texto || <span className="celda-tenue">—</span>}</dd>
            </div>
          );
        })}
      </dl>

      {definicion.archivos && (
        <div className="registro-archivos">
          <span className="registro-archivos-titulo">Archivos adjuntos</span>
          {registro.archivos?.length ? (
            <ul>
              {registro.archivos.map((archivo, indice) => (
                <li key={`${archivo.nombre}-${indice}`}>
                  <span className="archivo-icono" aria-hidden="true">📄</span>
                  <span className="archivo-nombre">{archivo.nombre}</span>
                  <small>{formatearTamano(archivo.tamano)}</small>
                </li>
              ))}
            </ul>
          ) : (
            <span className="celda-tenue">Sin archivos</span>
          )}
        </div>
      )}
    </article>
  );
}
