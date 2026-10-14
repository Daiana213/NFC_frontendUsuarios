import HeaderAuth from '../HeaderAuth/HeaderAuth';
import Footer from '../Footer/Footer';
import { 
  FaBook, 
  FaLaptop, 
  FaCalendarAlt, 
  FaIdCard, 
  FaUniversity 
} from 'react-icons/fa';
import './Home.css';

export default function LandingPage() {
  return (
    <main className="home-page-wrapper">
      <HeaderAuth />

      <section className="home-bg">
        <div className="home-container">
          <div className="home-main">
            <div className="home-content">
              <div className="institution-badge">
                <FaUniversity className="badge-icon" />
                <span>Facultad Regional San Francisco</span>
              </div>

              <h1 className="main-title">BIBLIOTECA UTN</h1>
              <h2 className="subtitle">Gestión Bibliotecaria y Recursos Tecnológicos</h2>

              <p className="welcome-text">
                Bienvenido al portal digital de la biblioteca. Consulta la disponibilidad de salas en tiempo real, 
                solicita turnos de estudio, reserva computadoras y gestiona tus préstamos con tu credencial NFC.
              </p>

              <div className="features-grid">
                <div className="feature-pill">
                  <FaBook className="feature-icon" />
                  <span>Catálogo de Libros</span>
                </div>
                <div className="feature-pill">
                  <FaLaptop className="feature-icon" />
                  <span>Computadoras</span>
                </div>
                <div className="feature-pill">
                  <FaCalendarAlt className="feature-icon" />
                  <span>Turnos de Estudio</span>
                </div>
                <div className="feature-pill">
                  <FaIdCard className="feature-icon" />
                  <span>Identificación NFC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}