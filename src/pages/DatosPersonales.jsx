import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAlmacen } from '../context/AlmacenContext.jsx';
import { CampoLinea } from '../components/CampoLinea.jsx';
import { OPCIONES_ESTADO_CIVIL, OPCIONES_STATUS_PACIENTE } from '../data/opciones.js';
import { calcularEdad } from '../utils/fechas.js';

const FORMULARIO_VACIO = {
  numeroDeHistorialClinico: '',
  statusIdPaciente: '',
  nombres: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  estadoCivil: '',
  ocupacion: '',
  lugarDeNacimiento: '',
  fechaDeNacimiento: '',
  domicilio: '',
  telefono: '',
  cedula: '',
  email: '',
  recomienda: '',
  seguro: '',
};

function FormularioDatos({ modoNuevo, paciente, idPaciente }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { numeroHistorialEnUso, crearPaciente, actualizarPaciente } = useAlmacen();

  const [formulario, setFormulario] = useState(() =>
    modoNuevo ? FORMULARIO_VACIO : { ...FORMULARIO_VACIO, ...paciente },
  );
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState(state?.mensaje || '');

  const edad = calcularEdad(formulario.fechaDeNacimiento);

  function cambiar(campo) {
    return (valor) => {
      setFormulario((previo) => ({ ...previo, [campo]: valor }));
      setError('');
      setMensaje('');
    };
  }

  function guardar(evento) {
    evento.preventDefault();
    const numero = formulario.numeroDeHistorialClinico.trim();

    if (!formulario.nombres.trim() || !formulario.apellidoPaterno.trim()) {
      setError('Los nombres y el apellido paterno son obligatorios.');
      return;
    }
    if (modoNuevo && !numero) {
      setError('Ingrese el número de historial clínico para crear el paciente.');
      return;
    }
    if (numero && numeroHistorialEnUso(numero, modoNuevo ? undefined : idPaciente)) {
      setError('Ese número de historial clínico ya está asignado a otro paciente.');
      return;
    }

    const datos = { ...formulario, numeroDeHistorialClinico: numero };

    if (modoNuevo) {
      const nuevoId = crearPaciente(datos);
      navigate(`/DatosPersonales?idPaciente=${nuevoId}`, {
        replace: true,
        state: { mensaje: `Paciente creado correctamente con ID ${nuevoId}.` },
      });
      return;
    }

    actualizarPaciente(idPaciente, datos);
    setMensaje('Datos actualizados correctamente.');
  }

  return (
    <div className="pagina">
      <header className="pagina-cabecera">
        <div className="pagina-titulo">
          <Link to="/Pacientes" className="migaja">← Pacientes</Link>
          <h1>Datos personales</h1>
          <p>
            <span className={`insignia ${modoNuevo ? '' : 'insignia--exito'}`}>
              {modoNuevo ? 'Nuevo Paciente' : 'Ver Paciente'}
            </span>
          </p>
        </div>

        {!modoNuevo && (
          <div className="acciones-cabecera">
            <Link className="btn btn--secundario" to={`/Cartilla?idPaciente=${idPaciente}`}>
              Cartilla
            </Link>
            <Link className="btn btn--secundario" to={`/Historial?idPaciente=${idPaciente}`}>
              Historial
            </Link>
          </div>
        )}
      </header>

      {mensaje && <div className="aviso aviso--info" role="status">{mensaje}</div>}
      {error && <div className="aviso aviso--error" role="alert">{error}</div>}

      <form className="hoja-papel hoja-papel--datos" onSubmit={guardar}>
        <div className="papel-encabezado">
          <h2 className="papel-titulo">Datos personales</h2>
          <div className="papel-meta">
            <CampoLinea
              etiqueta="ID paciente"
              valor={modoNuevo ? 'Se genera al guardar' : idPaciente}
              soloLectura
              ancho="corto"
            />
            <CampoLinea
              etiqueta="N.º historial clínico"
              valor={formulario.numeroDeHistorialClinico}
              onChange={cambiar('numeroDeHistorialClinico')}
              soloLectura={!modoNuevo}
              ancho="corto"
            />
            <CampoLinea
              etiqueta="Estado del paciente"
              valor={formulario.statusIdPaciente}
              onChange={cambiar('statusIdPaciente')}
              opciones={OPCIONES_STATUS_PACIENTE}
              ancho="medio"
            />
          </div>
        </div>

        <div className="papel-cuerpo">
          <CampoLinea etiqueta="Nombres" valor={formulario.nombres} onChange={cambiar('nombres')} ancho="completo" />

          <div className="papel-fila">
            <CampoLinea
              etiqueta="Apellido paterno"
              valor={formulario.apellidoPaterno}
              onChange={cambiar('apellidoPaterno')}
              ancho="medio"
            />
            <CampoLinea
              etiqueta="Apellido materno"
              valor={formulario.apellidoMaterno}
              onChange={cambiar('apellidoMaterno')}
              ancho="medio"
            />
          </div>

          <div className="papel-fila">
            <CampoLinea
              etiqueta="Estado civil"
              valor={formulario.estadoCivil}
              onChange={cambiar('estadoCivil')}
              opciones={OPCIONES_ESTADO_CIVIL}
              ancho="medio"
            />
            <CampoLinea etiqueta="Edad" valor={edad} soloLectura ancho="corto" />
          </div>

          <CampoLinea etiqueta="Ocupación" valor={formulario.ocupacion} onChange={cambiar('ocupacion')} ancho="completo" />

          <div className="papel-fila">
            <CampoLinea
              etiqueta="Lugar de nacimiento"
              valor={formulario.lugarDeNacimiento}
              onChange={cambiar('lugarDeNacimiento')}
              ancho="medio"
            />
            <CampoLinea
              etiqueta="Fecha de nacimiento"
              tipo="date"
              valor={formulario.fechaDeNacimiento}
              onChange={cambiar('fechaDeNacimiento')}
              ancho="corto"
            />
          </div>

          <CampoLinea etiqueta="Domicilio" valor={formulario.domicilio} onChange={cambiar('domicilio')} ancho="completo" />

          <div className="papel-fila">
            <CampoLinea etiqueta="Teléfono" tipo="tel" valor={formulario.telefono} onChange={cambiar('telefono')} ancho="medio" />
            <CampoLinea etiqueta="C.I. (cédula de identidad)" valor={formulario.cedula} onChange={cambiar('cedula')} ancho="medio" />
          </div>

          <CampoLinea etiqueta="E-mail" tipo="email" valor={formulario.email} onChange={cambiar('email')} ancho="completo" />
          <CampoLinea etiqueta="Recomienda" valor={formulario.recomienda} onChange={cambiar('recomienda')} ancho="completo" />
          <CampoLinea etiqueta="Seguro médico" valor={formulario.seguro} onChange={cambiar('seguro')} ancho="completo" />
        </div>

        <footer className="papel-pie">
          <button type="button" className="btn btn--secundario" onClick={() => navigate('/Pacientes')}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primario">
            Guardar
          </button>
        </footer>
      </form>
    </div>
  );
}

export default function DatosPersonales() {
  const [params] = useSearchParams();
  const { pathname, key: claveUbicacion } = useLocation();
  const { obtenerPaciente } = useAlmacen();

  const idPaciente = params.get('idPaciente') || '';
  const modoNuevo = params.get('modo') === 'nuevo' || !idPaciente;
  const paciente = idPaciente ? obtenerPaciente(idPaciente) : null;

  if (!modoNuevo && !paciente) {
    return (
      <div className="pagina">
        <div className="tarjeta vacio">
          <strong>No se encontró el paciente solicitado</strong>
          <span>Verifique el ID o seleccione un paciente desde la lista.</span>
          <Link to="/Pacientes" className="btn btn--primario">Ir a Pacientes</Link>
        </div>
      </div>
    );
  }

  return (
    <FormularioDatos
      key={`${pathname}-${modoNuevo ? 'nuevo' : idPaciente}-${claveUbicacion}`}
      modoNuevo={modoNuevo}
      paciente={paciente}
      idPaciente={idPaciente}
    />
  );
}
