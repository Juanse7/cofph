import { useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAlmacen } from '../context/AlmacenContext.jsx';
import { AreaLinea, CampoLinea } from '../components/CampoLinea.jsx';
import { SECCIONES_CARTILLA } from '../data/cartillaCampos.js';
import { ahoraDateTimeISO, formatearFechaHora } from '../utils/fechas.js';
import { nombreCompleto } from '../utils/pacientes.js';

// Renderiza un campo de la cartilla según su tipo.
function CampoCartilla({ item, valor, onChange, paciente }) {
  if (item.tipo === 'subtitulo') {
    return <span className="cartilla-subtitulo">{item.etiqueta}</span>;
  }
  if (item.tipo === 'historial') {
    return (
      <CampoLinea
        etiqueta={item.etiqueta}
        valor={paciente.numeroDeHistorialClinico}
        soloLectura
        ancho="corto"
      />
    );
  }
  if (item.tipo === 'fecha') {
    return (
      <CampoLinea
        etiqueta={item.etiqueta}
        tipo="date"
        valor={valor}
        onChange={onChange}
        ancho="corto"
      />
    );
  }
  if (item.tipo === 'area') {
    return (
      <AreaLinea
        etiqueta={item.etiqueta}
        valor={valor}
        onChange={onChange}
        filas={2}
        ancho="completo"
      />
    );
  }
  return <CampoLinea etiqueta={item.etiqueta} valor={valor} onChange={onChange} ancho="auto" />;
}

// Main div: la hoja de la cartilla. Siempre va encima de los seguimientos.
function CartillaPrincipal({ paciente, idPaciente }) {
  const { obtenerCartilla, guardarCartilla } = useAlmacen();
  const [valores, setValores] = useState(() => obtenerCartilla(idPaciente));
  const [mensaje, setMensaje] = useState('');

  function cambiar(clave) {
    return (valor) => {
      setValores((previo) => ({ ...previo, [clave]: valor }));
      setMensaje('');
    };
  }

  function guardar(evento) {
    evento.preventDefault();
    guardarCartilla(idPaciente, valores);
    setMensaje('Cartilla guardada correctamente.');
  }

  return (
    <form className="hoja-papel hoja-papel--cartilla" onSubmit={guardar}>
      <header className="papel-encabezado papel-encabezado--cartilla">
        <span className="papel-marca">COFPH · Cartilla</span>
        <h2 className="papel-titulo">Cartilla oftalmológica</h2>
      </header>

      {SECCIONES_CARTILLA.map((seccion) => (
        <section key={seccion.clave} className="cartilla-seccion">
          {seccion.titulo && <h3 className="cartilla-titulo-seccion">{seccion.titulo}</h3>}
          <div className="papel-cuerpo">
            {seccion.filas.map((fila, indiceFila) => (
              <div className="cartilla-fila" key={`${seccion.clave}-${indiceFila}`}>
                {fila.map((item) => (
                  <CampoCartilla
                    key={item.clave ?? item.etiqueta}
                    item={item}
                    valor={item.clave ? valores[item.clave] ?? '' : ''}
                    onChange={item.clave ? cambiar(item.clave) : undefined}
                    paciente={paciente}
                  />
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}

      <footer className="papel-pie">
        {mensaje && <span className="papel-mensaje" role="status">{mensaje}</span>}
        <button type="submit" className="btn btn--primario">
          Guardar cartilla
        </button>
      </footer>
    </form>
  );
}

// Seguimientos: se muestran debajo del main div, de más antiguo a más reciente.
// El bloque "Nuevo seguimiento" queda al final.
function Seguimientos({ idPaciente }) {
  const { seguimientos, agregarSeguimiento } = useAlmacen();
  const [fechaHora, setFechaHora] = useState(ahoraDateTimeISO);
  const [texto, setTexto] = useState('');

  const lista = useMemo(
    () =>
      seguimientos
        .filter((s) => s.idPaciente === idPaciente)
        .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora)),
    [seguimientos, idPaciente],
  );

  function guardarSeguimiento() {
    if (!texto.trim() || !fechaHora) return;
    agregarSeguimiento(idPaciente, { fechaHora, texto: texto.trim() });
    setTexto('');
    setFechaHora(ahoraDateTimeISO());
  }

  return (
    <section className="seguimientos" aria-label="Seguimientos">
      <div className="seguimientos-cabecera">
        <h2>Seguimientos</h2>
        <span className="insignia">{lista.length}</span>
      </div>

      {lista.map((seguimiento) => (
        <article key={seguimiento.id} className="tarjeta seguimiento">
          <header className="seguimiento-cabecera">
            <span className="seguimiento-fecha">{formatearFechaHora(seguimiento.fechaHora)}</span>
          </header>
          <p className="seguimiento-texto">{seguimiento.texto}</p>
        </article>
      ))}

      <article className="tarjeta seguimiento seguimiento--nuevo">
        <h3>Nuevo seguimiento</h3>
        <div className="seguimiento-campos">
          <label className="campo">
            <span className="campo-etiqueta">Fecha y hora</span>
            <input
              type="datetime-local"
              className="entrada"
              value={fechaHora}
              onChange={(e) => setFechaHora(e.target.value)}
            />
          </label>
          <label className="campo campo--completo">
            <span className="campo-etiqueta">Seguimiento</span>
            <textarea
              className="entrada"
              rows={4}
              placeholder="Escriba la evolución o nota del seguimiento"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </label>
        </div>
        <div className="seguimiento-pie">
          <button
            type="button"
            className="btn btn--primario"
            disabled={!texto.trim() || !fechaHora}
            onClick={guardarSeguimiento}
          >
            Guardar seguimiento
          </button>
        </div>
      </article>
    </section>
  );
}

export default function Cartilla() {
  const [params] = useSearchParams();
  const { key: claveUbicacion } = useLocation();
  const { obtenerPaciente } = useAlmacen();

  const idPaciente = params.get('idPaciente') || '';
  const paciente = idPaciente ? obtenerPaciente(idPaciente) : null;

  if (!paciente) {
    return (
      <div className="pagina">
        <div className="tarjeta vacio">
          <strong>No se encontró el paciente solicitado</strong>
          <span>Seleccione un paciente desde la lista para abrir su cartilla.</span>
          <Link to="/Pacientes" className="btn btn--primario">Ir a Pacientes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina">
      <header className="pagina-cabecera">
        <div className="pagina-titulo">
          <Link to="/Pacientes" className="migaja">← Pacientes</Link>
          <h1>Cartilla</h1>
          <p>
            {nombreCompleto(paciente)} · ID {paciente.idPaciente}
          </p>
        </div>
        <div className="acciones-cabecera">
          <Link to={`/DatosPersonales?idPaciente=${paciente.idPaciente}`} className="btn btn--secundario">
            Datos personales
          </Link>
          <Link to={`/Historial?idPaciente=${paciente.idPaciente}`} className="btn btn--secundario">
            Historial
          </Link>
        </div>
      </header>

      <CartillaPrincipal key={`${idPaciente}-${claveUbicacion}`} paciente={paciente} idPaciente={idPaciente} />
      <Seguimientos idPaciente={idPaciente} />
    </div>
  );
}
