import { useEffect, useState } from 'react';
import './Disponibilidad.css';
import Navbar from '../NavBar/Navbar';
import Footer from '../../Footer/Footer';

const CAPACIDAD_MAXIMA = 55;
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Disponibilidad() {
  const [ocupacion, setOcupacion] = useState(0);
  const [disponible, setDisponible] = useState(0);
  const [alerta, setAlerta] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [desglose, setDesglose] = useState({ nfc: 0, turnos: 0 });

  useEffect(() => {
    const obtenerDisponibilidad = async () => {
      try {
        // Usar SOLO el endpoint de personas-dentro que ya incluye NFC + Turnos
        const resPersonasDentro = await fetch(`${apiUrl}/api/dashboard/personas-dentro`);
        const dataPersonas = await resPersonasDentro.json();
        
        console.log('Datos de personas dentro:', dataPersonas);

        // Si el endpoint devuelve desglose, usarlo, sino usar el total
        let totalOcupacion;
        let desgloseData = { nfc: 0, turnos: 0 };

        if (dataPersonas.desglose) {
          // El endpoint ya incluye desglose
          totalOcupacion = dataPersonas.personasDentro;
          desgloseData = dataPersonas.desglose;
        } else {
          // Endpoint antiguo - solo número total
          totalOcupacion = dataPersonas.personasDentro || 0;
          
          // Si necesitas el desglose, hacer consultas separadas
          try {
            const hoy = new Date().toISOString().split('T')[0];
            
            // Personas por NFC
            const resNFC = await fetch(`${apiUrl}/api/dashboard/personas-dentro-nfc`);
            const dataNFC = await resNFC.json();
            desgloseData.nfc = dataNFC.personasDentro || 0;
            
            // Personas por turnos
            const resTurnos = await fetch(`${apiUrl}/api/turnos?fecha=${hoy}`);
            const turnosHoy = await resTurnos.json();
            const turnosActivos = turnosHoy.filter(t => t.estado === 'ingreso');
            desgloseData.turnos = turnosActivos.length;
            
          } catch (error) {
            console.warn('No se pudo obtener desglose detallado:', error);
          }
        }

        const espaciosDisponibles = CAPACIDAD_MAXIMA - totalOcupacion;

        setOcupacion(totalOcupacion);
        setDisponible(espaciosDisponibles);
        setDesglose(desgloseData);
        setAlerta(totalOcupacion >= CAPACIDAD_MAXIMA * 0.8);
        setCargando(false);

      } catch (error) {
        console.error('Error al obtener disponibilidad:', error);
        setCargando(false);
      }
    };

    obtenerDisponibilidad();
    
    // Actualizar cada 30 segundos
    const intervalo = setInterval(obtenerDisponibilidad, 30000);
    return () => clearInterval(intervalo);
  }, []);

  if (cargando) return (
    <main>
      <Navbar />
      <div className="cargando">Cargando disponibilidad...</div>
      <Footer />
    </main>
  );

  const porcentaje = isFinite(ocupacion) && CAPACIDAD_MAXIMA > 0
    ? Math.min((ocupacion / CAPACIDAD_MAXIMA) * 100, 100)
    : 0;

  return (
    <main>
      <Navbar />
      <section className={`disponibilidad-container ${alerta ? 'alerta' : ''}`}>
        <header className="disponibilidad-header">
          <h1>Estado de la Biblioteca</h1>
          <p className="subtitulo">Información en tiempo real sobre ocupación y disponibilidad</p>
        </header>

        <article className="disponibilidad-info">
          <div className="dato">
            <span className="etiqueta">Ocupación actual:</span>
            <span className="valor">{ocupacion} personas</span>
          </div>
          <div className="dato">
            <span className="etiqueta">Espacios disponibles:</span>
            <span className="valor">{disponible}</span>
          </div>
          {alerta && (
            <div className="mensaje-alerta">
              La biblioteca está muy concurrida
              <span className="nota-disponibilidad">
                Aun así, te recomendamos acercarte: puede haber espacio disponible.
              </span>
            </div>
          )}
        </article>

        <article className="disponibilidad-barra">
          <div className="barra">
            <div 
              className={`ocupado ${alerta ? 'alerta' : ''}`} 
              style={{ width: `${porcentaje}%` }}
            ></div>
          </div>
          <p className="porcentaje">Ocupación: {porcentaje.toFixed(1)}%</p>
          <p className="capacidad-maxima">Capacidad máxima: {CAPACIDAD_MAXIMA} personas</p>
        </article>
      </section>
      <Footer />
    </main>
  );
}

export default Disponibilidad;