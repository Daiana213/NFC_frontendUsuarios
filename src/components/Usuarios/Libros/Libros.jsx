import { useEffect, useMemo, useState } from 'react';
import Navbar from '../NavBar/Navbar';
import Footer from '../../Footer/Footer';
import { 
  FaBook, 
  FaTimes, 
  FaChevronRight, 
  FaMapMarkerAlt, 
  FaUserTie 
} from 'react-icons/fa';
import './Libros.css';

export default function Libros() {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prestamosActivos, setPrestamosActivos] = useState([]);
  const [query, setQuery] = useState('');
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Función para obtener el estado real del libro
  const obtenerEstadoReal = (libro) => {
    if (!libro) return 'no_disponible';
    if (libro.estado === 'libre') {
      return 'disponible';
    }

    const prestamoActivo = prestamosActivos.find(p => 
      p.titulo && p.titulo.toLowerCase() === libro.titulo.toLowerCase()
    );
    
    if (prestamoActivo && prestamoActivo.fecha_final) {
      const fechaFinal = new Date(prestamoActivo.fecha_final);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      fechaFinal.setHours(0, 0, 0, 0);
      
      const diasTranscurridos = Math.floor((hoy - fechaFinal) / (1000 * 60 * 60 * 24));
      if (diasTranscurridos > 7) {
        return 'disponible';
      }
    }

    return 'no_disponible';
  };

  // Cargar libros y préstamos
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setError('');

      try {
        const respLibros = await fetch(`${apiUrl}/api/libros`);
        if (!respLibros.ok) {
          const errorText = await respLibros.text();
          throw new Error(`Error al cargar los libros: ${respLibros.status}`);
        }
        
        const librosData = await respLibros.json();
        if (Array.isArray(librosData)) {
          setLibros(librosData);
        } else {
          setLibros([]);
          setError('Formato de respuesta inválido del servidor');
        }

        try {
          const respPrestamos = await fetch(`${apiUrl}/api/prestamos-libros`);
          if (respPrestamos.ok) {
            const prestamosData = await respPrestamos.json();
            setPrestamosActivos(Array.isArray(prestamosData) ? prestamosData : []);
          }
        } catch (prestamoError) {
          console.warn('Error al cargar préstamos:', prestamoError);
        }
      } catch (err) {
        console.error('Error al cargar libros:', err);
        setError(err.message || 'Error al cargar el catálogo de libros');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [apiUrl]);

  // Manejo de teclado (Esc) y bloqueo de scroll cuando el panel está abierto
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLibroSeleccionado(null);
      }
    };

    if (libroSeleccionado) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [libroSeleccionado]);

  // Debounce del query y filtrado local
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

  const obtenerTextoEstado = (libro) => {
    return obtenerEstadoReal(libro) === 'disponible' ? 'Disponible' : 'No disponible';
  };

  const obtenerClaseEstado = (libro) => {
    return obtenerEstadoReal(libro) === 'disponible' ? 'estado-disponible' : 'estado-no-disponible';
  };

  if (loading) {
    return (
      <main>
        <Navbar />
        <section className="libros-container">
          <div className="libros-loading">Cargando catálogo de libros...</div>
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
            No se encontraron libros que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="libros-grid">
            {librosFiltrados.map((libro) => {
              const esDisponible = obtenerEstadoReal(libro) === 'disponible';
              return (
                <div 
                  key={libro.id_libro} 
                  className="libro-card"
                  onClick={() => setLibroSeleccionado(libro)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLibroSeleccionado(libro); }}
                >
                  <div className="libro-portada-wrapper">
                    {libro.portada ? (
                      <img 
                        src={libro.portada} 
                        alt={libro.titulo}
                        className="libro-portada-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.parentElement.querySelector('.libro-portada-fallback');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="libro-portada-fallback" 
                      style={{ display: libro.portada ? 'none' : 'flex' }}
                    >
                      <FaBook className="fallback-book-icon" />
                      <span className="fallback-category">{libro.asignatura || 'Biblioteca UTN'}</span>
                    </div>

                    <div className={`libro-badge ${esDisponible ? 'badge-disponible' : 'badge-no-disponible'}`}>
                      <span className="badge-dot" />
                      {esDisponible ? 'Disponible' : 'No disponible'}
                    </div>
                  </div>

                  <div className="libro-info-card">
                    {libro.asignatura && (
                      <span className="libro-categoria-tag">{libro.asignatura}</span>
                    )}
                    <h3 className="libro-titulo" title={libro.titulo}>
                      {libro.titulo}
                    </h3>
                    <p className="libro-autor">
                      {libro.autor || 'Autor no especificado'}
                    </p>

                    <div className="libro-card-footer">
                      <button 
                        type="button" 
                        className="libro-btn-detalles"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLibroSeleccionado(libro);
                        }}
                      >
                        <span>Ver detalles</span>
                        <FaChevronRight className="btn-arrow-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Panel lateral (Drawer) con la información completa del libro */}
        {libroSeleccionado && (
          <div 
            className="libro-drawer-overlay" 
            onClick={() => setLibroSeleccionado(null)}
          >
            <aside 
              className="libro-drawer" 
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="drawer-titulo-id"
            >
              {/* Header del Panel */}
              <div className="drawer-header">
                <span className={`drawer-estado-badge ${obtenerClaseEstado(libroSeleccionado)}`}>
                  <span className="badge-dot" />
                  {obtenerTextoEstado(libroSeleccionado)}
                </span>
                <button 
                  type="button" 
                  className="drawer-close-btn"
                  onClick={() => setLibroSeleccionado(null)}
                  aria-label="Cerrar panel"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Cuerpo del Panel con scroll */}
              <div className="drawer-body">
                {/* Cabecera del libro */}
                <div className="drawer-hero">
                  <div className="drawer-portada-box">
                    {libroSeleccionado.portada ? (
                      <img 
                        src={libroSeleccionado.portada} 
                        alt={libroSeleccionado.titulo} 
                        className="drawer-portada-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.parentElement.querySelector('.drawer-portada-fallback');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="drawer-portada-fallback"
                      style={{ display: libroSeleccionado.portada ? 'none' : 'flex' }}
                    >
                      <FaBook className="drawer-fallback-icon" />
                    </div>
                  </div>
                  <div className="drawer-hero-info">
                    {libroSeleccionado.asignatura && (
                      <span className="drawer-badge-asignatura">
                        {libroSeleccionado.asignatura}
                      </span>
                    )}
                    <h3 id="drawer-titulo-id" className="drawer-titulo">
                      {libroSeleccionado.titulo}
                    </h3>
                    {libroSeleccionado.sub_titulo && (
                      <p className="drawer-subtitulo">{libroSeleccionado.sub_titulo}</p>
                    )}
                  </div>
                </div>

                <div className="drawer-divider" />

                {/* Sección: Información bibliográfica */}
                <div className="drawer-section">
                  <h4 className="drawer-section-title">
                    <FaUserTie className="section-icon" /> Información Bibliográfica
                  </h4>
                  <div className="drawer-details-list">
                    <div className="drawer-detail-row">
                      <span className="detail-label">Autor principal</span>
                      <span className="detail-value">{libroSeleccionado.autor || 'No especificado'}</span>
                    </div>

                    {(libroSeleccionado.segundo_autor || libroSeleccionado.tercer_autor) && (
                      <div className="drawer-detail-row">
                        <span className="detail-label">Otros autores</span>
                        <span className="detail-value">
                          {[libroSeleccionado.segundo_autor, libroSeleccionado.tercer_autor].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}

                    {libroSeleccionado.editorial && (
                      <div className="drawer-detail-row">
                        <span className="detail-label">Editorial</span>
                        <span className="detail-value">{libroSeleccionado.editorial}</span>
                      </div>
                    )}

                    {libroSeleccionado.edicion && (
                      <div className="drawer-detail-row">
                        <span className="detail-label">Edición</span>
                        <span className="detail-value">{libroSeleccionado.edicion}</span>
                      </div>
                    )}

                    {libroSeleccionado.anio && (
                      <div className="drawer-detail-row">
                        <span className="detail-label">Año de publicación</span>
                        <span className="detail-value">{libroSeleccionado.anio}</span>
                      </div>
                    )}

                    {libroSeleccionado.isbn && (
                      <div className="drawer-detail-row">
                        <span className="detail-label">ISBN</span>
                        <span className="detail-value code-value">{libroSeleccionado.isbn}</span>
                      </div>
                    )}

                    {libroSeleccionado.idioma && (
                      <div className="drawer-detail-row">
                        <span className="detail-label">Idioma</span>
                        <span className="detail-value">{libroSeleccionado.idioma}</span>
                      </div>
                    )}

                    {libroSeleccionado.cant_paginas && (
                      <div className="drawer-detail-row">
                        <span className="detail-label">Cantidad de páginas</span>
                        <span className="detail-value">{libroSeleccionado.cant_paginas} págs.</span>
                      </div>
                    )}

                    {libroSeleccionado.tamano && (
                      <div className="drawer-detail-row">
                        <span className="detail-label">Dimensiones</span>
                        <span className="detail-value">{libroSeleccionado.tamano}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="drawer-divider" />

                {/* Sección: Ubicación y Préstamo */}
                <div className="drawer-section">
                  <h4 className="drawer-section-title">
                    <FaMapMarkerAlt className="section-icon" /> Disponibilidad y Biblioteca
                  </h4>
                  <div className="drawer-details-list">
                    {libroSeleccionado.ubicacion && (
                      <div className="drawer-detail-row">
                        <span className="detail-label">Ubicación física</span>
                        <span className="detail-value">{libroSeleccionado.ubicacion}</span>
                      </div>
                    )}

                    {libroSeleccionado.nivel && (
                      <div className="drawer-detail-row">
                        <span className="detail-label">Nivel / Estante</span>
                        <span className="detail-value">{libroSeleccionado.nivel}</span>
                      </div>
                    )}

                    <div className="drawer-detail-row">
                      <span className="detail-label">Plazo de préstamo</span>
                      <span className="detail-value">
                        {libroSeleccionado.dias_de_prestamo ? `${libroSeleccionado.dias_de_prestamo} días` : '7 días'}
                      </span>
                    </div>

                    {libroSeleccionado.serie && (
                      <div className="drawer-detail-row">
                        <span className="detail-label">Serie</span>
                        <span className="detail-value">{libroSeleccionado.serie}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sección: Palabras clave y Observaciones */}
                {(libroSeleccionado.palabra_clave || libroSeleccionado.observaciones) && (
                  <>
                    <div className="drawer-divider" />
                    <div className="drawer-section">
                      {libroSeleccionado.palabra_clave && (
                        <div className="drawer-tags-box">
                          <span className="detail-label">Palabras clave</span>
                          <div className="tags-container">
                            {libroSeleccionado.palabra_clave.split(',').map((kw, i) => (
                              <span key={i} className="keyword-tag">{kw.trim()}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {libroSeleccionado.observaciones && (
                        <div className="drawer-observaciones-box">
                          <span className="detail-label">Observaciones</span>
                          <p className="observaciones-text">{libroSeleccionado.observaciones}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Footer del Panel */}
              <div className="drawer-footer">
                <button 
                  type="button" 
                  className="drawer-close-action-btn"
                  onClick={() => setLibroSeleccionado(null)}
                >
                  Cerrar
                </button>
              </div>
            </aside>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}

