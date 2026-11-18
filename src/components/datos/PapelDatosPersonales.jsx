import { CampoLinea } from '../CampoLinea.jsx';
import { OPCIONES_ESTADO_CIVIL, OPCIONES_STATUS_PACIENTE } from '../../data/opciones.js';
import { calcularEdad } from '../../utils/fechas.js';

// Hoja de Datos Personales con el formato del documento original.
// Se usa en /DatosPersonales (editable) y en la ventana "Ver datos personales" de las citas (solo lectura).
// Si se pasa onSubmit, la hoja es un formulario y el contenido de children va al final (por ejemplo, los botones).
export default function PapelDatosPersonales({
  valores,
  cambiar,
  idPaciente = '',
  modoNuevo = false,
  soloLectura = false,
  onSubmit,
  children,
}) {
  const Contenedor = onSubmit ? 'form' : 'div';
  const propsContenedor = onSubmit ? { onSubmit, noValidate: true } : {};
  const edad = calcularEdad(valores.fechaDeNacimiento);

  // En solo lectura el campo no cambia; en modo edición se usa el cambio del formulario.
  function alCambiar(clave) {
    return soloLectura || !cambiar ? () => {} : cambiar(clave);
  }

  function linea(clave, etiqueta, extra = {}) {
    return (
      <CampoLinea
        key={clave}
        etiqueta={etiqueta}
        valor={valores[clave]}
        onChange={alCambiar(clave)}
        soloLectura={soloLectura}
        {...extra}
      />
    );
  }

  return (
    <Contenedor className="hoja-papel hoja-papel--datos" {...propsContenedor}>
      <div className="papel-encabezado">
        <h2 className="papel-titulo">Datos personales</h2>
        <div className="papel-meta">
          <CampoLinea
            etiqueta="ID paciente"
            valor={modoNuevo ? 'Se genera al guardar' : idPaciente}
            soloLectura
            ancho="corto"
          />
          <CampoLinea
            etiqueta="N.º historial clínico"
            valor={valores.numeroDeHistorialClinico}
            onChange={alCambiar('numeroDeHistorialClinico')}
            soloLectura={soloLectura || !modoNuevo}
            ancho="corto"
          />
          <CampoLinea
            etiqueta="Estado del paciente"
            valor={valores.statusIdPaciente}
            onChange={alCambiar('statusIdPaciente')}
            soloLectura={soloLectura}
            opciones={OPCIONES_STATUS_PACIENTE}
            ancho="medio"
          />
        </div>
      </div>

      <div className="papel-cuerpo">
        {linea('nombres', 'Nombres', { ancho: 'completo' })}

        <div className="papel-fila">
          {linea('apellidoPaterno', 'Apellido paterno', { ancho: 'medio' })}
          {linea('apellidoMaterno', 'Apellido materno', { ancho: 'medio' })}
        </div>

        <div className="papel-fila">
          {linea('estadoCivil', 'Estado civil', { ancho: 'medio', opciones: OPCIONES_ESTADO_CIVIL })}
          <CampoLinea etiqueta="Edad" valor={edad} soloLectura ancho="corto" />
        </div>

        {linea('ocupacion', 'Ocupación', { ancho: 'completo' })}

        <div className="papel-fila">
          {linea('lugarDeNacimiento', 'Lugar de nacimiento', { ancho: 'medio' })}
          {linea('fechaDeNacimiento', 'Fecha de nacimiento', { tipo: 'date', ancho: 'corto' })}
        </div>

        {linea('domicilio', 'Domicilio', { ancho: 'completo' })}

        <div className="papel-fila">
          {linea('telefono', 'Teléfono', { tipo: 'tel', ancho: 'medio' })}
          {linea('cedula', 'C.I. (cédula de identidad)', { ancho: 'medio' })}
        </div>

        {linea('email', 'E-mail', { tipo: 'email', ancho: 'completo' })}
        {linea('recomienda', 'Recomienda', { ancho: 'completo' })}
        {linea('seguro', 'Seguro médico', { ancho: 'completo' })}
      </div>

      {children}
    </Contenedor>
  );
}
