import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/LogoUTN.png';
import { FaUserCircle, FaSignOutAlt, FaChevronDown, FaUser } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userName = localStorage.getItem('nombre') || 'Usuario';
  const tipoUsuario = localStorage.getItem('tipo_usuario') || '';

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    setDropdownOpen(false);
    localStorage.removeItem('nombre');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('tipo_usuario');
    navigate('/login');
  };

  // Cerrar menú al hacer clic fuera del componente
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { to: '/inicio', label: 'Inicio' },
    { to: '/turno', label: 'Turnos' },
    { to: '/computadoras', label: 'Computadoras' },
    { to: '/libros', label: 'Catálogo de Libros' },
    { to: '/disponibilidad', label: 'Disponibilidad' },
  ];

  return (
    <>
      <header className="navbar-header">
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/inicio" className="navbar__logo" title="Ir a Inicio">
              <div className="logo-container">
                <img src={Logo} alt="UTN San Francisco" className="header-auth__logo-img" />
              </div>
            </Link>
          </div>

          <nav className="navbar__nav">
            <div className="navbar__links">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`navbar__link ${location.pathname === link.to ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Menú desplegable del usuario */}
              <div className="navbar__user-menu" ref={dropdownRef}>
                <button
                  type="button"
                  className={`navbar__user-btn ${dropdownOpen ? 'open' : ''} ${location.pathname === '/perfil' ? 'active-profile' : ''}`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  aria-label="Menú de usuario"
                >
                  <FaUserCircle className="user-icon" />
                  <span className="user-name-text">{userName.split(' ')[0]}</span>
                  <FaChevronDown className={`chevron-icon ${dropdownOpen ? 'rotate' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="navbar__dropdown">
                    <div className="dropdown__header">
                      <div className="dropdown__avatar-box">
                        <FaUserCircle />
                      </div>
                      <div className="dropdown__user-info">
                        <p className="dropdown__user-name">{userName}</p>
                        {tipoUsuario && <span className="dropdown__user-role">{tipoUsuario}</span>}
                      </div>
                    </div>

                    <div className="dropdown__divider" />

                    <Link
                      to="/perfil"
                      className={`dropdown__item ${location.pathname === '/perfil' ? 'item-active' : ''}`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUser className="dropdown__item-icon" />
                      <span>Mi Perfil</span>
                    </Link>

                    <div className="dropdown__divider" />

                    <button
                      type="button"
                      className="dropdown__item dropdown__logout"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="dropdown__item-icon" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>
      <div className="navbar-spacer" />
    </>
  );
}
