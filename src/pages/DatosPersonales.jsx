import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAlmacen } from '../context/AlmacenContext.jsx';
import PapelDatosPersonales from '../components/datos/PapelDatosPersonales.jsx';

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

      <PapelDatosPersonales
        valores={formulario}
        cambiar={cambiar}
        idPaciente={modoNuevo ? '' : idPaciente}
        modoNuevo={modoNuevo}
        onSubmit={guardar}
      >
        <footer className="papel-pie">
          <button type="button" className="btn btn--secundario" onClick={() => navigate('/Pacientes')}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primario">
            Guardar
          </button>
        </footer>
      </PapelDatosPersonales>
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
