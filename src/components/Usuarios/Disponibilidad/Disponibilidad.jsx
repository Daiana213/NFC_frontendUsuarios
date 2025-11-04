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

  useEffect(() => {
    const obtenerDisponibilidad = async () => {
      try {
        const ahora = new Date();
        const haceTresHoras = new Date(ahora.getTime() - 3 * 60 * 60 * 1000);

        const resUsuariosNFC = await fetch(`${apiUrl}/api/dashboard/personas-dentro`);
        const usuariosNFC = await resUsuariosNFC.json();

        const resTurnos = await fetch(`${apiUrl}/api/turnos`);
        const todosTurnos = await resTurnos.json();
        console.log('Turnos obtenidos para disponibilidad:', todosTurnos);

        const turnosValidos = todosTurnos.filter(turno => {
          if (turno.estado !== 'ingreso') return false;
          const fechaHoraTurno = new Date(`${turno.fecha}T${turno.hora}`);
          return fechaHoraTurno >= haceTresHoras;
        });

        console.log('Turnos válidos para ocupación:', turnosValidos);

        const personasDentro = Number(usuariosNFC?.personasDentro) || 0;
        const totalOcupacion = personasDentro + turnosValidos.length;
        const espaciosDisponibles = CAPACIDAD_MAXIMA - totalOcupacion;

        setOcupacion(totalOcupacion);
        setDisponible(espaciosDisponibles);
        setAlerta(totalOcupacion >= CAPACIDAD_MAXIMA * 0.8);
        setCargando(false);
      } catch (error) {
        console.error('Error al obtener disponibilidad:', error);
        setCargando(false);
      }
    };

    obtenerDisponibilidad();
  }, []);

  if (cargando) return <p>Cargando disponibilidad...</p>;

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
            <div className="ocupado" style={{ width: `${porcentaje}%` }}></div>
          </div>
          <p className="porcentaje">Ocupación: {porcentaje.toFixed(1)}%</p>
        </article>
      </section>
      <Footer />
    </main>
  );
}

export default Disponibilidad;
