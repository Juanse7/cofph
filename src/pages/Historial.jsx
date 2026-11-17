import { useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAlmacen } from '../context/AlmacenContext.jsx';
import {
  TarjetaDatosPersonales,
  TarjetaEstado,
  TarjetaFacturacion,
} from '../components/historial/PanelIzquierdo.jsx';
import TarjetaActividades from '../components/historial/TarjetaActividades.jsx';
import TarjetaDibujos from '../components/historial/TarjetaDibujos.jsx';
import PanelRegistros from '../components/historial/PanelRegistros.jsx';
import { nombreCompleto } from '../utils/pacientes.js';

export default function Historial() {
  const [params] = useSearchParams();
  const { key: claveUbicacion } = useLocation();
  const { obtenerPaciente, historial } = useAlmacen();

  const idPaciente = params.get('idPaciente') || '';
  const paciente = idPaciente ? obtenerPaciente(idPaciente) : null;

  // Registros de este paciente, sin ordenar aquí: el panel derecho aplica filtros y orden.
  const registrosDelPaciente = useMemo(
    () => historial.filter((r) => r.idPaciente === idPaciente),
    [historial, idPaciente],
  );

  if (!paciente) {
    return (
      <div className="pagina">
        <div className="tarjeta vacio">
          <strong>No se encontró el paciente solicitado</strong>
          <span>Seleccione un paciente desde la lista para abrir su historial.</span>
          <Link to="/Pacientes" className="btn btn--primario">Ir a Pacientes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina pagina--ancha">
      <header className="pagina-cabecera">
        <div className="pagina-titulo">
          <Link to="/Pacientes" className="migaja">← Pacientes</Link>
          <h1>Historial</h1>
          <p>
            {nombreCompleto(paciente)} · ID {paciente.idPaciente}
          </p>
        </div>
        <div className="acciones-cabecera">
          <Link to={`/DatosPersonales?idPaciente=${paciente.idPaciente}`} className="btn btn--secundario">
            Datos personales
          </Link>
          <Link to={`/Cartilla?idPaciente=${paciente.idPaciente}`} className="btn btn--secundario">
            Cartilla
          </Link>
        </div>
      </header>

      <div className="historial-layout">
        <aside className="historial-izquierda" aria-label="Panel izquierdo">
          <TarjetaDatosPersonales key={`datos-${claveUbicacion}`} paciente={paciente} />
          <TarjetaEstado key={`estado-${claveUbicacion}`} paciente={paciente} />
          <TarjetaDibujos key={`dibujos-${claveUbicacion}`} paciente={paciente} />
          <TarjetaFacturacion key={`facturacion-${claveUbicacion}`} paciente={paciente} />
          <TarjetaActividades key={`actividades-${claveUbicacion}`} paciente={paciente} />
        </aside>

        <section className="historial-derecha" aria-label="Panel derecho">
          <PanelRegistros key={`registros-${idPaciente}`} registros={registrosDelPaciente} />
        </section>
      </div>
    </div>
  );
}
