import { Link } from 'react-router-dom';
import Logo from '../../assets/LogoUTN.png';
import './HeaderAuth.css';

export default function HeaderAuth() {
  return (
    <>
      <header className="header-auth">
        <div className="header-container">
          <div className="header-left">
            <Link to="/" className="header-auth__logo" title="Inicio">
              <div className="logo-container">
                <img 
                  src={Logo} 
                  alt="UTN San Francisco" 
                  className="header-auth__logo-img" 
                />
              </div>
            </Link>
          </div>
          
          <nav className="header-nav">
            <div className="nav-links">
              <Link to="/login" className="header-auth__link login-link">
                <span>Iniciar Sesión</span>
              </Link>
              <Link to="/registro" className="header-auth__link register-link">
                <span>Registrarse</span>
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <div className="header-spacer" />
    </>
  );
}
