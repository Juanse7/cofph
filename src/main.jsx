import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AlmacenProvider } from './context/AlmacenContext.jsx';
import { AutenticacionProvider } from './context/AutenticacionContext.jsx';
import './estilos/base.css';
import './estilos/componentes.css';
import './estilos/paginas.css';
import './estilos/modulos.css';
import './estilos/acceso.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AutenticacionProvider>
        <AlmacenProvider>
          <App />
        </AlmacenProvider>
      </AutenticacionProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
