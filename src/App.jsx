
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home.jsx';
import Registro from './components/Registro/Registro.jsx';
import Login from './components/Login/Login.jsx';
import InicioUsuario from './components/Usuarios/Inicio/InicioUsuario.jsx';
import Disponibilidad from './components/Usuarios/Disponibilidad/Disponibilidad.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/inicio" element={<InicioUsuario/>} />
      <Route path="/disponibilidad" element={<Disponibilidad />} />
    </Routes>
  );

}

export default App