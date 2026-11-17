import { useState } from 'react';
import Modal from '../Modal.jsx';
import { useAlmacen } from '../../context/AlmacenContext.jsx';
import { buscarPacientes } from '../../utils/pacientes.js';

// Ventana de búsqueda de pacientes (lookupFormCitas).
// Al elegir una fila se devuelve el paciente completo a formCitasNew.
export default function LookupPacientes({ onSeleccionar, onCerrar }) {
  const { pacientes } = useAlmacen();
  const [texto, setTexto] = useState('');
  const [aplicado, setAplicado] = useState('');
  const resultados = buscarPacientes(pacientes, aplicado);

  function buscar(evento) {
    evento.preventDefault();
    setAplicado(texto);
  }

  return (
    <Modal titulo="Buscar paciente" onCerrar={onCerrar} ancho="xl">
      <form className="lookup-barra" onSubmit={buscar} role="search">
        <input
          type="search"
          className="entrada"
          autoFocus
          placeholder="ID, historial, nombres, apellidos, cédula, seguro…"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          aria-label="Texto de búsqueda"
        />
        <button type="submit" className="btn btn--primario">
          Buscar
        </button>
      </form>

      <p className="ayuda lookup-resumen">
        {resultados.length} resultado(s). Haga clic en una fila para seleccionar al paciente.
      </p>

      <div className="hoja hoja--lookup">
        <table>
          <thead>
            <tr>
              <th>ID paciente</th>
              <th>N.º historial clínico</th>
              <th>Nombres</th>
              <th>Apellido paterno</th>
              <th>Apellido materno</th>
              <th>Cédula</th>
              <th>Seguro médico</th>
            </tr>
          </thead>
          <tbody>
            {resultados.length === 0 && (
              <tr className="fila--vacia">
                <td colSpan={7}>No hay pacientes que coincidan con la búsqueda.</td>
              </tr>
            )}
            {resultados.map((p) => (
              <tr key={p.idPaciente} onClick={() => onSeleccionar(p)} title="Seleccionar paciente">
                <td>{p.idPaciente}</td>
                <td>{p.numeroDeHistorialClinico}</td>
                <td>{p.nombres}</td>
                <td>{p.apellidoPaterno}</td>
                <td>{p.apellidoMaterno}</td>
                <td>{p.cedula}</td>
                <td>{p.seguro || 'No tiene seguro'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
