import { useState } from 'react';
import Modal from '../Modal.jsx';
import { Tarjeta } from './PanelIzquierdo.jsx';
import EditorDibujo from './EditorDibujo.jsx';

// div-dibujos: abre la ventana de dibujo. Al guardar, el dibujo aparece en el panel derecho.
export default function TarjetaDibujos({ paciente }) {
  const [ventanaAbierta, setVentanaAbierta] = useState(false);
  const [mensaje, setMensaje] = useState('');

  return (
    <Tarjeta id="div-dibujos" titulo="Dibujos">
      <p className="ayuda">Dibuje sobre un lienzo y guárdelo en el historial del paciente.</p>
      <div className="panel-acciones">
        <button
          type="button"
          className="btn btn--primario"
          onClick={() => {
            setMensaje('');
            setVentanaAbierta(true);
          }}
        >
          Crear Dibujo
        </button>
        {mensaje && (
          <span className="ayuda" role="status">
            {mensaje}
          </span>
        )}
      </div>

      {ventanaAbierta && (
        <Modal titulo="Crear dibujo" ancho="xl" onCerrar={() => setVentanaAbierta(false)}>
          <EditorDibujo
            idPaciente={paciente.idPaciente}
            onGuardado={() => {
              setVentanaAbierta(false);
              setMensaje('Dibujo guardado en el historial.');
            }}
          />
        </Modal>
      )}
    </Tarjeta>
  );
}
