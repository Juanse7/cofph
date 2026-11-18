import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlmacen } from '../context/AlmacenContext.jsx';
import Modal from '../components/Modal.jsx';
import CalendarioPopover from '../components/CalendarioPopover.jsx';
import FormularioCita from '../components/citas/FormularioCita.jsx';
import { OPCIONES_ESTADO_CITAS } from '../data/opciones.js';
import { estaActiva } from '../utils/citas.js';
import {
  formatearFecha,
  formatearFechaHora,
  formatearFechaLarga,
  hoyISO,
  parteFecha,
} from '../utils/fechas.js';

const siNo = (valor) => (valor ? 'Sí' : 'No');

// Columnas de la cuadrícula, en el orden pedido.
// Los datos del paciente se obtienen por búsqueda (lookup) usando idPaciente.
const COLUMNAS = [
  { etiqueta: 'ID paciente', valor: (c, p) => p?.idPaciente ?? c.idPaciente, clase: 'celda-numero' },
  { etiqueta: 'Estado del paciente', valor: (c, p) => p?.statusIdPaciente },
  {
    etiqueta: 'Llegada',
    valor: (c) => formatearFechaHora(c.llegada),
    // Llegada posterior a la hora de la cita: se marca en rojo claro.
    claseCelda: (c) => (c.llegada > c.hora ? 'celda-llegada-tarde' : ''),
  },
  { etiqueta: 'Hora', valor: (c) => formatearFechaHora(c.hora) },
  { etiqueta: 'Nombres', valor: (c, p) => p?.nombres },
  { etiqueta: 'Apellido paterno', valor: (c, p) => p?.apellidoPaterno },
  { etiqueta: 'Apellido materno', valor: (c, p) => p?.apellidoMaterno },
  { etiqueta: 'N.º historial clínico', valor: (c, p) => p?.numeroDeHistorialClinico, clase: 'celda-numero' },
  { etiqueta: 'Tipo de consulta', valor: (c) => c.tipoDeConsulta },
  { etiqueta: 'Seguro médico', valor: (c, p) => (p ? p.seguro || 'No tiene seguro' : '') },
  { etiqueta: 'X', valor: (c) => siNo(c.x) },
  { etiqueta: 'Examen', valor: (c) => c.examen },
  { etiqueta: 'QR', valor: (c) => siNo(c.qr) },
  { etiqueta: 'Persona que tomó la cita', valor: (c) => c.personaQueTomoLaCita },
  { etiqueta: 'Confirmación', valor: (c) => c.confirmacion },
  { etiqueta: 'Teléfono', valor: (c, p) => p?.telefono, clase: 'celda-numero' },
  { etiqueta: 'Fecha en que se tomó la cita', valor: (c) => formatearFecha(c.fechaEnQueSeTomoLaCita) },
  { etiqueta: 'Plan', valor: (c) => c.plan },
  { etiqueta: 'Rx', valor: (c) => c.rx },
  { etiqueta: 'Estado de citas', valor: (c) => (estaActiva(c) ? 'Activa' : 'Cancelada') },
];

export default function Citas() {
  const { citas, obtenerPaciente } = useAlmacen();
  const [fechaPrincipal, setFechaPrincipal] = useState(hoyISO);
  const [estadoCitas, setEstadoCitas] = useState('Activas');
  const [modal, setModal] = useState(null); // null | { tipo: 'nueva' } | { tipo: 'editar', cita }
  const [aviso, setAviso] = useState('');

  // Citas cuya fecha de "Hora" coincide con el calendario principal y que cumplen el "Estado de citas".
  const citasDelDia = useMemo(
    () =>
      citas
        .filter((c) => parteFecha(c.hora) === fechaPrincipal)
        .filter((c) => estadoCitas === 'Todas' || (estadoCitas === 'Activas') === estaActiva(c))
        .sort((a, b) => a.hora.localeCompare(b.hora)),
    [citas, fechaPrincipal, estadoCitas],
  );

  function cambiarFecha(nuevaFecha) {
    setFechaPrincipal(nuevaFecha);
    setAviso('');
  }

  function cerrar() {
    setModal(null);
  }

  function alGuardar(mensaje) {
    setModal(null);
    setAviso(mensaje);
  }

  return (
    <div className="pagina">
      <header className="pagina-cabecera citas-cabecera">
        <div className="pagina-titulo">
          <Link to="/" className="migaja">← Inicio</Link>
          <h1>Calendario de citas</h1>
          <p>{formatearFechaLarga(fechaPrincipal)}</p>
        </div>

        <div className="citas-controles">
          <button type="button" className="btn btn--primario btn--grande" onClick={() => setModal({ tipo: 'nueva' })}>
            + Nueva cita
          </button>
          <CalendarioPopover
            id="fecha-principal"
            etiqueta="Fecha de citas"
            valor={fechaPrincipal}
            onChange={cambiarFecha}
            alineacion="derecha"
          />
          <label className="campo campo--estado">
            <span className="campo-etiqueta">Estado de citas</span>
            <select className="entrada" value={estadoCitas} onChange={(e) => setEstadoCitas(e.target.value)}>
              {OPCIONES_ESTADO_CITAS.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      {aviso && (
        <div className="aviso aviso--info" role="status">
          {aviso}
        </div>
      )}

      <section className="tarjeta citas-seccion">
        <div className="citas-seccion-cabecera">
          <h2>
            Citas del día <span className="insignia">{citasDelDia.length}</span>
          </h2>
          <span className="ayuda">Haga clic en una fila para editar la cita. Las llegadas posteriores a la hora se marcan en rojo.</span>
        </div>

        <div className="hoja hoja--citas">
          <table>
            <thead>
              <tr>
                {COLUMNAS.map((col) => (
                  <th key={col.etiqueta}>{col.etiqueta}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {citasDelDia.length === 0 && (
                <tr className="fila--vacia">
                  <td colSpan={COLUMNAS.length}>
                    No hay citas para esta fecha y estado seleccionados. Use «+ Nueva cita» para registrar una.
                  </td>
                </tr>
              )}
              {citasDelDia.map((cita) => {
                const paciente = obtenerPaciente(cita.idPaciente);
                return (
                  <tr key={cita.idCita} onClick={() => setModal({ tipo: 'editar', cita })} title="Editar cita">
                    {COLUMNAS.map((col) => (
                      <td key={col.etiqueta} className={[col.clase, col.claseCelda?.(cita, paciente)].filter(Boolean).join(' ')}>
                        {col.valor(cita, paciente) || <span className="celda-tenue">—</span>}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {modal?.tipo === 'nueva' && (
        <Modal titulo="Nueva cita" ancho="xl" onCerrar={cerrar}>
          <FormularioCita modo="nueva" fechaPrincipal={fechaPrincipal} onGuardado={alGuardar} onCerrar={cerrar} />
        </Modal>
      )}

      {modal?.tipo === 'editar' && (
        <Modal titulo="Editar cita" ancho="xl" onCerrar={cerrar}>
          <FormularioCita
            key={modal.cita.idCita}
            modo="editar"
            cita={modal.cita}
            fechaPrincipal={fechaPrincipal}
            onGuardado={alGuardar}
            onCerrar={cerrar}
          />
        </Modal>
      )}
    </div>
  );
}
