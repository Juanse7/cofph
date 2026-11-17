import { createContext, useCallback, useContext, useMemo, useState } from 'react';

// Acceso de demostración. Es un inicio de sesión falso: las credenciales viven en el código
// del frontend, así que no ofrece seguridad real. La sesión se guarda en sessionStorage,
// por lo que se mantiene al recargar y termina al cerrar la pestaña.
export const USUARIO_DEMO = 'usuario01';
const CLAVE_DEMO = 'claveUsuario2026*';
const CLAVE_SESION = 'cofph-sesion-demo';

function sesionGuardada() {
  try {
    return window.sessionStorage.getItem(CLAVE_SESION) === 'activa';
  } catch {
    return false;
  }
}

const AutenticacionContext = createContext(null);

export function AutenticacionProvider({ children }) {
  const [autenticado, setAutenticado] = useState(sesionGuardada);

  // Devuelve true si las credenciales son correctas.
  const iniciarSesion = useCallback((usuario, clave) => {
    const correcto = usuario.trim() === USUARIO_DEMO && clave === CLAVE_DEMO;
    if (correcto) {
      try {
        window.sessionStorage.setItem(CLAVE_SESION, 'activa');
      } catch {
        // Sin sessionStorage la sesión dura solo mientras la aplicación esté abierta.
      }
      setAutenticado(true);
    }
    return correcto;
  }, []);

  const cerrarSesion = useCallback(() => {
    try {
      window.sessionStorage.removeItem(CLAVE_SESION);
    } catch {
      // Nada que limpiar si el almacenamiento no está disponible.
    }
    setAutenticado(false);
  }, []);

  const valor = useMemo(
    () => ({ autenticado, usuario: USUARIO_DEMO, iniciarSesion, cerrarSesion }),
    [autenticado, iniciarSesion, cerrarSesion],
  );

  return <AutenticacionContext.Provider value={valor}>{children}</AutenticacionContext.Provider>;
}

export function useAutenticacion() {
  const contexto = useContext(AutenticacionContext);
  if (!contexto) throw new Error('useAutenticacion debe usarse dentro de AutenticacionProvider');
  return contexto;
}
