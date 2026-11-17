import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAlmacen } from '../context/AlmacenContext.jsx';
import { apellidosPaternoPrimero, buscarPacientes } from '../utils/pacientes.js';

const ACCIONES = [
  { ruta: '/DatosPersonales', etiqueta: 'Datos Personales' },
  { ruta: '/Cartilla', etiqueta: 'Cartilla' },
  { ruta: '/Historial', etiqueta: 'Historial' },
];

function MenuAcciones({ idPaciente }) {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    function alPresionarMouse(evento) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target)) setAbierto(false);
    }
    document.addEventListener('mousedown', alPresionarMouse);
    return () => document.removeEventListener('mousedown', alPresionarMouse);
  }, [abierto]);

  return (
    <div className="menu-desplegable" ref={contenedorRef}>
      <button
        type="button"
        className="btn btn--secundario"
        aria-haspopup="menu"
        aria-expanded={abierto}
        onClick={() => setAbierto((previo) => !previo)}
      >
        Acciones
        <span aria-hidden="true">▾</span>
      </button>
      {abierto && (
        <div className="menu-desplegable-lista" role="menu">
          {ACCIONES.map((accion) => (
            <Link
              key={accion.ruta}
              role="menuitem"
              to={`${accion.ruta}?idPaciente=${encodeURIComponent(idPaciente)}`}
              onClick={() => setAbierto(false)}
            >
              {accion.etiqueta}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Dato({ etiqueta, children, ancho }) {
  return (
    <div className={`dato ${ancho ? `dato--${ancho}` : ''}`}>
      <span className="dato-etiqueta">{etiqueta}</span>
      <span className="dato-valor">{children || <em className="sin-dato">Sin dato</em>}</span>
    </div>
  );
}

export default function Pacientes() {
  const navigate = useNavigate();
  const { pacientes } = useAlmacen();
  const [textoBuscado, setTextoBuscado] = useState('');
  const [busquedaAplicada, setBusquedaAplicada] = useState('');

  const resultados = buscarPacientes(pacientes, busquedaAplicada);

  function ejecutarBusqueda(evento) {
    evento.preventDefault();
    setBusquedaAplicada(textoBuscado);
  }

  return (
    <div className="pagina">
      <header className="pagina-cabecera">
        <div className="pagina-titulo">
          <Link to="/" className="migaja">← Inicio</Link>
          <h1>Pacientes</h1>
          <p>Registros oficiales de cada paciente. Busque por cualquier dato.</p>
        </div>
      </header>

      <form className="barra-busqueda tarjeta" onSubmit={ejecutarBusqueda} role="search">
        <label className="barra-busqueda-campo">
          <span className="sr-only">Buscar paciente</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            className="barra-busqueda-input"
            placeholder="ID, historial, estado, nombres, apellidos, cédula, seguro, e-mail o teléfono"
            value={textoBuscado}
            onChange={(e) => setTextoBuscado(e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn--primario">
          Buscar
        </button>
        <button type="button" className="btn btn--secundario" onClick={() => navigate('/DatosPersonales?modo=nuevo')}>
          + Nuevo Datos Personales
        </button>
      </form>

      <div className="resumen-resultados">
        <span>
          <strong>{resultados.length}</strong> de {pacientes.length} registros
        </span>
        {busquedaAplicada && (
          <button
            type="button"
            className="btn btn--texto"
            onClick={() => {
              setTextoBuscado('');
              setBusquedaAplicada('');
            }}
          >
            Limpiar búsqueda
          </button>
        )}
      </div>

      {resultados.length === 0 ? (
        <div className="tarjeta vacio">
          <strong>No se encontraron pacientes</strong>
          <span>Pruebe con otro término o cree un nuevo registro.</span>
        </div>
      ) : (
        <ul className="lista-pacientes">
          {resultados.map((p) => (
            <li key={p.idPaciente} className="tarjeta fila-paciente">
              <div className="fila-paciente-datos">
                <Dato etiqueta="ID paciente" ancho="corto">
                  <strong className="id-paciente">{p.idPaciente}</strong>
                </Dato>
                <Dato etiqueta="Estado del paciente" ancho="medio">
                  <span className="insignia">{p.statusIdPaciente}</span>
                </Dato>
                <Dato etiqueta="N.º de historial clínico" ancho="corto">
                  {p.numeroDeHistorialClinico}
                </Dato>
                <Dato etiqueta="Nombres" ancho="medio">
                  {p.nombres}
                </Dato>
                <Dato etiqueta="Apellidos" ancho="medio">
                  {apellidosPaternoPrimero(p)}
                </Dato>
                <Dato etiqueta="Cédula" ancho="corto">
                  {p.cedula}
                </Dato>
                <Dato etiqueta="Seguro" ancho="medio">
                  {p.seguro || 'No tiene seguro'}
                </Dato>
                <Dato etiqueta="E-mail" ancho="medio">
                  {p.email}
                </Dato>
                <Dato etiqueta="Teléfono" ancho="corto">
                  {p.telefono}
                </Dato>
              </div>
              <div className="fila-paciente-acciones">
                <MenuAcciones idPaciente={p.idPaciente} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
