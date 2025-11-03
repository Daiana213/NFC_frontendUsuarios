import { useEffect, useState } from 'react';
import Navbar from '../NavBar/Navbar';
import Footer from '../../Footer/Footer';
import './Turno.css';

export default function Turno() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [area, setArea] = useState('');
  const [tematica, setTematica] = useState('');
  const [tipoAsistencia, setTipoAsistencia] = useState('presencial');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [errorUsuario, setErrorUsuario] = useState('');
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const idUsuario = localStorage.getItem('id_usuario');

  // Cargar datos del usuario desde el backend
  useEffect(() => {
    const fetchUsuario = async () => {
      setLoading(true);
      setError('');
      try {
        if (!idUsuario) {
          setError('No hay sesión activa');
          setLoading(false);
          return;
        }

        // Cargar todos y filtrar por id (backend no expone GET /usuarios/:id)
        const resp = await fetch(`${apiUrl}/api/usuarios`);
        if (!resp.ok) throw new Error('No se pudo cargar la información del usuario');
        const lista = await resp.json();
        const actual = Array.isArray(lista)
          ? lista.find(u => String(u.id_usuario) === String(idUsuario))
          : null;
        
        if (!actual) throw new Error('Usuario no encontrado');
        
        setUser({
          id_usuario: actual.id_usuario || '',
          nombre_completo: actual.nombre_completo || '',
          tipo_usuario: actual.tipo_usuario || '',
          email: actual.email || '',
          telefono: actual.telefono || '',
          domicilio: actual.domicilio || '',
          codigo_postal: actual.codigo_postal || '',
          ciudad: actual.ciudad || '',
          provincia: actual.provincia || '',
          sexo: actual.sexo || '',
          legajo: actual.legajo ?? ''
        });
      } catch (e) {
        setErrorUsuario(e.message || 'Error al cargar la información del usuario');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsuario();
  }, [apiUrl, idUsuario]);

  // Temáticas según el área seleccionada
  const tematicasSala = [
    'Asesoramiento: Formación para Usuarios Iniciales - Todos los servicios',
    'Asesoramiento: Formación para Usuarios Avanzados - Citación en Word',
    'Asesoramiento: Tesistas - Formulario resúmenes trabajos finales de carreras',
    'Asesoramiento: Uso Biblioteca libros en formato Digital - disponible en el Campus',
    'Búsqueda medida en otras redes internacionales',
    'Búsqueda medida en redes de bibliotecas nacionales',
    'Consulta: Catálogo Libros en formato papel / Acceso a sus tablas de contenidos',
    'Consulta Trabajos Finales de carrera / Acceso a sus tablas de contenidos',
    'Docente - Armado Bibliografía y Planificaciones',
    'Registro de Alta como Nuevo Usuario para Préstamos a Domicilio',
    'Renovaciones y Reservas Libros Papel - SOLO POR TEL O EMAIL',
    'Uso Computadoras de asesoría',
    'Uso de Salas para Estudio',
    'Varios'
  ];

  // Generar opciones de notebooks del 1 al 44
  const tematicasNotebooks = Array.from({ length: 44 }, (_, i) => `${i + 1} Notebook${i > 0 ? 's' : ''}`);

  // Resetear temática cuando cambia el área (solo relevante para sala)
  useEffect(() => {
    if (area === 'notebooks') {
      setTematica(''); // Limpiar temática al cambiar a notebooks
    } else {
      setTematica(''); // También resetear al cambiar a otra área
    }
  }, [area]);

  // Validar fecha dentro del rango permitido (10 marzo - 14 noviembre)
  const esFechaValida = (fechaStr) => {
    if (!fechaStr) return false;
    const fecha = new Date(fechaStr + 'T00:00:00');
    const año = fecha.getFullYear();
    const mes = fecha.getMonth(); // 0-11
    const dia = fecha.getDate();
    
    const fechaMinima = new Date(año, 2, 10); // 10 de marzo
    const fechaMaxima = new Date(año, 10, 14); // 14 de noviembre
    
    return fecha >= fechaMinima && fecha <= fechaMaxima;
  };

  // Calcular fechas mínimas y máximas para el input de fecha
  const obtenerFechaLimite = () => {
    const año = new Date().getFullYear();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar hora a medianoche
    const fechaMinima = new Date(año, 2, 10); // 10 de marzo
    const fechaMaxima = new Date(año, 10, 14); // 14 de noviembre
    
    // Si ya pasamos el 14 de noviembre de este año, mostrar el próximo año
    if (hoy > fechaMaxima) {
      return {
        min: `${año + 1}-03-10`,
        max: `${año + 1}-11-14`
      };
    }
    
    // Si estamos antes del 10 de marzo, permitir desde el 10 de marzo de este año
    if (hoy < fechaMinima) {
      return {
        min: `${año}-03-10`,
        max: `${año}-11-14`
      };
    }
    
    // Si estamos en el rango (10 marzo - 14 noviembre), permitir desde hoy
    const hoyStr = hoy.toISOString().split('T')[0];
    return {
      min: hoyStr,
      max: `${año}-11-14`
    };
  };

  const { min: fechaMinimaInput, max: fechaMaximaInput } = obtenerFechaLimite();

  // 🔹 Función de envío del formulario
  const enviarSolicitud = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    // Validación de campos
    if (!area) {
      setError('Debe seleccionar un área');
      return;
    }
    // La temática solo es requerida para "Espacio de Estudio" (sala), no para notebooks
    if (area === 'sala' && !tematica) {
      setError('Debe seleccionar una temática');
      return;
    }
    if (!fecha || !hora) {
      setError('Debe seleccionar fecha y hora');
      return;
    }

    // Validar que no sea una fecha pasada
    const hoy = new Date().toISOString().split('T')[0];
    if (fecha < hoy) {
      setError('No puede seleccionar una fecha pasada');
      return;
    }

    // Validar rango de fecha permitido
    if (!esFechaValida(fecha)) {
      setError('La fecha debe estar entre el 10 de marzo y el 14 de noviembre');
      return;
    }

    // Validación de rango horario (10:00 a 22:00)
    const [hStr, mStr] = hora.split(':');
    const totalMin = Number(hStr) * 60 + Number(mStr || 0);
    const minAllowed = 10 * 60;
    const maxAllowed = 22 * 60;
    
    if (totalMin < minAllowed || totalMin > maxAllowed) {
      setError('El horario debe estar entre 10:00 y 22:00');
      return;
    }

    try {
      setEnviando(true);
      const payload = {
        id_usuario: idUsuario,
        area,
        tematica,
        tipo_asistencia: tipoAsistencia,
        fecha,
        hora,
        observaciones
      };
      
      const resp = await fetch(`${apiUrl}/api/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error();
      console.log('Datos a enviar:', payload);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMensaje('Solicitud enviada correctamente');
      setArea('');
      setTematica('');
      setTipoAsistencia('presencial');
      setFecha('');
      setHora('');
      setObservaciones('');
    } catch (e) {
      setError('No se pudo enviar la solicitud');
    } finally {
      setEnviando(false);
    }
  };

  // Función para cancelar turno
  const cancelarTurno = () => {
    setArea('');
    setTematica('');
    setTipoAsistencia('presencial');
    setFecha('');
    setHora('');
    setObservaciones('');
    setMensaje('');
    setError('');
  };

  return (
    <main>
      <Navbar />
      <section className="turno-container">
        <h2 className="turno-title">Solicitud de Turno</h2>
        {loading ? (
          <div className="turno-loading">Cargando información del usuario...</div>
        ) : (
          <div className="turno-content">
            {/* 🔹 DATOS DEL USUARIO */}
            <div className="turno-datos">
              <h3>Datos del usuario</h3>
              {user ? (
                <div className="datos-grid">
                  <div className="dato">
                    <span className="label">DNI</span>
                    <span className="value">{user.id_usuario}</span>
                  </div>
                  <div className="dato">
                    <span className="label">Nombre completo</span>
                    <span className="value">{user.nombre_completo}</span>
                  </div>
                  <div className="dato">
                    <span className="label">Tipo de usuario</span>
                    <span className="value">{user.tipo_usuario}</span>
                  </div>
                  <div className="dato">
                    <span className="label">Email</span>
                    <span className="value">{user.email || '-'}</span>
                  </div>
                  <div className="dato">
                    <span className="label">Teléfono</span>
                    <span className="value">{user.telefono || '-'}</span>
                  </div>
                  <div className="dato">
                    <span className="label">Domicilio</span>
                    <span className="value">{user.domicilio || '-'}</span>
                  </div>
                  <div className="dato">
                    <span className="label">Código Postal</span>
                    <span className="value">{user.codigo_postal || '-'}</span>
                  </div>
                  <div className="dato">
                    <span className="label">Ciudad</span>
                    <span className="value">{user.ciudad || '-'}</span>
                  </div>
                  <div className="dato">
                    <span className="label">Provincia</span>
                    <span className="value">{user.provincia || '-'}</span>
                  </div>
                  <div className="dato">
                    <span className="label">Sexo</span>
                    <span className="value">{user.sexo || '-'}</span>
                  </div>
                  {['Cursante', 'Docente', 'No Docente'].includes(user.tipo_usuario) && (
                    <div className="dato">
                      <span className="label">Legajo</span>
                      <span className="value">{user.legajo ?? '-'}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="turno-alert">
                  {errorUsuario || 'No se pudo cargar la información del usuario.'}
                </div>
              )}
            </div>

          {/* 🔹 FORMULARIO DE SOLICITUD */}
          <form className="turno-form" onSubmit={enviarSolicitud}>
            {/* Área de Servicio */}
            <div className="form-field">
              <label>Área de Servicio</label>
              <select 
                value={area} 
                onChange={(e) => setArea(e.target.value)}
                required
              >
                <option value="">Seleccione un área</option>
                <option value="sala">Espacio de Estudio</option>
                <option value="notebooks">Laboratorio de Computadoras</option>
              </select>
            </div>

            {/* Temática - Solo se muestra si hay un área seleccionada y es "Espacio de Estudio" (sala) */}
            {area && area === 'sala' && (
              <div className="form-field">
                <label>Temática</label>
                <select 
                  value={tematica} 
                  onChange={(e) => setTematica(e.target.value)}
                  required
                >
                  <option value="">Seleccione una temática</option>
                  {tematicasSala.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Tipo de Asistencia */}
            <div className="form-field">
              <label>Tipo de Asistencia</label>
              <div className="tipo-asistencia-group">
                <label className="radio-option">
                  <input 
                    type="radio" 
                    name="tipoAsistencia" 
                    value="presencial" 
                    checked={tipoAsistencia === 'presencial'}
                    onChange={(e) => setTipoAsistencia(e.target.value)}
                  />
                  <span>Presencial</span>
                </label>
                <label className="radio-option">
                  <input 
                    type="radio" 
                    name="tipoAsistencia" 
                    value="virtual" 
                    checked={tipoAsistencia === 'virtual'}
                    onChange={(e) => setTipoAsistencia(e.target.value)}
                  />
                  <span>Virtual</span>
                </label>
              </div>
            </div>

            {/* Fecha */}
            <div className="form-field">
              <label>Fecha</label>
              <input 
                type="date" 
                value={fecha}
                min={fechaMinimaInput}
                max={fechaMaximaInput}
                onChange={(e) => {
                  const fechaSeleccionada = e.target.value;
                  if (esFechaValida(fechaSeleccionada) || fechaSeleccionada === '') {
                    setFecha(fechaSeleccionada);
                    setError('');
                  } else {
                    setError('La fecha debe estar entre el 10 de marzo y el 14 de noviembre');
                  }
                }}
                required
              />
              <small className="hint-text">
                Disponible del 10 de marzo al 14 de noviembre
              </small>
            </div>

            {/* Hora */}
            <div className="form-field">
              <label>Hora</label>
              <input 
                type="time" 
                min="10:00" 
                max="22:00"
                value={hora}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= '10:00' && value <= '22:00') {
                    setHora(value);
                    setError('');
                  } else {
                    setHora('');
                    setError('El horario debe estar entre las 10:00 y las 22:00');
                  }
                }}
                required
              />
            </div>

            {/* Observaciones */}
            <div className="form-field">
              <label>Observaciones</label>
              <textarea 
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder='En caso de elegir "Varios", indique los trámites a realizar'
                rows="3"
                className="observaciones-textarea"
              />
            </div>

            {/* Botones */}
            <div className="form-buttons">
              <button 
                className="turno-enviar" 
                type="submit" 
                disabled={enviando}
              >
                {enviando ? 'Enviando...' : 'Enviar solicitud'}
              </button>
              <button 
                className="turno-cancelar" 
                type="button"
                onClick={cancelarTurno}
              >
                Cancelar turno
              </button>
            </div>

            {mensaje && <div className="turno-success">{mensaje}</div>}
            {error && <div className="turno-error">{error}</div>}
          </form>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}