import { useMemo, useState } from 'react';
import CalendarioPopover from '../CalendarioPopover.jsx';
import RegistroDiv from './RegistroDiv.jsx';
import { OPCIONES_ACTIVIDADES, OPCIONES_STATUS_PACIENTE } from '../../data/opciones.js';
import { TIPO_ESTADO } from '../../data/historialRegistros.js';
import { hoyISO, normalizarFechaHora, parteFecha } from '../../utils/fechas.js';

// Orden por fecha y hora con segundos. Si dos registros empatan, va primero el guardado antes.
function compararRegistros(a, b) {
  return (
    normalizarFechaHora(a.fechaHora).localeCompare(normalizarFechaHora(b.fechaHora)) ||
    (a.creadoEn || '').localeCompare(b.creadoEn || '')
  );
}

// Panel derecho: filtros arriba y un div por cada registro guardado.
export default function PanelRegistros({ registros }) {
  const [filtroActividad, setFiltroActividad] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtrarPorFecha, setFiltrarPorFecha] = useState(false);
  const [fechaFiltro, setFechaFiltro] = useState(hoyISO);
  const [orden, setOrden] = useState('desc');

  const visibles = useMemo(() => {
    return registros
      .filter((r) => !filtroActividad || r.tipo === filtroActividad)
      .filter((r) => !filtroEstado || (r.tipo === TIPO_ESTADO && r.datos?.estado === filtroEstado))
      .filter((r) => !filtrarPorFecha || parteFecha(r.fechaHora) === fechaFiltro)
      .sort((a, b) => (orden === 'asc' ? compararRegistros(a, b) : compararRegistros(b, a)));
  }, [registros, filtroActividad, filtroEstado, filtrarPorFecha, fechaFiltro, orden]);

  return (
    <>
      <section className="tarjeta filtros-historial" aria-label="Filtros del historial">
        <div className="filtros-cabecera">
          <h3>Registros del historial</h3>
          <span className="insignia">
            {visibles.length} de {registros.length}
          </span>
        </div>

        <div className="filtros-grid">
          <label className="campo">
            <span className="campo-etiqueta">Actividad</span>
            <select className="entrada" value={filtroActividad} onChange={(e) => setFiltroActividad(e.target.value)}>
              <option value="">Todas las actividades</option>
              {OPCIONES_ACTIVIDADES.map((op) => (
                <option key={op.valor} value={op.valor}>
                  {op.etiqueta}
                </option>
              ))}
            </select>
          </label>

          <label className="campo">
            <span className="campo-etiqueta">Estado del paciente</span>
            <select className="entrada" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              {OPCIONES_STATUS_PACIENTE.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </label>

          <label className="campo">
            <span className="campo-etiqueta">Ordenar por fecha</span>
            <select className="entrada" value={orden} onChange={(e) => setOrden(e.target.value)}>
              <option value="desc">Descendente (más reciente primero)</option>
              <option value="asc">Ascendente (más antiguo primero)</option>
            </select>
          </label>

          <div className="filtro-fecha">
            <label className="casilla">
              <input type="checkbox" checked={filtrarPorFecha} onChange={(e) => setFiltrarPorFecha(e.target.checked)} />
              <span>Buscar por fecha</span>
            </label>
            {filtrarPorFecha && (
              <CalendarioPopover valor={fechaFiltro} onChange={setFechaFiltro} etiqueta="Fecha del registro" />
            )}
          </div>
        </div>
      </section>

      {visibles.length === 0 ? (
        <div className="tarjeta vacio">
          <strong>No hay registros con estos filtros</strong>
          <span>Guarde información desde el panel izquierdo o ajuste los filtros.</span>
        </div>
      ) : (
        <div className="lista-registros">
          {visibles.map((registro) => (
            <RegistroDiv key={registro.id} registro={registro} />
          ))}
        </div>
      )}
    </>
  );
}
