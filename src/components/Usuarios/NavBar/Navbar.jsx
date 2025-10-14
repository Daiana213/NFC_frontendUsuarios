import { Link } from 'react-router-dom';
import './Navbar.css';
import Header from '../NavBar/Navbar';
import Footer from '../../Footer/Footer';
import Logo from '../../../assets/LogoUTN.png';

export default function Navbar() {
  return (
  <main>
    <Header />
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
        <Link to="/tarjeta" className="navbar__link">Tarjeta</Link>
        <Link to="/prestamos" className="navbar__link">Préstamos</Link>
        <Link to="/perfil" className="navbar__link">Perfil</Link>
      </div>
    </nav>
    <Footer />
  </main>
  
  );
}
