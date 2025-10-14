import { useState, useEffect } from 'react';
import Header from '../NavBar/Navbar';
import Footer from '../../Footer/Footer';
import './Disponibilidad.css';

export default function Disponibilidad() {
  const [personasEnBiblioteca, setPersonasEnBiblioteca] = useState(0);
  const [computadorasEnUso, setComputadorasEnUso] = useState(0);
  const [computadorasDisponibles, setComputadorasDisponibles] = useState(0);
  const [capacidadMaxima] = useState(150); // Capacidad máxima de la biblioteca
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener datos de ocupación desde la API
  const obtenerDatosOcupacion = async () => {
    try {
      setLoading(true);
      
      // Obtener computadoras
      const responseComputadoras = await fetch('http://localhost:3000/api/computadoras');
      const computadoras = await responseComputadoras.json();
      
      // Obtener préstamos activos de computadoras
      const responsePrestamos = await fetch('http://localhost:3000/api/prestamos-computadora');
      const prestamos = await responsePrestamos.json();
      
      // Calcular computadoras en uso
      const computadorasOcupadas = prestamos.filter(prestamo => !prestamo.hora_fin).length;
      const computadorasLibres = computadoras.length - computadorasOcupadas;
      
      // Simular personas en biblioteca (ya que no tenemos sistema de entradas)
      const personasActivas = Math.floor(Math.random() * 100) + 20;
      
      setPersonasEnBiblioteca(personasActivas);
      setComputadorasEnUso(computadorasOcupadas);
      setComputadorasDisponibles(computadorasLibres);
      setUltimaActualizacion(new Date());
      setError(null);
      
    } catch (err) {
      console.error('Error al obtener datos de ocupación:', err);
      setError('Error al cargar datos de disponibilidad');
      
      // Fallback a datos simulados si hay error
      const nuevaCantidad = Math.floor(Math.random() * 100) + 20;
      setPersonasEnBiblioteca(nuevaCantidad);
      setComputadorasEnUso(Math.floor(Math.random() * 20) + 5);
      setComputadorasDisponibles(Math.floor(Math.random() * 15) + 10);
    } finally {
      setLoading(false);
    }
  };

  // Configurar SSE para actualizaciones en tiempo real
  useEffect(() => {
    // Cargar datos iniciales
    obtenerDatosOcupacion();
    
    // Configurar SSE
    const eventSource = new EventSource('http://localhost:3000/api/events');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ocupacion_update') {
        obtenerDatosOcupacion();
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('Error en SSE:', error);
      // Fallback a polling cada 30 segundos si SSE falla
      const interval = setInterval(obtenerDatosOcupacion, 30000);
      return () => clearInterval(interval);
    };
    
    return () => {
      eventSource.close();
    };
  }, []);

  const porcentajeOcupacion = Math.round((personasEnBiblioteca / capacidadMaxima) * 100);
  const espaciosDisponibles = capacidadMaxima - personasEnBiblioteca;

  if (loading) {
    return (
      <main>
        <Header/>
        <div>
          <h1>Disponibilidad de la Biblioteca</h1>
          <p>Cargando datos de ocupación...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header/>
      <div>
        <h1>Disponibilidad de la Biblioteca</h1>
        {error && (
          <div>
            ⚠️ {error} - Mostrando datos simulados
          </div>
        )}
        <section>
          <h2>{personasEnBiblioteca} personas en la biblioteca</h2>
          <p>Estado: {porcentajeOcupacion < 50 ? 'Disponible' : porcentajeOcupacion < 80 ? 'Moderado' : 'Lleno'}</p>
        </section>
        <section>
          <ul>
            <li>Espacios disponibles: {espaciosDisponibles}</li>
            <li>Ocupación: {porcentajeOcupacion}%</li>
            <li>Computadoras libres: {computadorasDisponibles}</li>
            <li>Computadoras en uso: {computadorasEnUso}</li>
          </ul>
        </section>
        <section>
          <h3>Nivel de ocupación</h3>
          <p>{personasEnBiblioteca} de {capacidadMaxima} espacios ocupados</p>
        </section>
        <section>
          <h3>Información importante</h3>
          <ul>
            <li>Los datos de computadoras se actualizan en tiempo real desde la base de datos</li>
            <li>Los datos de personas en biblioteca son simulados (sistema de entradas no implementado)</li>
            <li>La capacidad máxima es de {capacidadMaxima} personas</li>
            <li>Última actualización: {ultimaActualizacion.toLocaleTimeString()}</li>
            <li>Se recomienda llegar temprano en horarios pico (8:00-10:00 y 14:00-16:00)</li>
            <li>Las computadoras se reservan por tiempo limitado</li>
          </ul>
        </section>
      </div>
      <Footer />
    </main>
  );
}
