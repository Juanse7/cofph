import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAutenticacion } from '../context/AutenticacionContext.jsx';

const BENEFICIOS = [
  'Expedientes y cartilla de cada paciente',
  'Calendario de citas con búsqueda de pacientes',
  'Historial clínico con actividades, archivos y dibujos',
];

// Página a la que se regresa después de iniciar sesión.
function destinoDesde(from) {
  if (!from?.pathname || from.pathname.toLowerCase() === '/login') return '/';
  return `${from.pathname}${from.search || ''}`;
}

function Icono({ children, tamano = 18 }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {children}
    </svg>
  );
}

const trazo = { stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export default function Login() {
  const { autenticado, iniciarSesion } = useAutenticacion();
  const location = useLocation();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [error, setError] = useState('');

  // Si la sesión ya está iniciada, no se muestra el formulario.
  if (autenticado) {
    return <Navigate to={destinoDesde(location.state?.from)} replace />;
  }

  function enviar(evento) {
    evento.preventDefault();
    if (!usuario.trim() || !clave) {
      setError('Ingrese su usuario y contraseña para continuar.');
      return;
    }
    if (!iniciarSesion(usuario, clave)) {
      setError('Usuario o contraseña incorrectos. Verifique sus datos e intente de nuevo.');
      setClave('');
    }
  }

  return (
    <main className="acceso">
      <aside className="acceso-marca" aria-label="Presentación">
        <div className="acceso-marca-contenido">
          <div className="acceso-marca-logo">
            <span className="marca-logo">C</span>
            <div>
              <strong>COFPH</strong>
              <small>Gestión clínica</small>
            </div>
          </div>

          <h2>Gestione pacientes, citas e historiales en un solo lugar.</h2>

          <ul className="acceso-beneficios">
            {BENEFICIOS.map((texto) => (
              <li key={texto}>
                <Icono>
                  <path d="m5 12 4 4 10-10" {...trazo} />
                </Icono>
                <span>{texto}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="acceso-formulario">
        <div className="acceso-tarjeta">
          <div className="acceso-cabecera">
            <div className="acceso-logo-movil">
              <span className="marca-logo">C</span>
              <div className="acceso-logo-movil-texto">
                <strong>COFPH</strong>
                <small>Gestión Clínica</small>
              </div>
            </div>
            <h1>Iniciar sesión</h1>
            <p>Ingrese sus credenciales para acceder al sistema.</p>
          </div>

          <form className="acceso-form" onSubmit={enviar} noValidate>
            {error && (
              <div className="acceso-error" role="alert">
                <Icono tamano={18}>
                  <circle cx="12" cy="12" r="9" {...trazo} />
                  <path d="M12 8v5M12 16.5v.5" {...trazo} />
                </Icono>
                <span>{error}</span>
              </div>
            )}

            <div className="acceso-campo">
              <label htmlFor="acceso-usuario" className="acceso-etiqueta">
                Usuario
              </label>
              <div className="acceso-entrada">
                <Icono>
                  <circle cx="12" cy="8" r="4" {...trazo} />
                  <path d="M4 21a8 8 0 0 1 16 0" {...trazo} />
                </Icono>
                <input
                  id="acceso-usuario"
                  type="text"
                  className="entrada acceso-input"
                  autoComplete="username"
                  autoFocus
                  placeholder="Ingrese su usuario"
                  value={usuario}
                  onChange={(e) => {
                    setUsuario(e.target.value);
                    setError('');
                  }}
                />
              </div>
            </div>

            <div className="acceso-campo">
              <label htmlFor="acceso-clave" className="acceso-etiqueta">
                Contraseña
              </label>
              <div className="acceso-entrada">
                <Icono>
                  <rect x="4" y="11" width="16" height="10" rx="2" {...trazo} />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" {...trazo} />
                </Icono>
                <input
                  id="acceso-clave"
                  type={verClave ? 'text' : 'password'}
                  className="entrada acceso-input acceso-input--con-boton"
                  autoComplete="current-password"
                  placeholder="Ingrese su contraseña"
                  value={clave}
                  onChange={(e) => {
                    setClave(e.target.value);
                    setError('');
                  }}
                />
                <button
                  type="button"
                  className="acceso-ver"
                  onClick={() => setVerClave((previo) => !previo)}
                  aria-label={verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  title={verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {verClave ? (
                    <Icono>
                      <path d="M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 8.5 4.5 9.5 6-.4.7-1.2 1.8-2.4 2.9M6.6 6.6C4.3 8.1 2.8 10.1 2.5 12c1 1.5 4.5 6 9.5 6 1.6 0 3-.4 4.2-1" {...trazo} />
                    </Icono>
                  ) : (
                    <Icono>
                      <path d="M2.5 12C3.5 10.5 7 6 12 6s8.5 4.5 9.5 6c-1 1.5-4.5 6-9.5 6s-8.5-4.5-9.5-6Z" {...trazo} />
                      <circle cx="12" cy="12" r="3" {...trazo} />
                    </Icono>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn--primario btn--grande acceso-enviar">
              Ingresar
            </button>
          </form>

          <p className="acceso-pie">© {new Date().getFullYear()} COFPH · Gestión clínica</p>
        </div>
      </section>
    </main>
  );
}
