import { Link } from 'react-router-dom';
import { useAlmacen } from '../context/AlmacenContext.jsx';
import { hoyISO, formatearFechaLarga, parteFecha } from '../utils/fechas.js';

export default function Inicio() {
  const { pacientes, citas } = useAlmacen();
  const hoy = hoyISO();
  const citasHoy = citas.filter((c) => parteFecha(c.hora) === hoy).length;

  return (
    <div className="pagina inicio">
      <section className="inicio-bienvenida">
        <p className="inicio-fecha">{formatearFechaLarga(hoy)}</p>
        <h1>Bienvenido a COFPH</h1>
        <p>Administre pacientes, citas y expedientes desde un solo lugar. Seleccione una opción para comenzar.</p>
      </section>

      <section className="inicio-opciones" aria-label="Opciones principales">
        <Link to="/Pacientes" className="tarjeta opcion-card">
          <span className="opcion-icono opcion-icono--pacientes" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M16 14a4 4 0 1 0-8 0M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <h2>Pacientes</h2>
            <p>Busque expedientes, cree nuevos datos personales y consulte cartilla e historial.</p>
          </div>
          <span className="opcion-cifra">{pacientes.length} registrados</span>
        </Link>

        <Link to="/Citas" className="tarjeta opcion-card">
          <span className="opcion-icono opcion-icono--citas" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M3 5h18v16H3zM3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <h2>Calendario</h2>
            <p>Revise las citas por fecha, registre nuevas citas y actualice su estado.</p>
          </div>
          <span className="opcion-cifra">{citasHoy} citas hoy</span>
        </Link>
      </section>
    </div>
  );
}
