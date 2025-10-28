import React, { useEffect, useState } from 'react';
import Navbar from '../NavBar/Navbar';
import Footer from '../../Footer/Footer';
import './PerfilUsuario.css';

const categorias = [
  'Aspirante',
  'Cursante',
  'No cursante',
  'Docente',
  'No Docente',
  'Egresado',
  'Externo'
];

export default function PerfilUsuario() {
  const [formData, setFormData] = useState({
    id_usuario: '',
    nombre_completo: '',
    tipo_usuario: categorias[0],
    email: '',
    telefono: '',
    domicilio: '',
    codigo_postal: '',
    ciudad: '',
    provincia: '',
    sexo: '',
    legajo: ''
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const idUsuario = localStorage.getItem('id_usuario');

  useEffect(() => {
    const fetchPerfil = async () => {
      setLoading(true);
      setError('');
      try {
        // Cargar todos y filtrar por id (backend no expone GET /usuarios/:id)
        const resp = await fetch(`${apiUrl}/api/usuarios`);
        if (!resp.ok) throw new Error('No se pudo cargar el perfil');
        const lista = await resp.json();
        const actual = Array.isArray(lista)
          ? lista.find(u => String(u.id_usuario) === String(idUsuario))
          : null;
        if (!actual) throw new Error('Usuario no encontrado');
        setFormData({
          id_usuario: actual.id_usuario || '',
          nombre_completo: actual.nombre_completo || '',
          tipo_usuario: actual.tipo_usuario || categorias[0],
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
        setError(e.message || 'Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };
    if (idUsuario) fetchPerfil();
    else {
      setError('No hay sesión activa');
      setLoading(false);
    }
  }, [apiUrl, idUsuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tipo_usuario' && !['Cursante', 'Docente', 'No Docente'].includes(value)) {
      // Si cambia a un tipo que no requiere legajo, limpiar legajo
      setFormData((prev) => ({ ...prev, [name]: value, legajo: '' }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (!idUsuario) throw new Error('No hay sesión activa');

      // Si quiere cambiar la contraseña, verificar primero la actual
      if (newPassword) {
        const verify = await fetch(`${apiUrl}/api/usuarios/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_usuario: idUsuario, contrasena: currentPassword }),
        });
        if (!verify.ok) throw new Error('Contraseña actual incorrecta');
      }

      const payload = {
        nombre_completo: formData.nombre_completo,
        email: formData.email,
        telefono: formData.telefono,
        domicilio: formData.domicilio,
        codigo_postal: formData.codigo_postal,
        ciudad: formData.ciudad,
        provincia: formData.provincia,
        sexo: formData.sexo,
        legajo: ['Cursante', 'Docente', 'No Docente'].includes(formData.tipo_usuario)
          ? (formData.legajo === '' ? null : formData.legajo)
          : null,
        tipo_usuario: formData.tipo_usuario,
        ...(newPassword ? { contrasena: newPassword } : {}),
      };

      const resp = await fetch(`${apiUrl}/api/usuarios/${idUsuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error('No se pudo guardar el perfil');

      setSuccess('Datos guardados correctamente');
      setCurrentPassword('');
      setNewPassword('');

      // Actualizar nombre en localStorage si lo usas en saludo
      localStorage.setItem('nombre', formData.nombre_completo);
    } catch (e) {
      setError(e.message || 'Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main>
      <Navbar />
      <section className="perfil-usuario-container">
        <h2 className="perfil-title">Mi perfil</h2>

        {loading ? (
          <div className="perfil-loading">Cargando...</div>
        ) : (
          <form className="perfil-form" onSubmit={handleSubmit}>
            {error && <div className="perfil-alert error">{error}</div>}
            {success && <div className="perfil-alert success">{success}</div>}

            <div className="perfil-field">
              <label htmlFor="id_usuario">DNI (ID Usuario)</label>
              <input
                id="id_usuario"
                name="id_usuario"
                type="text"
                value={formData.id_usuario}
                disabled
              />
            </div>

            <div className="perfil-field">
              <label htmlFor="tipo_usuario">Tipo de Usuario</label>
              <select
                id="tipo_usuario"
                name="tipo_usuario"
                value={formData.tipo_usuario}
                onChange={handleChange}
              >
                {categorias.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="perfil-field">
              <label htmlFor="nombre_completo">Nombre completo</label>
              <input
                id="nombre_completo"
                name="nombre_completo"
                type="text"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="perfil-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="perfil-field">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                name="telefono"
                type="text"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="perfil-field">
              <label htmlFor="domicilio">Domicilio</label>
              <input
                id="domicilio"
                name="domicilio"
                type="text"
                value={formData.domicilio}
                onChange={handleChange}
              />
            </div>

            <div className="perfil-field">
              <label htmlFor="codigo_postal">Código Postal</label>
              <input
                id="codigo_postal"
                name="codigo_postal"
                type="text"
                value={formData.codigo_postal}
                onChange={handleChange}
              />
            </div>

            <div className="perfil-field">
              <label htmlFor="ciudad">Ciudad</label>
              <input
                id="ciudad"
                name="ciudad"
                type="text"
                value={formData.ciudad}
                onChange={handleChange}
              />
            </div>

            <div className="perfil-field">
              <label htmlFor="provincia">Provincia</label>
              <input
                id="provincia"
                name="provincia"
                type="text"
                value={formData.provincia}
                onChange={handleChange}
              />
            </div>

            <div className="perfil-field">
              <label htmlFor="sexo">Sexo</label>
              <select
                id="sexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
              >
                <option value="">Seleccionar...</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="No binario">No binario</option>
              </select>
            </div>

            {(['Cursante', 'Docente', 'No Docente'].includes(formData.tipo_usuario)) && (
              <div className="perfil-field">
                <label htmlFor="legajo">Legajo</label>
                <input
                  id="legajo"
                  name="legajo"
                  type="number"
                  value={formData.legajo}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="perfil-field">
              <label htmlFor="current_password">Contraseña actual</label>
              <input
                id="current_password"
                name="current_password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Requerida si vas a cambiar la contraseña"
              />
            </div>

            <div className="perfil-field">
              <label htmlFor="new_password">Nueva contraseña</label>
              <input
                id="new_password"
                name="new_password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Dejar en blanco para no cambiar"
              />
            </div>

            <div className="perfil-actions">
              <button className="perfil-save" type="submit" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        )}
      </section>
      <Footer />
    </main>
  );
}


