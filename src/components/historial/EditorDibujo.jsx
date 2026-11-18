import { useEffect, useRef, useState } from 'react';
import { useAlmacen } from '../../context/AlmacenContext.jsx';
import { TIPO_DIBUJO } from '../../data/historialRegistros.js';
import { ahoraDateTimeConSegundosISO } from '../../utils/fechas.js';

const ANCHO_LIENZO = 800;
const ALTO_LIENZO = 440;

const GROSORES = [
  { valor: 2, etiqueta: 'Fino (2 px)' },
  { valor: 4, etiqueta: 'Medio (4 px)' },
  { valor: 8, etiqueta: 'Grueso (8 px)' },
  { valor: 12, etiqueta: 'Muy grueso (12 px)' },
  { valor: 20, etiqueta: 'Extra grueso (20 px)' },
];

const PALETA = [
  { valor: '#111827', etiqueta: 'Negro' },
  { valor: '#dc2626', etiqueta: 'Rojo' },
  { valor: '#ea580c', etiqueta: 'Naranja' },
  { valor: '#ca8a04', etiqueta: 'Amarillo' },
  { valor: '#16a34a', etiqueta: 'Verde' },
  { valor: '#0891b2', etiqueta: 'Turquesa' },
  { valor: '#2563eb', etiqueta: 'Azul' },
  { valor: '#7c3aed', etiqueta: 'Morado' },
  { valor: '#db2777', etiqueta: 'Rosa' },
  { valor: '#78716c', etiqueta: 'Gris' },
  { valor: '#ffffff', etiqueta: 'Blanco (borrador)' },
];

// Desplegable de paleta de colores.
function SelectorColor({ valor, onChange }) {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef(null);
  const actual = PALETA.find((c) => c.valor === valor) || PALETA[0];

  useEffect(() => {
    if (!abierto) return undefined;
    function alPresionarMouse(evento) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target)) setAbierto(false);
    }
    document.addEventListener('mousedown', alPresionarMouse);
    return () => document.removeEventListener('mousedown', alPresionarMouse);
  }, [abierto]);

  return (
    <div className="selector-color" ref={contenedorRef}>
      <span className="barra-etiqueta">Color</span>
      <button
        type="button"
        className="selector-color-boton"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        onClick={() => setAbierto((previo) => !previo)}
      >
        <span className="muestra-color" style={{ background: actual.valor }} aria-hidden="true" />
        {actual.etiqueta}
        <span aria-hidden="true">▾</span>
      </button>

      {abierto && (
        <div className="selector-color-panel" role="listbox" aria-label="Paleta de colores">
          {PALETA.map((c) => (
            <button
              key={c.valor}
              type="button"
              role="option"
              aria-selected={c.valor === valor}
              aria-label={c.etiqueta}
              title={c.etiqueta}
              className={`muestra-opcion ${c.valor === valor ? 'muestra-opcion--activa' : ''}`}
              style={{ background: c.valor }}
              onClick={() => {
                onChange(c.valor);
                setAbierto(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Lienzo para dibujar. La barra superior tiene el grosor, la paleta y el botón Guardar.
export default function EditorDibujo({ idPaciente, onGuardado }) {
  const { agregarRegistroHistorial } = useAlmacen();
  const lienzoRef = useRef(null);
  const trazoRef = useRef(null);
  const [color, setColor] = useState(PALETA[0].valor);
  const [grosor, setGrosor] = useState(GROSORES[1].valor);
  const [hayTrazos, setHayTrazos] = useState(false);
  const [error, setError] = useState('');

  function limpiarLienzo() {
    const lienzo = lienzoRef.current;
    if (!lienzo) return;
    const ctx = lienzo.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, lienzo.width, lienzo.height);
    setHayTrazos(false);
    setError('');
  }

  // Fondo blanco desde el inicio para que la imagen guardada no quede transparente.
  useEffect(() => {
    limpiarLienzo();
  }, []);

  // Convierte la posición del puntero a coordenadas internas del lienzo.
  function posicion(evento) {
    const lienzo = lienzoRef.current;
    const rect = lienzo.getBoundingClientRect();
    return {
      x: ((evento.clientX - rect.left) * lienzo.width) / rect.width,
      y: ((evento.clientY - rect.top) * lienzo.height) / rect.height,
    };
  }

  function alPresionar(evento) {
    const lienzo = lienzoRef.current;
    lienzo.setPointerCapture(evento.pointerId);
    const punto = posicion(evento);
    const ctx = lienzo.getContext('2d');
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(punto.x, punto.y, grosor / 2, 0, Math.PI * 2);
    ctx.fill();
    trazoRef.current = punto;
    setHayTrazos(true);
    setError('');
  }

  function alMover(evento) {
    if (!trazoRef.current) return;
    const ctx = lienzoRef.current.getContext('2d');
    const punto = posicion(evento);
    ctx.strokeStyle = color;
    ctx.lineWidth = grosor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(trazoRef.current.x, trazoRef.current.y);
    ctx.lineTo(punto.x, punto.y);
    ctx.stroke();
    trazoRef.current = punto;
  }

  function alTerminar(evento) {
    trazoRef.current = null;
    const lienzo = lienzoRef.current;
    if (lienzo && lienzo.hasPointerCapture(evento.pointerId)) {
      lienzo.releasePointerCapture(evento.pointerId);
    }
  }

  function guardar() {
    if (!hayTrazos) {
      setError('Dibuje algo antes de guardar.');
      return;
    }
    const imagen = lienzoRef.current.toDataURL('image/png');
    agregarRegistroHistorial({
      idPaciente,
      tipo: TIPO_DIBUJO,
      fechaHora: ahoraDateTimeConSegundosISO(),
      datos: { imagen },
      archivos: [],
    });
    onGuardado();
  }

  return (
    <div className="editor-dibujo">
      <div className="lienzo-barra">
        <label className="barra-control">
          <span className="barra-etiqueta">Grosor del trazo</span>
          <select className="entrada" value={grosor} onChange={(e) => setGrosor(Number(e.target.value))}>
            {GROSORES.map((g) => (
              <option key={g.valor} value={g.valor}>
                {g.etiqueta}
              </option>
            ))}
          </select>
        </label>

        <SelectorColor valor={color} onChange={setColor} />

        <div className="lienzo-acciones">
          <button type="button" className="btn btn--secundario" onClick={limpiarLienzo}>
            Borrar todo
          </button>
          <button type="button" className="btn btn--primario" onClick={guardar}>
            Guardar
          </button>
        </div>
      </div>

      {error && (
        <div className="aviso aviso--error" role="alert">
          {error}
        </div>
      )}

      <canvas
        ref={lienzoRef}
        width={ANCHO_LIENZO}
        height={ALTO_LIENZO}
        className="lienzo"
        aria-label="Área de dibujo"
        onPointerDown={alPresionar}
        onPointerMove={alMover}
        onPointerUp={alTerminar}
        onPointerCancel={alTerminar}
      />
    </div>
  );
}
