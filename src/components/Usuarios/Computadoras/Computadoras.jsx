import { useEffect, useMemo, useState } from 'react';
import Navbar from '../NavBar/Navbar';
import Footer from '../../Footer/Footer';
import './Computadoras.css';

export default function Computadoras() {
  const [computadoras, setComputadoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Cargar computadoras
  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError('');
      try {
        const r = await fetch(`${apiUrl}/api/computadoras`);
        if (!r.ok) throw new Error('Error al cargar computadoras');
        const data = await r.json();
        setComputadoras(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'Error al cargar computadoras');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [apiUrl]);

  // Debounce para búsqueda local
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const h = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300);
    return () => clearTimeout(h);
  }, [query]);

  // Solo mostrar disponibles; aplicar filtro por búsqueda (marca, modelo, SO)
  const disponiblesFiltradas = useMemo(() => {
    const disponibles = (computadoras || []).filter(c => c.estado === 'disponible');
    if (!debouncedQuery) return disponibles;
    return disponibles.filter(c => {
      const texto = `${c.marca || ''} ${c.modelo || ''} ${c.sistema_operativo || ''}`.toLowerCase();
      return texto.includes(debouncedQuery);
    });
  }, [computadoras, debouncedQuery]);

  const obtenerImagen = () => {
    return `https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=640&h=360&fit=crop&auto=format`;
  };

  if (loading) {
    return (
      <main>
        <Navbar />
        <section className="computadoras-container">
          <div className="computadoras-loading">Cargando computadoras...</div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="computadoras-container">
        <h2 className="computadoras-title">Computadoras Disponibles</h2>

        <div className="computadoras-search">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por marca, modelo o sistema operativo..."
            className="computadoras-search-input"
          />
        </div>

        {error && (
          <div className="computadoras-error">{error}</div>
        )}

        {disponiblesFiltradas.length === 0 ? (
          <div className="computadoras-empty">No hay computadoras disponibles que coincidan con la búsqueda.</div>
        ) : (
          <div className="computadoras-grid">
            {disponiblesFiltradas.map((c) => (
              <div key={c.id_computadora} className="computadora-card">
                <div className="computadora-imagen-container">
                  <img
                    src={obtenerImagen()}
                    alt={`${c.marca} ${c.modelo}`}
                    className="computadora-imagen"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/640x360/091465/ffffff?text=PC'; }}
                  />
                  <div className="computadora-estado-badge estado-disponible">Disponible</div>
                </div>
                <div className="computadora-contenido">
                  <h3 className="computadora-titulo">{c.marca} {c.modelo}</h3>
                  <div className="computadora-detalles">
                    <div className="computadora-detalle">
                      <span className="computadora-detalle-label">Sistema Operativo:</span>
                      <span className="computadora-detalle-value">{c.sistema_operativo}</span>
                    </div>
                    {c.observacion && (
                      <div className="computadora-detalle">
                        <span className="computadora-detalle-label">Observación:</span>
                        <span className="computadora-detalle-value">{c.observacion}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}


