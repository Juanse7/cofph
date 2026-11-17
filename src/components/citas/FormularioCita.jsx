import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlmacen } from '../../context/AlmacenContext.jsx';
import LookupPacientes from './LookupPacientes.jsx';
import {
  OPCIONES_CONFIRMACION,
  OPCIONES_STATUS_PACIENTE,
  OPCIONES_TIPO_CONSULTA,
} from '../../data/opciones.js';
import { combinarFechaHora, formatearFecha, hoyISO, parteHora } from '../../utils/fechas.js';
import { apellidosPaternoPrimero } from '../../utils/pacientes.js';

function Campo({ etiqueta, children, completo = false, ayuda }) {
  return (
    <label className={`campo ${completo ? 'campo--completo' : ''}`}>
      <span className="campo-etiqueta">{etiqueta}</span>
      {children}
      {ayuda && <span className="ayuda">{ayuda}</span>}
    </label>
  );
}

function Seleccion({ valor, onChange, opciones, disabled }) {
  return (
    <select className="entrada" value={valor} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
      <option value="">- Seleccionar -</option>
      {opciones.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  );
}

function Casilla({ etiqueta, valor, onChange }) {
  return (
    <label className="casilla">
      <input type="checkbox" checked={valor} onChange={(e) => onChange(e.target.checked)} />
      <span>{etiqueta}</span>
    </label>
  );
}

// Formulario compartido de cita.
// modo 'editar': formCitas (campos de paciente bloqueados, se reciben desde la búsqueda).
// modo 'nueva': formCitasNew (incluye lookupFormCitas para elegir al paciente).
export default function FormularioCita({ modo, cita, fechaPrincipal, onGuardado, onCerrar }) {
  const esNueva = modo === 'nueva';
  const { obtenerPaciente, crearCita, actualizarCita } = useAlmacen();

  const [form, setForm] = useState(() =>
    esNueva
      ? {
          idPaciente: '',
          statusIdPaciente: '',
          llegadaHora: '09:00',
          hora: combinarFechaHora(fechaPrincipal, '09:00'),
          tipoDeConsulta: '',
          x: false,
          examen: '',
          qr: false,
          personaQueTomoLaCita: '',
          confirmacion: 'Pendiente',
          telefono: '',
          fechaEnQueSeTomoLaCita: hoyISO(),
          plan: '',
          rx: '',
        }
      : {
          idPaciente: cita.idPaciente,
          statusIdPaciente: cita.statusIdPaciente || '',
          llegadaHora: parteHora(cita.llegada),
          hora: cita.hora || '',
          tipoDeConsulta: cita.tipoDeConsulta || '',
          x: Boolean(cita.x),
          examen: cita.examen || '',
          qr: Boolean(cita.qr),
          personaQueTomoLaCita: cita.personaQueTomoLaCita || '',
          confirmacion: cita.confirmacion || '',
          telefono: cita.telefono || '',
          fechaEnQueSeTomoLaCita: (cita.fechaEnQueSeTomoLaCita || '').slice(0, 10),
          plan: cita.plan || '',
          rx: cita.rx || '',
        },
  );
  const [error, setError] = useState('');
  const [lookupAbierto, setLookupAbierto] = useState(false);

  const paciente = form.idPaciente ? obtenerPaciente(form.idPaciente) : null;

  function cambiar(campo) {
    return (valor) => {
      setForm((previo) => ({ ...previo, [campo]: valor }));
      setError('');
    };
  }

  function alSeleccionarPaciente(seleccionado) {
    setForm((previo) => ({
      ...previo,
      idPaciente: seleccionado.idPaciente,
      statusIdPaciente: seleccionado.statusIdPaciente || '',
      telefono: seleccionado.telefono || '',
    }));
    setLookupAbierto(false);
    setError('');
  }

  function guardar(evento) {
    evento.preventDefault();
    if (!paciente) {
      setError('Seleccione un paciente con el botón «Buscar paciente».');
      return;
    }
    if (!form.hora) {
      setError('Indique la fecha y la hora de la cita.');
      return;
    }

    const registro = {
      idPaciente: paciente.idPaciente,
      statusIdPaciente: form.statusIdPaciente,
      // La fecha de llegada siempre la define el calendario principal; solo cambia la hora.
      llegada: combinarFechaHora(fechaPrincipal, form.llegadaHora || '00:00'),
      hora: form.hora,
      tipoDeConsulta: form.tipoDeConsulta,
      x: form.x,
      examen: form.examen,
      qr: form.qr,
      personaQueTomoLaCita: form.personaQueTomoLaCita,
      confirmacion: form.confirmacion,
      telefono: form.telefono,
      fechaEnQueSeTomoLaCita: form.fechaEnQueSeTomoLaCita,
      plan: form.plan,
      rx: form.rx,
    };

    if (esNueva) {
      crearCita(registro);
      const fueraDeFecha = form.hora.slice(0, 10) !== fechaPrincipal;
      onGuardado(
        fueraDeFecha
          ? `Cita creada para el ${formatearFecha(form.hora)}. Cambie la fecha del calendario para verla.`
          : 'Cita creada correctamente.',
      );
    } else {
      actualizarCita(cita.idCita, registro);
      onGuardado('Cita actualizada correctamente.');
    }
  }

  return (
    <>
      <form className="form-cita" onSubmit={guardar} noValidate>
        {error && <div className="aviso aviso--error" role="alert">{error}</div>}

        <section className="form-seccion">
          <div className="form-seccion-cabecera">
            <h3>Datos del paciente</h3>
            {esNueva && (
              <button type="button" className="btn btn--secundario" onClick={() => setLookupAbierto(true)}>
                Buscar paciente
              </button>
            )}
          </div>

          <div className="form-grid">
            <Campo etiqueta="ID paciente">
              <input className="entrada" readOnly value={paciente?.idPaciente ?? ''} placeholder="Sin paciente" />
            </Campo>
            <Campo etiqueta="N.º historial clínico">
              <input className="entrada" readOnly value={paciente?.numeroDeHistorialClinico ?? ''} />
            </Campo>
            <Campo etiqueta="Nombres">
              <input className="entrada" readOnly value={paciente?.nombres ?? ''} />
            </Campo>
            <Campo etiqueta="Apellido paterno">
              <input className="entrada" readOnly value={paciente?.apellidoPaterno ?? ''} />
            </Campo>
            <Campo etiqueta="Apellido materno">
              <input className="entrada" readOnly value={paciente?.apellidoMaterno ?? ''} />
            </Campo>
            <Campo etiqueta="Seguro médico">
              <input
                className="entrada"
                readOnly
                value={paciente ? paciente.seguro || 'No tiene seguro' : ''}
              />
            </Campo>
            <Campo etiqueta="Estado del paciente">
              <Seleccion valor={form.statusIdPaciente} onChange={cambiar('statusIdPaciente')} opciones={OPCIONES_STATUS_PACIENTE} />
            </Campo>
            <Campo etiqueta="Teléfono">
              <input
                className="entrada"
                type="tel"
                value={form.telefono}
                onChange={(e) => cambiar('telefono')(e.target.value)}
              />
            </Campo>
          </div>

          {paciente && !esNueva && (
            <div className="form-enlace">
              <Link className="btn btn--texto" to={`/DatosPersonales?idPaciente=${paciente.idPaciente}`}>
                Ver datos personales de {apellidosPaternoPrimero(paciente)}
              </Link>
            </div>
          )}
        </section>

        <section className="form-seccion">
          <h3>Datos de la cita</h3>
          <div className="form-grid">
            <Campo etiqueta={`Llegada (fecha ${formatearFecha(fechaPrincipal)})`} ayuda="La fecha la define el calendario principal">
              <input
                className="entrada"
                type="time"
                value={form.llegadaHora}
                onChange={(e) => cambiar('llegadaHora')(e.target.value)}
              />
            </Campo>
            <Campo etiqueta="Hora" ayuda="Puede cambiar la fecha y la hora">
              <input
                className="entrada"
                type="datetime-local"
                value={form.hora}
                onChange={(e) => cambiar('hora')(e.target.value)}
              />
            </Campo>
            <Campo etiqueta="Tipo de consulta">
              <Seleccion valor={form.tipoDeConsulta} onChange={cambiar('tipoDeConsulta')} opciones={OPCIONES_TIPO_CONSULTA} />
            </Campo>
            <Campo etiqueta="Confirmación">
              <Seleccion valor={form.confirmacion} onChange={cambiar('confirmacion')} opciones={OPCIONES_CONFIRMACION} />
            </Campo>
            <Campo etiqueta="Persona que tomó la cita">
              <input
                className="entrada"
                value={form.personaQueTomoLaCita}
                onChange={(e) => cambiar('personaQueTomoLaCita')(e.target.value)}
              />
            </Campo>
            <Campo etiqueta="Fecha en que se tomó la cita">
              <input
                className="entrada"
                type="date"
                value={form.fechaEnQueSeTomoLaCita}
                onChange={(e) => cambiar('fechaEnQueSeTomoLaCita')(e.target.value)}
              />
            </Campo>
            <Campo etiqueta="Examen">
              <input className="entrada" value={form.examen} onChange={(e) => cambiar('examen')(e.target.value)} />
            </Campo>
            <Campo etiqueta="Plan">
              <input className="entrada" value={form.plan} onChange={(e) => cambiar('plan')(e.target.value)} />
            </Campo>
            <Campo etiqueta="Rx">
              <input className="entrada" value={form.rx} onChange={(e) => cambiar('rx')(e.target.value)} />
            </Campo>
          </div>

          <div className="form-casillas">
            <Casilla etiqueta="X" valor={form.x} onChange={cambiar('x')} />
            <Casilla etiqueta="QR" valor={form.qr} onChange={cambiar('qr')} />
          </div>
        </section>

        <footer className="form-pie">
          <button type="button" className="btn btn--secundario" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primario">
            {esNueva ? 'Crear Cita' : 'Guardar cambios'}
          </button>
        </footer>
      </form>

      {lookupAbierto && (
        <LookupPacientes onSeleccionar={alSeleccionarPaciente} onCerrar={() => setLookupAbierto(false)} />
      )}
    </>
  );
}
