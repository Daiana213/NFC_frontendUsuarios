
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home.jsx';
import Registro from './components/Registro/Registro.jsx';
import Login from './components/Login/Login.jsx';
import InicioUsuario from './components/Usuarios/Inicio/InicioUsuario.jsx';
import Disponibilidad from './components/Usuarios/Disponibilidad/Disponibilidad.jsx';
import PrestamosUsuario from './components/Usuarios/PrestamosUsuario.jsx';
import TarjetasResumen from './components/Usuarios/TarjetasResumen.jsx';
import Navbar from './components/Usuarios/NavBar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/inicio" element={<InicioUsuario />} />
      <Route path="/disponibilidad" element={<Disponibilidad />} />
      <Route path="/prestamos" element={<PrestamosUsuario />} />
      <Route path="/tarjeta" element={<TarjetasResumen />} />
      <Route path="/navbar" element={<Navbar />} />
      <Route path="/footer" element={<Footer />} />
    </Routes>
  );

}

export default App