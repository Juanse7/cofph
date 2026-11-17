import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAutenticacion } from '../context/AutenticacionContext.jsx';

// Solo deja pasar a las páginas internas si la sesión está iniciada.
// Si no lo está, redirige a /Login y guarda la página solicitada para volver a ella.
export default function RutaProtegida() {
  const { autenticado } = useAutenticacion();
  const location = useLocation();

  if (!autenticado) {
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
