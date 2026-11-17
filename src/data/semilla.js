// Datos de demostración. Se cargan cuando no hay datos guardados en el navegador.
import { hoyISO, combinarFechaHora, fechaDesdeDate } from '../utils/fechas.js';
import { OPCIONES_CONFIRMACION, OPCIONES_TIPO_CONSULTA } from './opciones.js';

function sumarDias(iso, dias) {
  const [y, m, d] = iso.split('-').map(Number);
  const fecha = new Date(y, m - 1, d + dias);
  return fechaDesdeDate(fecha);
}

// Citas de ejemplo para los próximos 20 días, empezando hoy.
// Cada día tiene 3 o 6 citas (8 no se puede dividir en tercios exactos).
// Un tercio de las citas tiene la llegada después de la hora (de 5 a 60 minutos); el resto llega antes.
const TOTALES_POR_DIA = [6, 3, 3, 6, 6, 3, 6, 3, 3, 6, 6, 6, 3, 3, 6, 6, 3, 3, 6, 3];
const HORAS_CANDIDATAS = ['08:00', '08:45', '13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30'];
const MINUTOS_TARDE = [5, 15, 25, 35, 45, 55, 10, 20, 30, 40, 50, 60];
const MINUTOS_ANTES = [10, 20, 30, 45, 60, 15];
const EXAMENES = [
  'Refracción completa',
  'Control de presión intraocular',
  'Fondo de ojo',
  'Campo visual',
  'Adaptación de lentes de contacto',
  '',
];
const PERSONAS_QUE_TOMAN_CITA = ['Recepción', 'Luisa', 'Marta', 'Recepción'];
const PLANES = ['Lentes progresivos', 'Seguimiento mensual', '', 'Lentes de contacto blandos', 'Valoración de cirugía refractiva'];
const RX = ['Sí', '', 'No'];

function aMinutos(hhmm) {
  const [horas, minutos] = hhmm.split(':').map(Number);
  return horas * 60 + minutos;
}

function deMinutos(total) {
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function generarCitasDeEjemplo(hoy, pacientes, citasBase) {
  const generadas = [];
  let consecutivo = citasBase.length + 1;

  TOTALES_POR_DIA.forEach((total, dia) => {
    const fecha = sumarDias(hoy, dia);
    const existentes = citasBase.filter((c) => c.hora.slice(0, 10) === fecha);
    const existentesTarde = existentes.filter((c) => c.llegada > c.hora).length;

    const nuevas = total - existentes.length;
    const tardesNuevas = total / 3 - existentesTarde;
    const rotacion = dia % HORAS_CANDIDATAS.length;
    const horas = [...HORAS_CANDIDATAS.slice(rotacion), ...HORAS_CANDIDATAS.slice(0, rotacion)];

    // Posiciones repartidas de las llegadas tardías entre las citas nuevas del día.
    const posicionesTarde = new Set(
      Array.from({ length: tardesNuevas }, (_, k) => Math.floor(((k + 0.5) * nuevas) / tardesNuevas)),
    );

    for (let j = 0; j < nuevas; j += 1) {
      const paciente = pacientes[(dia * 2 + j) % pacientes.length];
      const indice = dia + j;
      const horaCita = horas[j];
      const desfase = posicionesTarde.has(j)
        ? MINUTOS_TARDE[indice % MINUTOS_TARDE.length]
        : -MINUTOS_ANTES[indice % MINUTOS_ANTES.length];

      generadas.push({
        idCita: `C-${String(consecutivo).padStart(4, '0')}`,
        idPaciente: paciente.idPaciente,
        statusIdPaciente: paciente.statusIdPaciente,
        llegada: combinarFechaHora(fecha, deMinutos(aMinutos(horaCita) + desfase)),
        hora: combinarFechaHora(fecha, horaCita),
        tipoDeConsulta: OPCIONES_TIPO_CONSULTA[indice % OPCIONES_TIPO_CONSULTA.length],
        x: indice % 4 === 0,
        examen: EXAMENES[indice % EXAMENES.length],
        qr: indice % 2 === 0,
        personaQueTomoLaCita: PERSONAS_QUE_TOMAN_CITA[indice % PERSONAS_QUE_TOMAN_CITA.length],
        confirmacion: OPCIONES_CONFIRMACION[indice % OPCIONES_CONFIRMACION.length],
        telefono: paciente.telefono,
        fechaEnQueSeTomoLaCita: sumarDias(fecha, -((indice % 10) + 1)),
        plan: PLANES[indice % PLANES.length],
        rx: RX[indice % RX.length],
      });
      consecutivo += 1;
    }
  });

  return generadas;
}

export function crearDatosSemilla() {
  const hoy = hoyISO();
  const manana = sumarDias(hoy, 1);

  const pacientes = [
    {
      idPaciente: '1001',
      numeroDeHistorialClinico: '4521 G',
      statusIdPaciente: 'Viene a consulta',
      nombres: 'María Fernanda',
      apellidoPaterno: 'Gómez',
      apellidoMaterno: 'Rivas',
      estadoCivil: 'Casado(a)',
      ocupacion: 'Contadora',
      lugarDeNacimiento: 'Asunción',
      fechaDeNacimiento: '1985-03-14',
      domicilio: 'Av. Mariscal López 1234, Asunción',
      telefono: '0981 555 201',
      cedula: '0912345678',
      email: 'mfgomez@correo.com',
      recomienda: 'Dra. Lorena Peralta',
      seguro: 'Seguro médico Vida',
    },
    {
      idPaciente: '1002',
      numeroDeHistorialClinico: '987654 S',
      statusIdPaciente: 'Tiene pos-operatorio',
      nombres: 'Carlos Eduardo',
      apellidoPaterno: 'Benítez',
      apellidoMaterno: 'Ortiz',
      estadoCivil: 'Soltero(a)',
      ocupacion: 'Ingeniero civil',
      lugarDeNacimiento: 'Encarnación',
      fechaDeNacimiento: '1978-11-02',
      domicilio: 'Calle Palma 455, Encarnación',
      telefono: '0971 402 118',
      cedula: '0987654321',
      email: 'cbenitez@correo.com',
      recomienda: '',
      seguro: '',
    },
    {
      idPaciente: '1003',
      numeroDeHistorialClinico: '10293847 G',
      statusIdPaciente: 'Doctora pediatra',
      nombres: 'Ana Lucía',
      apellidoPaterno: 'Villalba',
      apellidoMaterno: 'Acosta',
      estadoCivil: 'Unión libre',
      ocupacion: 'Maestra de escuela',
      lugarDeNacimiento: 'San Lorenzo',
      fechaDeNacimiento: '1992-07-21',
      domicilio: 'Barrio Obrero, San Lorenzo',
      telefono: '0992 730 644',
      cedula: '0951203847',
      email: 'alvillalba@correo.com',
      recomienda: 'Dr. Ramón Duarte',
      seguro: 'Seguro médico Salud Plus',
    },
    {
      idPaciente: '1004',
      numeroDeHistorialClinico: '123456789 S',
      statusIdPaciente: 'Especialista - contactólogos',
      nombres: 'José Luis',
      apellidoPaterno: 'Martínez',
      apellidoMaterno: 'Servín',
      estadoCivil: 'Divorciado(a)',
      ocupacion: 'Comerciante',
      lugarDeNacimiento: 'Luque',
      fechaDeNacimiento: '1969-01-30',
      domicilio: 'Ruta 2 km 14, Luque',
      telefono: '0983 117 905',
      cedula: '0963071582',
      email: 'jlmartinez@correo.com',
      recomienda: '',
      seguro: 'Seguro médico Vida',
    },
    {
      idPaciente: '1005',
      numeroDeHistorialClinico: '7788 S',
      statusIdPaciente: 'N/A',
      nombres: 'Valentina',
      apellidoPaterno: 'Núñez',
      apellidoMaterno: 'Galeano',
      estadoCivil: 'Soltero(a)',
      ocupacion: 'Diseñadora gráfica',
      lugarDeNacimiento: 'Asunción',
      fechaDeNacimiento: '1999-09-09',
      domicilio: 'Calle Herrera 789, Asunción',
      telefono: '0961 884 213',
      cedula: '0974418259',
      email: 'vnunez@correo.com',
      recomienda: 'Redes sociales',
      seguro: '',
    },
    {
      idPaciente: '1006',
      numeroDeHistorialClinico: '30125 G',
      statusIdPaciente: 'Se recomendó a otro doctor',
      nombres: 'Ricardo',
      apellidoPaterno: 'Ferreira',
      apellidoMaterno: 'Cáceres',
      estadoCivil: 'Casado(a)',
      ocupacion: 'Abogado',
      lugarDeNacimiento: 'Villarrica',
      fechaDeNacimiento: '1962-05-17',
      domicilio: 'Av. España 300, Villarrica',
      telefono: '0975 260 081',
      cedula: '0939520716',
      email: 'rferreira@correo.com',
      recomienda: 'Dr. Ramón Duarte',
      seguro: 'Seguro médico Salud Plus',
    },
  ];

  const citas = [
    {
      idCita: 'C-0001',
      idPaciente: '1001',
      statusIdPaciente: 'Viene a consulta',
      llegada: combinarFechaHora(hoy, '09:00'),
      hora: combinarFechaHora(hoy, '09:30'),
      tipoDeConsulta: 'Examen de la vista',
      x: false,
      examen: 'Refracción completa',
      qr: true,
      personaQueTomoLaCita: 'Recepción',
      confirmacion: 'Confirmada',
      telefono: '0981 555 201',
      fechaEnQueSeTomoLaCita: sumarDias(hoy, -3),
      plan: 'Lentes progresivos',
      rx: 'Sí',
    },
    {
      idCita: 'C-0002',
      idPaciente: '1002',
      statusIdPaciente: 'Tiene pos-operatorio',
      llegada: combinarFechaHora(hoy, '10:15'),
      hora: combinarFechaHora(hoy, '10:30'),
      tipoDeConsulta: 'Control',
      x: true,
      examen: 'Control de presión intraocular',
      qr: false,
      personaQueTomoLaCita: 'Recepción',
      confirmacion: 'Pendiente',
      telefono: '0971 402 118',
      fechaEnQueSeTomoLaCita: sumarDias(hoy, -1),
      plan: 'Seguimiento mensual',
      rx: '',
    },
    {
      idCita: 'C-0003',
      idPaciente: '1003',
      statusIdPaciente: 'Doctora pediatra',
      llegada: combinarFechaHora(hoy, '11:45'),
      hora: combinarFechaHora(hoy, '12:00'),
      tipoDeConsulta: 'Consulta general',
      x: false,
      examen: '',
      qr: false,
      personaQueTomoLaCita: 'Luisa',
      confirmacion: 'No confirmada',
      telefono: '0992 730 644',
      fechaEnQueSeTomoLaCita: hoy,
      plan: '',
      rx: '',
    },
    {
      idCita: 'C-0004',
      idPaciente: '1004',
      statusIdPaciente: 'Especialista - contactólogos',
      llegada: combinarFechaHora(manana, '08:30'),
      hora: combinarFechaHora(manana, '09:00'),
      tipoDeConsulta: 'Entrega de lentes',
      x: false,
      examen: 'Adaptación de lentes de contacto',
      qr: true,
      personaQueTomoLaCita: 'Recepción',
      confirmacion: 'Confirmada',
      telefono: '0983 117 905',
      fechaEnQueSeTomoLaCita: hoy,
      plan: 'Lentes de contacto blandos',
      rx: 'Sí',
    },
  ];

  const historial = [
    {
      id: 'H-0001',
      idPaciente: '1001',
      tipo: 'estado',
      fechaHora: combinarFechaHora(sumarDias(hoy, -7), '10:20'),
      datos: { estado: 'Viene a consulta' },
      archivos: [],
    },
    {
      id: 'H-0002',
      idPaciente: '1001',
      tipo: 'papelRecetaLentes',
      fechaHora: combinarFechaHora(sumarDias(hoy, -7), '10:25'),
      datos: { fechaDeReceta: sumarDias(hoy, -7), recetaLentes: 'OD -1.25 / OI -1.00 · Adición +1.50' },
      archivos: [],
    },
  ];

  const seguimientos = [
    {
      id: 'S-0001',
      idPaciente: '1002',
      fechaHora: combinarFechaHora(sumarDias(hoy, -14), '09:00'),
      texto: 'Post operatorio de cataratas OI. Evolución favorable, sin molestias.',
    },
  ];

  const citasCompletas = [...citas, ...generarCitasDeEjemplo(hoy, pacientes, citas)];

  return { pacientes, citas: citasCompletas, cartillas: {}, seguimientos, historial };
}
