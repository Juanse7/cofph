import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import Login from './pages/Login.jsx';
import Inicio from './pages/Inicio.jsx';
import Pacientes from './pages/Pacientes.jsx';
import DatosPersonales from './pages/DatosPersonales.jsx';
import Citas from './pages/Citas.jsx';
import Cartilla from './pages/Cartilla.jsx';
import Historial from './pages/Historial.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/Login" element={<Login />} />

      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="/Pacientes" element={<Pacientes />} />
          <Route path="/DatosPersonales" element={<DatosPersonales />} />
          <Route path="/Citas" element={<Citas />} />
          <Route path="/Cartilla" element={<Cartilla />} />
          <Route path="/Historial" element={<Historial />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
