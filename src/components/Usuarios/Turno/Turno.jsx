import { useEffect, useState } from 'react';
import Navbar from '../NavBar/Navbar';
import Footer from '../../Footer/Footer';
import './Turno.css';

export default function Turno() {
  const [user, setUser] = useState(null);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const idUsuario = localStorage.getItem('id_usuario');

  // 🔹 Cargar datos del usuario
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const resp = await fetch(`${apiUrl}/api/usuarios`);
        const lista = await resp.json();
        const actual = Array.isArray(lista)
          ? lista.find((u) => String(u.id_usuario) === String(idUsuario))
          : null;
        setUser(actual || null);
      } catch (e) {
        setUser(null);
      }
    };
    if (idUsuario) cargarUsuario();
  }, [apiUrl, idUsuario]);

  // 🔹 Función de envío del formulario
  const enviarSolicitud = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    // Validación de campos
    if (!fecha || !hora) {
      setError('Selecciona una fecha y hora');
      return;
    }

    // Validar que no sea una fecha pasada
    const hoy = new Date().toISOString().split('T')[0];
    if (fecha < hoy) {
      setError('No puedes seleccionar una fecha pasada');
      return;
    }

    // Validación de rango horario (10:00 a 22:00)
    const [hStr, mStr] = hora.split(':');
    const totalMin = Number(hStr) * 60 + Number(mStr || 0);
    const minAllowed = 10 * 60; // 10:00
    const maxAllowed = 22 * 60; // 22:00
    if (totalMin < minAllowed || totalMin > maxAllowed) {
      setError('El horario debe estar entre 10:00 y 22:00');
      return;
    }

    try {
      setEnviando(true);
      const payload = { id_usuario: idUsuario, fecha, hora };

      const resp = await fetch(`${apiUrl}/api/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error();

      setMensaje('Solicitud enviada correctamente');
      setFecha('');
      setHora('');
    } catch (e) {
      setError(' No se pudo enviar la solicitud');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main>
      <Navbar />
      <section className="turno-container">
        <h2 className="turno-title">Solicitud de Turno</h2>

        <div className="turno-content">
          {/* 🔹 DATOS DEL USUARIO */}
          <div className="turno-datos">
            <h3>Datos del usuario</h3>
            {user ? (
              <div className="datos-grid">
                <div className="dato"><span className="label">DNI</span><span className="value">{user.id_usuario}</span></div>
                <div className="dato"><span className="label">Nombre completo</span><span className="value">{user.nombre_completo}</span></div>
                <div className="dato"><span className="label">Tipo de usuario</span><span className="value">{user.tipo_usuario}</span></div>
                <div className="dato"><span className="label">Email</span><span className="value">{user.email || '-'}</span></div>
                <div className="dato"><span className="label">Teléfono</span><span className="value">{user.telefono || '-'}</span></div>
                <div className="dato"><span className="label">Domicilio</span><span className="value">{user.domicilio || '-'}</span></div>
                <div className="dato"><span className="label">Código Postal</span><span className="value">{user.codigo_postal || '-'}</span></div>
                <div className="dato"><span className="label">Ciudad</span><span className="value">{user.ciudad || '-'}</span></div>
                <div className="dato"><span className="label">Provincia</span><span className="value">{user.provincia || '-'}</span></div>
                <div className="dato"><span className="label">Sexo</span><span className="value">{user.sexo || '-'}</span></div>
                {['Cursante', 'Docente', 'No Docente'].includes(user.tipo_usuario) && (
                  <div className="dato"><span className="label">Legajo</span><span className="value">{user.legajo ?? '-'}</span></div>
                )}
              </div>
            ) : (
              <div className="turno-alert">No se pudo cargar la información del usuario.</div>
            )}
          </div>

          {/* FORMULARIO DE SOLICITUD */}
          <form className="turno-form" onSubmit={enviarSolicitud}>
            <div className="form-field">
              <label>Fecha</label>
              <input
                type="date"
                value={fecha}
                min={new Date().toISOString().split('T')[0]} // bloquea fechas pasadas
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>

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

            <button className="turno-enviar" type="submit" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar solicitud'}
            </button>

            {mensaje && <div className="turno-success">{mensaje}</div>}
            {error && <div className="turno-error">{error}</div>}
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
