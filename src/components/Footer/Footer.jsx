import './Footer.css';
import { FaFacebookF, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaPhone, FaGlobe } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3 className="footer-title">Biblioteca UTN</h3>
          <p className="footer-subtitle">Facultad Regional San Francisco</p>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Contacto</h4>
          <div className="footer-contact">
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>Av. de la Universidad 501, San Francisco, Córdoba</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>pasantias@sanfrancisco.utn.edu.ar</span>
            </div>
            <div className="contact-item">
              <FaGlobe className="contact-icon" />
              <a href="https://www.sanfrancisco.utn.edu.ar" target="_blank" rel="noopener noreferrer">
                www.sanfrancisco.utn.edu.ar
              </a>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Síguenos</h4>
          <div className="footer-social">
            <a 
              href="https://www.facebook.com/people/Biblioteca-Utn-frsfco/pfbid0jc6B37Y8HgTLNb12jAoVaq48noXHX9u9aaqrGy6dsuqaoP31i13PZaSNHc2rSgGfl/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook UTN San Francisco"
              className="social-link"
            >
              <FaFacebookF />
            </a>
            <a 
              href="https://www.instagram.com/bibliotecautn_frsfco/?hl=es-la" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram UTN San Francisco"
              className="social-link"
            >
              <FaInstagram />
            </a>
            <a 
              href="mailto:biblioteca@sanfrancisco.utn.edu.ar" 
              aria-label="Email biblioteca"
              className="social-link"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>
      <p>&copy; {new Date().getFullYear()} Biblioteca UTN - Todos los derechos reservados.</p>
    </footer>
  );
}
