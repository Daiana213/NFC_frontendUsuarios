import { Link } from 'react-router-dom';
import './Navbar.css';
import Logo from '../../../assets/LogoUTN.png';

export default function Navbar() {
  return (
    <>
      <nav className="navbar">
      <div className="navbar-left">
        <Link to="/inicio" className="navbar__logo">
          <div className="logo-container">
            <img src={Logo} alt="UTN" className="header-auth__logo-img" />
          </div>
        </Link>
      </div>
      <div className="navbar__links">
        <Link to="/disponibilidad" className="navbar__link">Disponibilidad</Link>
        <Link to="/perfil" className="navbar__link">Perfil</Link>
        <Link to="/login" className="navbar__link">Cerrar Sesión</Link>
      </div>
    </nav>
    <div className="navbar-spacer" />
    </>
  
  );
}
