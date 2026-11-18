import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { crearDatosSemilla } from '../data/semilla.js';
import { siguienteIdPaciente } from '../utils/pacientes.js';

// Almacén en memoria para la demo. Se guarda una copia en localStorage (si está disponible)
// para que los datos sobrevivan a una recarga de la página.
// v3: citas de ejemplo para los próximos 20 días. Cambiar la clave recarga los datos de ejemplo.
const CLAVE_STORAGE = 'cofph-demo-datos-v3';

function cargarDatos() {
  try {
    const guardado = window.localStorage.getItem(CLAVE_STORAGE);
    if (guardado) return JSON.parse(guardado);
  } catch {
    // Sin acceso a localStorage o JSON inválido: se usan los datos de demostración.
  }
  return crearDatosSemilla();
}

function guardarDatos(datos) {
  try {
    window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(datos));
  } catch {
    // Si el almacenamiento no está disponible, la demo sigue funcionando en memoria.
  }
}

const AlmacenContext = createContext(null);

let contadorLocal = 0;
function nuevoId(prefijo) {
  contadorLocal += 1;
  return `${prefijo}-${Date.now().toString(36)}${contadorLocal}`;
}

export function AlmacenProvider({ children }) {
  const [datos, setDatos] = useState(cargarDatos);

  useEffect(() => {
    guardarDatos(datos);
  }, [datos]);

  // ---------- Pacientes ----------
  const obtenerPaciente = useCallback(
    (idPaciente) => datos.pacientes.find((p) => p.idPaciente === String(idPaciente)) || null,
    [datos.pacientes],
  );

  const numeroHistorialEnUso = useCallback(
    (numero, idExcluir) =>
      datos.pacientes.some(
        (p) =>
          p.numeroDeHistorialClinico.trim().toLowerCase() === numero.trim().toLowerCase() &&
          p.idPaciente !== idExcluir,
      ),
    [datos.pacientes],
  );

  // El ID se calcula antes de actualizar el estado para poder devolverlo de inmediato.
  const crearPaciente = useCallback(
    (campos) => {
      const idGenerado = siguienteIdPaciente(datos.pacientes);
      setDatos((previo) => ({
        ...previo,
        pacientes: [...previo.pacientes, { ...campos, idPaciente: idGenerado }],
      }));
      return idGenerado;
    },
    [datos.pacientes],
  );

  const actualizarPaciente = useCallback((idPaciente, cambios) => {
    setDatos((previo) => ({
      ...previo,
      pacientes: previo.pacientes.map((p) => (p.idPaciente === idPaciente ? { ...p, ...cambios } : p)),
    }));
  }, []);

  const actualizarEstadoPaciente = useCallback((idPaciente, statusIdPaciente) => {
    actualizarPaciente(idPaciente, { statusIdPaciente });
  }, [actualizarPaciente]);

  // ---------- Citas ----------
  const crearCita = useCallback((campos) => {
    const cita = { ...campos, idCita: nuevoId('C') };
    setDatos((previo) => ({ ...previo, citas: [...previo.citas, cita] }));
    return cita.idCita;
  }, []);

  const actualizarCita = useCallback((idCita, cambios) => {
    setDatos((previo) => ({
      ...previo,
      citas: previo.citas.map((c) => (c.idCita === idCita ? { ...c, ...cambios } : c)),
    }));
  }, []);

  // ---------- Cartilla ----------
  const obtenerCartilla = useCallback(
    (idPaciente) => datos.cartillas[String(idPaciente)] || {},
    [datos.cartillas],
  );

  const guardarCartilla = useCallback((idPaciente, campos) => {
    setDatos((previo) => ({
      ...previo,
      cartillas: { ...previo.cartillas, [String(idPaciente)]: campos },
    }));
  }, []);

  // ---------- Seguimientos ----------
  const agregarSeguimiento = useCallback((idPaciente, { fechaHora, texto }) => {
    const seguimiento = { id: nuevoId('S'), idPaciente: String(idPaciente), fechaHora, texto };
    setDatos((previo) => ({ ...previo, seguimientos: [...previo.seguimientos, seguimiento] }));
  }, []);

  // ---------- Historial ----------
  const agregarRegistroHistorial = useCallback((registro) => {
    // creadoEn marca el momento exacto en que se guardó, para ordenar registros del mismo minuto.
    const nuevo = { ...registro, id: nuevoId('H'), creadoEn: new Date().toISOString() };
    setDatos((previo) => ({ ...previo, historial: [...previo.historial, nuevo] }));
  }, []);

  const valor = useMemo(
    () => ({
      pacientes: datos.pacientes,
      citas: datos.citas,
      seguimientos: datos.seguimientos,
      historial: datos.historial,
      obtenerPaciente,
      numeroHistorialEnUso,
      crearPaciente,
      actualizarPaciente,
      actualizarEstadoPaciente,
      crearCita,
      actualizarCita,
      obtenerCartilla,
      guardarCartilla,
      agregarSeguimiento,
      agregarRegistroHistorial,
    }),
    [
      datos,
      obtenerPaciente,
      numeroHistorialEnUso,
      crearPaciente,
      actualizarPaciente,
      actualizarEstadoPaciente,
      crearCita,
      actualizarCita,
      obtenerCartilla,
      guardarCartilla,
      agregarSeguimiento,
      agregarRegistroHistorial,
    ],
  );

  return <AlmacenContext.Provider value={valor}>{children}</AlmacenContext.Provider>;
}

export function useAlmacen() {
  const contexto = useContext(AlmacenContext);
  if (!contexto) throw new Error('useAlmacen debe usarse dentro de AlmacenProvider');
  return contexto;
}
