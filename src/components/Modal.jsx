import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

// Pila de modales abiertos: solo el de encima responde a Escape.
const pilaModales = [];

// Ventana emergente genérica, dibujada fuera del árbol principal (portal).
export default function Modal({ titulo, onCerrar, children, ancho = 'md', pie }) {
  const id = useId();
  const cerrarRef = useRef(onCerrar);
  cerrarRef.current = onCerrar;

  useEffect(() => {
    pilaModales.push(id);
    document.body.classList.add('bloqueado');

    function alPresionarTecla(evento) {
      if (evento.key === 'Escape' && pilaModales[pilaModales.length - 1] === id) {
        cerrarRef.current();
      }
    }
    document.addEventListener('keydown', alPresionarTecla);

    return () => {
      document.removeEventListener('keydown', alPresionarTecla);
      const indice = pilaModales.indexOf(id);
      if (indice >= 0) pilaModales.splice(indice, 1);
      if (pilaModales.length === 0) document.body.classList.remove('bloqueado');
    };
  }, [id]);

  return createPortal(
    <div className="modal-fondo" onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}>
      <div className={`modal modal--${ancho}`} role="dialog" aria-modal="true" aria-label={titulo}>
        <header className="modal-cabecera">
          <h2>{titulo}</h2>
          <button type="button" className="btn btn--icono" aria-label="Cerrar" onClick={onCerrar}>
            ×
          </button>
        </header>
        <div className="modal-cuerpo">{children}</div>
        {pie && <footer className="modal-pie">{pie}</footer>}
      </div>
    </div>,
    document.body,
  );
}
