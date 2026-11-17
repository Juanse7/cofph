# COFPH · Gestión clínica (demo frontend)

Aplicación React (Vite) de demostración para gestionar pacientes, citas, cartilla e historial.
Los datos viven en el frontend: se cargan datos de ejemplo y se guardan en `localStorage` del navegador.

## Ejecutar

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`.

Para generar la versión de producción:

```bash
npm run build
```

## Acceso

Para entrar al sistema use el usuario `usuario01` y la contraseña `claveUsuario2026*`. Sin esas credenciales, cualquier página redirige a `/Login`.
Es un inicio de sesión falso para la demo: las credenciales están en el código del frontend y no ofrecen seguridad real. La sesión se mantiene mientras la pestaña esté abierta; use «Cerrar sesión» en la barra lateral para salir.

## Rutas

| Ruta | Pantalla |
| --- | --- |
| `/Login` | Inicio de sesión (acceso de demostración) |
| `/` | Inicio con panel lateral (Pacientes y Calendario) |
| `/Pacientes` | Búsqueda y lista de pacientes. Botón «+ Nuevo Datos Personales» y menú «Acciones» por fila |
| `/DatosPersonales` | Datos personales. Modos «Nuevo Paciente» (`?modo=nuevo`) y «Ver Paciente» (`?idPaciente=...`) |
| `/Citas` | Calendario de citas: «+ Nueva cita», calendario principal, cuadrícula de citas, formCitas y formCitasNew con lookup de paciente |
| `/Cartilla` | Cartilla (`?idPaciente=...`) con hoja principal y seguimientos |
| `/Historial` | Historial (`?idPaciente=...`) con panel izquierdo (datos, estado, facturación, actividades) y panel derecho filtrable |

## Estructura

- `src/context/AlmacenContext.jsx`: almacén de datos (pacientes, citas, cartillas, seguimientos, historial).
- `src/data/`: opciones de listas, datos de ejemplo, definición de campos de la cartilla y de los registros del historial.
- `src/components/`: calendario desplegable, modal, líneas de formulario y componentes de citas e historial.
- `src/pages/`: una página por ruta.
- `src/estilos/`: estilos globales, componentes y páginas.

Para reiniciar los datos de ejemplo, borre la clave `cofph-demo-datos-v2` del `localStorage` del navegador.
