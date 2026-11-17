import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../context/AutenticacionContext.jsx';

const ITEMS_MENU = [
  { ruta: '/Pacientes', etiqueta: 'Pacientes', icono: 'M16 14a4 4 0 1 0-8 0M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 20a8 8 0 0 1 16 0' },
  { ruta: '/Citas', etiqueta: 'Calendario', icono: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4' },
];

function Icono({ trazo }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={trazo} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAutenticacion();
  const esInicio = pathname === '/' || pathname === '';

  function salir() {
    cerrarSesion();
    navigate('/Login', { replace: true });
  }

  return (
    <div className="app">
      <aside className="barra-lateral">
        <Link to="/" className="marca" aria-label="Ir al inicio">
          <span className="marca-logo">C</span>
          <span className="marca-texto">
            <strong>COFPH</strong>
            <small>Gestión clínica</small>
          </span>
        </Link>

        <nav className="menu" aria-label="Menú principal">
          <span className="menu-titulo">Menú</span>
          {ITEMS_MENU.map((item) => (
            <NavLink
              key={item.ruta}
              to={item.ruta}
              className={({ isActive }) => `menu-item ${isActive ? 'menu-item--activo' : ''}`}
            >
              <Icono trazo={item.icono} />
              <span>{item.etiqueta}</span>
            </NavLink>
          ))}
        </nav>

        <div className="barra-lateral-pie">
          <div className="sesion-usuario">
            <span className="avatar-usuario" aria-hidden="true">{usuario.charAt(0)}</span>
            <div className="sesion-texto">
              <strong>{usuario}</strong>
              <small>Sesión iniciada</small>
            </div>
            <button type="button" className="boton-salir" onClick={salir} aria-label="Cerrar sesión" title="Cerrar sesión">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="modo-demo">
            <span className="punto-estado" aria-hidden="true" />
            Modo demostración
          </div>
        </div>
      </aside>

      <main className={`contenido ${esInicio ? 'contenido--inicio' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}
