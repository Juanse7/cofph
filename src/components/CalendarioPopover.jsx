import { useEffect, useRef, useState } from 'react';
import { fechaAObjeto, fechaDesdeDate, formatearFecha, hoyISO, parteFecha } from '../utils/fechas.js';

const ENCABEZADOS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function construirDias(anio, mes) {
  const primero = new Date(anio, mes, 1);
  const desfase = (primero.getDay() + 6) % 7; // la semana empieza en lunes
  return Array.from({ length: 42 }, (_, i) => new Date(anio, mes, 1 - desfase + i));
}

function mesDeValor(valor) {
  const base = fechaAObjeto(valor) || new Date();
  return new Date(base.getFullYear(), base.getMonth(), 1);
}

// Campo de fecha con calendario desplegable.
// Se abre al hacer clic; se cierra al hacer clic fuera o al elegir una fecha.
export default function CalendarioPopover({ valor, onChange, etiqueta, alineacion = 'izquierda', id }) {
  const [abierto, setAbierto] = useState(false);
  const [mesVista, setMesVista] = useState(() => mesDeValor(valor));
  const contenedorRef = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    function alPresionarMouse(evento) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target)) {
        setAbierto(false);
      }
    }
    function alPresionarTecla(evento) {
      if (evento.key === 'Escape') setAbierto(false);
    }
    document.addEventListener('mousedown', alPresionarMouse);
    document.addEventListener('keydown', alPresionarTecla);
    return () => {
      document.removeEventListener('mousedown', alPresionarMouse);
      document.removeEventListener('keydown', alPresionarTecla);
    };
  }, [abierto]);

  function alAbrir() {
    setMesVista(mesDeValor(valor));
    setAbierto((previo) => !previo);
  }

  function elegirFecha(fecha) {
    onChange(fechaDesdeDate(fecha));
    setAbierto(false);
  }

  const dias = construirDias(mesVista.getFullYear(), mesVista.getMonth());
  const nombreMes = capitalizar(mesVista.toLocaleDateString('es', { month: 'long', year: 'numeric' }));
  const seleccionado = parteFecha(valor);
  const hoy = hoyISO();

  return (
    <div className="cal-wrap" ref={contenedorRef}>
      {etiqueta && <span className="cal-etiqueta">{etiqueta}</span>}
      <button
        type="button"
        id={id}
        className="cal-trigger"
        onClick={alAbrir}
        aria-haspopup="dialog"
        aria-expanded={abierto}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>{formatearFecha(valor) || 'Seleccionar fecha'}</span>
      </button>

      {abierto && (
        <div className={`cal-popover cal-popover--${alineacion}`} role="dialog" aria-label="Calendario">
          <div className="cal-header">
            <button
              type="button"
              className="cal-nav"
              aria-label="Mes anterior"
              onClick={() => setMesVista(new Date(mesVista.getFullYear(), mesVista.getMonth() - 1, 1))}
            >
              ‹
            </button>
            <strong>{nombreMes}</strong>
            <button
              type="button"
              className="cal-nav"
              aria-label="Mes siguiente"
              onClick={() => setMesVista(new Date(mesVista.getFullYear(), mesVista.getMonth() + 1, 1))}
            >
              ›
            </button>
          </div>

          <div className="cal-grid cal-grid--encabezado">
            {ENCABEZADOS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="cal-grid">
            {dias.map((dia) => {
              const iso = fechaDesdeDate(dia);
              const clases = ['cal-dia'];
              if (dia.getMonth() !== mesVista.getMonth()) clases.push('cal-dia--otro');
              if (iso === hoy) clases.push('cal-dia--hoy');
              if (iso === seleccionado) clases.push('cal-dia--sel');
              return (
                <button key={iso} type="button" className={clases.join(' ')} onClick={() => elegirFecha(dia)}>
                  {dia.getDate()}
                </button>
              );
            })}
          </div>

          <div className="cal-pie">
            <button type="button" className="btn btn--texto" onClick={() => elegirFecha(new Date())}>
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
