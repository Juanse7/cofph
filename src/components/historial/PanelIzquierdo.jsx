import { useState } from 'react';
import { useAlmacen } from '../../context/AlmacenContext.jsx';
import { CampoLinea, AreaLinea } from '../CampoLinea.jsx';
import { OPCIONES_STATUS_PACIENTE } from '../../data/opciones.js';
import { ETIQUETAS_DATOS_PERSONALES } from '../../data/etiquetas.js';
import { TIPO_ESTADO, TIPO_FACTURACION } from '../../data/historialRegistros.js';
import { ahoraDateTimeISO } from '../../utils/fechas.js';

function Tarjeta({ id, titulo, children }) {
  return (
    <section className="tarjeta panel-tarjeta" id={id} aria-label={titulo}>
      <header className="panel-tarjeta-cabecera">
        <h3>{titulo}</h3>
      </header>
      <div className="panel-tarjeta-cuerpo">{children}</div>
    </section>
  );
}

// div-datos-personales: resumen de los datos clave del paciente.
export function TarjetaDatosPersonales({ paciente }) {
  const resumen = [
    'idPaciente',
    'numeroDeHistorialClinico',
    'nombres',
    'apellidoPaterno',
    'apellidoMaterno',
    'cedula',
    'seguro',
  ];

  return (
    <Tarjeta id="div-datos-personales" titulo="Datos personales">
      <dl className="resumen-lista">
        {resumen.map((clave) => {
          const valor = clave === 'seguro' ? paciente.seguro || 'No tiene seguro' : paciente[clave];
          return (
            <div key={clave} className={`resumen-item ${clave === 'seguro' ? 'resumen-item--completo' : ''}`}>
              <dt>{ETIQUETAS_DATOS_PERSONALES[clave]}</dt>
              <dd>{valor || <span className="celda-tenue">—</span>}</dd>
            </div>
          );
        })}
      </dl>
    </Tarjeta>
  );
}

// div-statusIdPaciente: actualiza el estado oficial del paciente y agrega un registro al panel derecho.
export function TarjetaEstado({ paciente }) {
  const { actualizarEstadoPaciente, agregarRegistroHistorial } = useAlmacen();
  const [estado, setEstado] = useState(paciente.statusIdPaciente || '');
  const [mensaje, setMensaje] = useState('');

  function guardarEstado() {
    if (!estado) {
      setMensaje('Seleccione un estado.');
      return;
    }
    actualizarEstadoPaciente(paciente.idPaciente, estado);
    agregarRegistroHistorial({
      idPaciente: paciente.idPaciente,
      tipo: TIPO_ESTADO,
      fechaHora: ahoraDateTimeISO(),
      datos: { estado },
      archivos: [],
    });
    setMensaje('Estado guardado en el expediente.');
  }

  return (
    <Tarjeta id="div-statusIdPaciente" titulo="Estado del paciente">
      <label className="campo">
        <span className="campo-etiqueta">Estado del paciente</span>
        <select
          className="entrada"
          value={estado}
          onChange={(e) => {
            setEstado(e.target.value);
            setMensaje('');
          }}
        >
          <option value="">- Seleccionar -</option>
          {OPCIONES_STATUS_PACIENTE.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      </label>
      <div className="panel-acciones">
        <button type="button" className="btn btn--primario" onClick={guardarEstado}>
          Guardar estado del paciente
        </button>
        {mensaje && <span className="ayuda" role="status">{mensaje}</span>}
      </div>
    </Tarjeta>
  );
}

// div-apartadoDeFacturacion: ruc, facturaNumero y detalles.
export function TarjetaFacturacion({ paciente }) {
  const { agregarRegistroHistorial } = useAlmacen();
  const vacio = { ruc: '', facturaNumero: '', detalles: '' };
  const [datos, setDatos] = useState(vacio);
  const [mensaje, setMensaje] = useState('');

  function cambiar(clave) {
    return (valor) => {
      setDatos((previo) => ({ ...previo, [clave]: valor }));
      setMensaje('');
    };
  }

  function guardarFacturacion() {
    agregarRegistroHistorial({
      idPaciente: paciente.idPaciente,
      tipo: TIPO_FACTURACION,
      fechaHora: ahoraDateTimeISO(),
      datos: { ...datos },
      archivos: [],
    });
    setDatos(vacio);
    setMensaje('Facturación agregada al historial.');
  }

  return (
    <Tarjeta id="div-apartadoDeFacturacion" titulo="Apartado de facturación">
      <div className="panel-campos">
        <CampoLinea etiqueta="RUC" valor={datos.ruc} onChange={cambiar('ruc')} ancho="completo" />
        <CampoLinea etiqueta="N.º de factura" valor={datos.facturaNumero} onChange={cambiar('facturaNumero')} ancho="completo" />
        <AreaLinea etiqueta="Detalles" valor={datos.detalles} onChange={cambiar('detalles')} filas={3} />
      </div>
      <div className="panel-acciones">
        <button type="button" className="btn btn--primario" onClick={guardarFacturacion}>
          Guardar
        </button>
        {mensaje && <span className="ayuda" role="status">{mensaje}</span>}
      </div>
    </Tarjeta>
  );
}

export { Tarjeta };
