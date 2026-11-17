import { useState } from 'react';
import { useAlmacen } from '../../context/AlmacenContext.jsx';
import { AreaLinea, CampoLinea } from '../CampoLinea.jsx';
import { OPCIONES_ACTIVIDADES } from '../../data/opciones.js';
import { DEFINICION_REGISTRO, campoFechaDe } from '../../data/historialRegistros.js';
import { ahoraDateTimeISO } from '../../utils/fechas.js';
import { Tarjeta } from './PanelIzquierdo.jsx';

function estadoInicial(definicion) {
  const inicial = {};
  definicion.campos.forEach((campo) => {
    inicial[campo.clave] = campo.fecha ? ahoraDateTimeISO() : '';
  });
  return inicial;
}

// Formulario de una actividad. Se genera desde DEFINICION_REGISTRO.
function FormularioActividad({ tipo, paciente }) {
  const { agregarRegistroHistorial } = useAlmacen();
  const definicion = DEFINICION_REGISTRO[tipo];
  const [datos, setDatos] = useState(() => estadoInicial(definicion));
  const [archivos, setArchivos] = useState([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Si el paciente no tiene seguro, el reporte no se puede guardar.
  const bloqueadoSinSeguro = definicion.campos.some((campo) => campo.soloLectura && campo.clave === 'seguro') && !paciente.seguro;

  function cambiar(clave) {
    return (valor) => {
      setDatos((previo) => ({ ...previo, [clave]: valor }));
      setError('');
      setMensaje('');
    };
  }

  function agregarArchivos(listaArchivos) {
    const nuevos = Array.from(listaArchivos).map((archivo) => ({ nombre: archivo.name, tamano: archivo.size }));
    setArchivos((previo) => [...previo, ...nuevos]);
    setMensaje('');
  }

  function quitarArchivo(indice) {
    setArchivos((previo) => previo.filter((_, i) => i !== indice));
  }

  function guardar(evento) {
    evento.preventDefault();
    if (bloqueadoSinSeguro) return;

    const claveFecha = campoFechaDe(tipo);
    if (!datos[claveFecha]) {
      setError('Indique la fecha del registro.');
      return;
    }

    const contenido = {};
    definicion.campos.forEach((campo) => {
      contenido[campo.clave] = campo.soloLectura && campo.clave === 'seguro' ? paciente.seguro : datos[campo.clave];
    });

    agregarRegistroHistorial({
      idPaciente: paciente.idPaciente,
      tipo,
      fechaHora: datos[claveFecha],
      datos: contenido,
      archivos: definicion.archivos ? archivos : [],
    });

    setDatos(estadoInicial(definicion));
    setArchivos([]);
    setMensaje('Registro agregado al historial.');
  }

  return (
    <form className="actividad-form" onSubmit={guardar}>
      {definicion.campos.map((campo) => {
        if (campo.soloLectura) {
          return (
            <div key={campo.clave} className="seguro-linea">
              <span className="seguro-etiqueta">{campo.etiqueta}</span>
              {paciente.seguro ? (
                <strong>{paciente.seguro}</strong>
              ) : (
                <strong className="texto-error">No tiene seguro</strong>
              )}
            </div>
          );
        }
        if (campo.fecha) {
          return (
            <CampoLinea
              key={campo.clave}
              etiqueta={campo.etiqueta}
              tipo="datetime-local"
              valor={datos[campo.clave]}
              onChange={cambiar(campo.clave)}
              ancho="completo"
            />
          );
        }
        if (campo.area) {
          return (
            <AreaLinea
              key={campo.clave}
              etiqueta={campo.etiqueta}
              valor={datos[campo.clave]}
              onChange={cambiar(campo.clave)}
              filas={4}
            />
          );
        }
        return (
          <CampoLinea
            key={campo.clave}
            etiqueta={campo.etiqueta}
            valor={datos[campo.clave]}
            onChange={cambiar(campo.clave)}
            ancho="completo"
          />
        );
      })}

      {definicion.archivos && (
        <div className="archivos-bloque">
          <div className="archivos-cabecera">
            <span className="campo-etiqueta">Archivos adjuntos</span>
            <label className="btn btn--secundario btn--pequeno">
              Subir archivos
              <input
                type="file"
                multiple
                className="sr-only"
                onChange={(e) => {
                  agregarArchivos(e.target.files);
                  e.target.value = '';
                }}
              />
            </label>
          </div>
          {archivos.length === 0 ? (
            <span className="ayuda">No hay archivos cargados.</span>
          ) : (
            <ul className="archivos-lista">
              {archivos.map((archivo, indice) => (
                <li key={`${archivo.nombre}-${indice}`}>
                  <span className="archivo-nombre">📄 {archivo.nombre}</span>
                  <button type="button" className="btn btn--texto" onClick={() => quitarArchivo(indice)}>
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {bloqueadoSinSeguro && (
        <div className="aviso aviso--advertencia" role="alert">
          No tiene seguro: este reporte no se puede guardar.
        </div>
      )}
      {error && (
        <div className="aviso aviso--error" role="alert">
          {error}
        </div>
      )}

      <div className="panel-acciones">
        <button type="submit" className="btn btn--primario" disabled={bloqueadoSinSeguro}>
          Guardar
        </button>
        {mensaje && (
          <span className="ayuda" role="status">
            {mensaje}
          </span>
        )}
      </div>
    </form>
  );
}

// div-actividades: el menú despliega el formulario correspondiente.
export default function TarjetaActividades({ paciente }) {
  const [tipo, setTipo] = useState('');

  return (
    <Tarjeta id="div-actividades" titulo="Actividades">
      <label className="campo">
        <span className="campo-etiqueta">Actividad</span>
        <select className="entrada" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">- Seleccionar una opción -</option>
          {OPCIONES_ACTIVIDADES.map((op) => (
            <option key={op.valor} value={op.valor}>
              {op.etiqueta}
            </option>
          ))}
        </select>
      </label>

      {tipo && <FormularioActividad key={tipo} tipo={tipo} paciente={paciente} />}
    </Tarjeta>
  );
}
