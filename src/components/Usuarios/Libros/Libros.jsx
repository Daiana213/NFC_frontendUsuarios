import { useEffect, useMemo, useState } from 'react';
import Navbar from '../NavBar/Navbar';
import Footer from '../../Footer/Footer';
import './Libros.css';

export default function Libros() {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prestamosActivos, setPrestamosActivos] = useState([]);
  const [query, setQuery] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Función para obtener el estado real del libro
  const obtenerEstadoReal = (libro) => {
    // Si el estado es 'libre', está disponible
    if (libro.estado === 'libre') {
      return 'disponible';
    }

    // Si está en préstamo o reservado, buscar préstamos activos por título
    const prestamoActivo = prestamosActivos.find(p => 
      p.titulo && p.titulo.toLowerCase() === libro.titulo.toLowerCase()
    );
    
    if (prestamoActivo && prestamoActivo.fecha_final) {
      // Verificar si ya pasaron más de 7 días desde la fecha final del préstamo
      const fechaFinal = new Date(prestamoActivo.fecha_final);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche
      fechaFinal.setHours(0, 0, 0, 0);
      
      const diasTranscurridos = Math.floor((hoy - fechaFinal) / (1000 * 60 * 60 * 24));

      // Si pasaron más de 7 días desde la fecha final, el libro debería estar disponible
      if (diasTranscurridos > 7) {
        return 'disponible';
      }
    }

    // Por defecto, si está en_prestamo o reservado, no está disponible
    return 'no_disponible';
  };

  // Cargar libros y préstamos
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setError('');

      try {
        // Cargar libros
        console.log('Intentando cargar libros desde:', `${apiUrl}/api/libros`);
        const respLibros = await fetch(`${apiUrl}/api/libros`);
        
        if (!respLibros.ok) {
          const errorText = await respLibros.text();
          console.error('Error en respuesta:', respLibros.status, errorText);
          throw new Error(`Error al cargar los libros: ${respLibros.status} - ${errorText}`);
        }
        
        const librosData = await respLibros.json();
        console.log('Libros recibidos:', librosData);
        console.log('Cantidad de libros:', Array.isArray(librosData) ? librosData.length : 'No es un array');
        
        // Verificar que sea un array
        if (Array.isArray(librosData)) {
          setLibros(librosData);
        } else {
          console.error('La respuesta no es un array:', librosData);
          setLibros([]);
          setError('Formato de respuesta inválido del servidor');
        }

        // Cargar préstamos activos para verificar estados
        try {
          const respPrestamos = await fetch(`${apiUrl}/api/prestamos-libros`);
          if (respPrestamos.ok) {
            const prestamosData = await respPrestamos.json();
            console.log('Préstamos activos recibidos:', prestamosData);
            setPrestamosActivos(Array.isArray(prestamosData) ? prestamosData : []);
          }
        } catch (prestamoError) {
          console.warn('Error al cargar préstamos (no crítico):', prestamoError);
          // No es crítico si falla cargar préstamos
        }
      } catch (err) {
        console.error('Error completo:', err);
        setError(err.message || 'Error al cargar los libros. Verifica que el backend esté corriendo en ' + apiUrl);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [apiUrl]);

  // Debounce del query y filtrado local en memoria
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const h = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300);
    return () => clearTimeout(h);
  }, [query]);

  const librosFiltrados = useMemo(() => {
    if (!debouncedQuery) return libros;
    return (libros || []).filter(l => {
      const texto = `${l.titulo || ''} ${l.autor || ''} ${l.segundo_autor || ''} ${l.tercer_autor || ''} ${l.asignatura || ''} ${l.isbn || ''}`.toLowerCase();
      return texto.includes(debouncedQuery);
    });
  }, [libros, debouncedQuery]);

  // Función para obtener imagen por defecto
  const obtenerImagen = (libro) => {
    if (libro.portada) return libro.portada;
    return libro.portada || 'Sin imagen';
  };

  // Función para obtener descripción
  const obtenerDescripcion = (libro) => {
    if (libro.sub_titulo) return libro.sub_titulo;
    if (libro.palabra_clave) return libro.palabra_clave;
    return `Asignatura: ${libro.asignatura || 'No especificada'}`;
  };

  // Función para obtener texto del estado
  const obtenerTextoEstado = (libro) => {
    const estadoReal = obtenerEstadoReal(libro);
    return estadoReal === 'disponible' ? 'Disponible' : 'No Disponible';
  };

  // Función para obtener clase CSS del estado
  const obtenerClaseEstado = (libro) => {
    const estadoReal = obtenerEstadoReal(libro);
    return estadoReal === 'disponible' ? 'estado-disponible' : 'estado-no-disponible';
  };

  if (loading) {
    return (
      <main>
        <Navbar />
        <section className="libros-container">
          <div className="libros-loading">Cargando libros...</div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="libros-container">
        <h2 className="libros-title">Catálogo de Libros</h2>
        <div className="libros-search">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, autor, asignatura, ISBN..."
            className="libros-search-input"
          />
        </div>
        
        {error && (
          <div className="libros-error">
            {error}
          </div>
        )}

        {librosFiltrados.length === 0 && !loading ? (
          <div className="libros-empty">
            No hay libros disponibles en el catálogo.
            {error && (
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#dc3545' }}>
                <strong>Error:</strong> {error}
              </div>
            )}
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
              Verifica en la consola del navegador (F12) para más detalles.
            </div>
          </div>
        ) : librosFiltrados.length > 0 ? (
          <div className="libros-grid">
            {librosFiltrados.map((libro) => (
              <div key={libro.id_libro} className="libro-card">
                <div className="libro-imagen-container">
                  <img 
                    src={obtenerImagen(libro)} 
                    alt={libro.titulo}
                    className="libro-imagen"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x300/3949ab/ffffff?text=Libro';
                    }}
                  />
                  <div className={`libro-estado-badge ${obtenerClaseEstado(libro)}`}>
                    {obtenerTextoEstado(libro)}
                  </div>
                </div>
                <div className="libro-contenido">
                  <h3 className="libro-titulo">{libro.titulo}</h3>
                  <p className="libro-descripcion">{obtenerDescripcion(libro)}</p>
                  <div className="libro-detalles">
                    <div className="libro-detalle">
                      <span className="libro-detalle-label">Autor:</span>
                      <span className="libro-detalle-value">
                        {libro.autor}
                        {libro.segundo_autor && `, ${libro.segundo_autor}`}
                        {libro.tercer_autor && `, ${libro.tercer_autor}`}
                      </span>
                    </div>
                    {libro.asignatura && (
                      <div className="libro-detalle">
                        <span className="libro-detalle-label">Asignatura:</span>
                        <span className="libro-detalle-value">{libro.asignatura}</span>
                      </div>
                    )}
                    {libro.edicion && (
                      <div className="libro-detalle">
                        <span className="libro-detalle-label">Edición:</span>
                        <span className="libro-detalle-value">{libro.edicion}</span>
                      </div>
                    )}
                    {libro.anio && (
                      <div className="libro-detalle">
                        <span className="libro-detalle-label">Año:</span>
                        <span className="libro-detalle-value">{libro.anio}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>
      <Footer />
    </main>
  );
}

