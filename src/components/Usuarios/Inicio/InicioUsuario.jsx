import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../NavBar/Navbar';
import Footer from '../../Footer/Footer';
import './InicioUsuario.css';

export default function InicioUsuario() {
  const [userName, setUserName] = useState('');

  useEffect(()=>{
    const nombre = localStorage.getItem("nombre");
    console.log(nombre);
    setUserName(nombre);
  },[])

  return (
    <main>
      <Navbar/>
        <section className="inicio-container">
        <h2 className="inicio-title">¡Hola, {userName}!</h2>
        <div className="inicio-subtitle">Bienvenido al sistema de registro de la Biblioteca Universitaria.</div>
        <div className="inicio-description">
          Aquí podés consultar la disponibilidad de espacios, el uso de salas y tus préstamos activos.
        </div>
        <div className="turno-cta">
          <Link to="/turno" className="turno-btn">Solicitud de Turno</Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}