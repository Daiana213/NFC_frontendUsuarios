import './Home.css';
import logo from '../../assets/biblioteca-UTN.jpg';
import HeaderAuth from '../HeaderAuth/HeaderAuth';
import Footer from '../Footer/Footer';

export default function LandingPage() {
  return (
    <main>
      <HeaderAuth />
      <div className="home-bg">
        <div className="home-container">
          <div className="home-main">
            <div className="home-content">
              <h1 className="main-title">BIBLIOTECA UTN</h1>
              <h2 className="subtitle">REGIONAL SAN FRANCISCO</h2>
              <div className="divider"></div>
              <p className="welcome-text">
                Bienvenido al sistema de gestión bibliotecaria de la Universidad Tecnológica Nacional
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}