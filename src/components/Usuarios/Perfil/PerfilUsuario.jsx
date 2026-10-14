import React, { useEffect, useState } from 'react';
import Navbar from '../NavBar/Navbar';
import Footer from '../../Footer/Footer';
import { 
  FaLock, 
  FaKey, 
  FaTimes, 
  FaShieldAlt, 
  FaUser, 
  FaAddressCard, 
  FaCheckCircle, 
  FaExclamationCircle 
} from 'react-icons/fa';
import './PerfilUsuario.css';

export default function PerfilUsuario() {
  const [formData, setFormData] = useState({
    id_usuario: '',
    nombre_completo: '',
    tipo_usuario: '',
    email: '',
    telefono: '',
    domicilio: '',
    codigo_postal: '',
    ciudad: '',
    provincia: '',
    sexo: '',
    legajo: ''
  });

  // Estado para el modal de cambio de contraseña
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPass, setChangingPass] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  // Estados generales del perfil
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
        const resp = await fetch(`${apiUrl}/api/usuarios`);
        if (!resp.ok) throw new Error('No se pudo cargar la información del perfil');
        const lista = await resp.json();
        const actual = Array.isArray(lista)
          ? lista.find(u => String(u.id_usuario) === String(idUsuario))
          : null;

        if (!actual) throw new Error('Usuario no encontrado');

        setFormData({
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
        setError(e.message || 'Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    if (idUsuario) {
      fetchPerfil();
    } else {
      setError('No hay sesión activa. Inicia sesión para ver tu perfil.');
      setLoading(false);
    }
  }, [apiUrl, idUsuario]);

  // Solo se permite editar campos de contacto/domicilio
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Protección estricta: nunca permitir modificar campos personales
    if (['id_usuario', 'nombre_completo', 'tipo_usuario', 'legajo', 'sexo'].includes(name)) {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar solo datos de contacto y domicilio
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!idUsuario) throw new Error('No hay sesión activa');

      const payload = {
        email: formData.email,
        telefono: formData.telefono,
        domicilio: formData.domicilio,
        codigo_postal: formData.codigo_postal,
        ciudad: formData.ciudad,
        provincia: formData.provincia
      };

      const resp = await fetch(`${apiUrl}/api/usuarios/${idUsuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error('No se pudieron guardar los cambios');

      setSuccess('Datos de contacto actualizados correctamente');
      setTimeout(() => setSuccess(''), 4000);
    } catch (e) {
      setError(e.message || 'Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  // Cambio seguro de contraseña en modal
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!passForm.currentPassword) {
      setModalError('Debes ingresar tu contraseña actual');
      return;
    }
    if (!passForm.newPassword || passForm.newPassword.length < 6) {
      setModalError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      setModalError('Las contraseñas no coinciden');
      return;
    }

    setChangingPass(true);
    try {
      // 1. Validar contraseña actual con el endpoint de autenticación
      const verify = await fetch(`${apiUrl}/api/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: idUsuario, contrasena: passForm.currentPassword }),
      });

      if (!verify.ok) {
        throw new Error('La contraseña actual es incorrecta');
      }

      // 2. Si es válida, actualizar con la nueva contraseña
      const resp = await fetch(`${apiUrl}/api/usuarios/${idUsuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contrasena: passForm.newPassword }),
      });

      if (!resp.ok) {
        throw new Error('No se pudo actualizar la contraseña');
      }

      setModalSuccess('¡Contraseña actualizada con éxito!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

      setTimeout(() => {
        setShowPasswordModal(false);
        setModalSuccess('');
      }, 1500);
    } catch (e) {
      setModalError(e.message || 'Error al cambiar la contraseña');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <main>
      <Navbar />

      <section className="perfil-usuario-container">
        <div className="perfil-header-section">
          <h2 className="perfil-title">Mi Perfil</h2>
          <p className="perfil-subtitle">
            Consulta tus datos personales institucionales y mantén actualizados tus datos de contacto.
          </p>
        </div>

        {loading ? (
          <div className="perfil-loading">
            <div className="spinner" />
            <p>Cargando información del perfil...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="perfil-alert error">
                <FaExclamationCircle /> <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="perfil-alert success">
                <FaCheckCircle /> <span>{success}</span>
              </div>
            )}

            <form className="perfil-form" onSubmit={handleSubmit}>
              {/* SECCIÓN 1: DATOS PERSONALES E INSTITUCIONALES (NO MODIFICABLES) */}
              <div className="perfil-section-card non-editable-section">
                <div className="section-header">
                  <div className="section-title-wrap">
                    <FaAddressCard className="section-icon" />
                    <h3 className="section-title">Datos Personales y Académicos</h3>
                  </div>
                  <span className="badge-locked">
                    <FaLock /> Solo Lectura
                  </span>
                </div>
                <p className="section-description">
                  Estos datos personales están registrados formalmente y no pueden ser modificados por el usuario. 
                  En caso de requerir un cambio en el legajo, nombre o rol, comunícate con la administración de la biblioteca.
                </p>

                <div className="form-grid">
                  <div className="perfil-field field-locked">
                    <label htmlFor="id_usuario">
                      DNI (ID Usuario) <FaLock className="field-lock-icon" />
                    </label>
                    <input
                      id="id_usuario"
                      name="id_usuario"
                      type="text"
                      value={formData.id_usuario}
                      disabled
                      readOnly
                    />
                  </div>

                  <div className="perfil-field field-locked">
                    <label htmlFor="nombre_completo">
                      Nombre Completo <FaLock className="field-lock-icon" />
                    </label>
                    <input
                      id="nombre_completo"
                      name="nombre_completo"
                      type="text"
                      value={formData.nombre_completo}
                      disabled
                      readOnly
                    />
                  </div>

                  <div className="perfil-field field-locked">
                    <label htmlFor="tipo_usuario">
                      Tipo de Usuario <FaLock className="field-lock-icon" />
                    </label>
                    <input
                      id="tipo_usuario"
                      name="tipo_usuario"
                      type="text"
                      value={formData.tipo_usuario}
                      disabled
                      readOnly
                    />
                  </div>

                  {formData.legajo !== '' && formData.legajo !== null && (
                    <div className="perfil-field field-locked">
                      <label htmlFor="legajo">
                        Legajo Institucional <FaLock className="field-lock-icon" />
                      </label>
                      <input
                        id="legajo"
                        name="legajo"
                        type="text"
                        value={formData.legajo}
                        disabled
                        readOnly
                      />
                    </div>
                  )}

                  <div className="perfil-field field-locked">
                    <label htmlFor="sexo">
                      Sexo <FaLock className="field-lock-icon" />
                    </label>
                    <input
                      id="sexo"
                      name="sexo"
                      type="text"
                      value={formData.sexo || 'No especificado'}
                      disabled
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: DATOS DE CONTACTO Y DOMICILIO (MODIFICABLES) */}
              <div className="perfil-section-card editable-section">
                <div className="section-header">
                  <div className="section-title-wrap">
                    <FaUser className="section-icon" />
                    <h3 className="section-title">Datos de Contacto y Domicilio</h3>
                  </div>
                  <span className="badge-editable">Modificable</span>
                </div>
                <p className="section-description">
                  Mantén al día tu email y teléfono para recibir alertas de turnos confirmados y recordatorios de vencimiento de préstamos.
                </p>

                <div className="form-grid">
                  <div className="perfil-field">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>

                  <div className="perfil-field">
                    <label htmlFor="telefono">Teléfono / Celular</label>
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Ej: 3564123456"
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
                      placeholder="Calle y número"
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
                      placeholder="Ej: 2400"
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
                      placeholder="Ciudad"
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
                      placeholder="Provincia"
                    />
                  </div>
                </div>

                <div className="perfil-actions">
                  <button className="perfil-save-btn" type="submit" disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar Datos de Contacto'}
                  </button>
                </div>
              </div>
            </form>

            {/* SECCIÓN 3: SEGURIDAD / CAMBIAR CONTRASEÑA (OCULTA DETRÁS DE UN BOTÓN) */}
            <div className="perfil-security-card">
              <div className="security-left">
                <div className="security-icon-box">
                  <FaShieldAlt className="shield-icon" />
                </div>
                <div className="security-text-box">
                  <h3 className="security-card-title">Seguridad y Acceso</h3>
                  <p className="security-card-subtitle">
                    Modifica tu contraseña de acceso para mantener segura tu cuenta bibliotecaria.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-cambiar-password"
                onClick={() => {
                  setModalError('');
                  setModalSuccess('');
                  setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setShowPasswordModal(true);
                }}
              >
                <FaKey />
                <span>Cambiar Contraseña</span>
              </button>
            </div>
          </>
        )}

        {/* MODAL PARA CAMBIO DE CONTRASEÑA */}
        {showPasswordModal && (
          <div className="modal-overlay" onClick={() => !changingPass && setShowPasswordModal(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title-group">
                  <div className="modal-icon-badge">
                    <FaKey />
                  </div>
                  <div>
                    <h3 className="modal-title">Modificar Contraseña</h3>
                    <p className="modal-subtitle">Ingresa tu clave actual y define tu nueva contraseña</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={changingPass}
                  aria-label="Cerrar modal"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="modal-form">
                {modalError && (
                  <div className="modal-alert error">
                    <FaExclamationCircle /> <span>{modalError}</span>
                  </div>
                )}
                {modalSuccess && (
                  <div className="modal-alert success">
                    <FaCheckCircle /> <span>{modalSuccess}</span>
                  </div>
                )}

                <div className="modal-field">
                  <label htmlFor="modal_current_password">Contraseña actual</label>
                  <input
                    id="modal_current_password"
                    type="password"
                    value={passForm.currentPassword}
                    onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                    placeholder="Ingresa tu contraseña actual"
                    required
                    disabled={changingPass}
                  />
                </div>

                <div className="modal-field">
                  <label htmlFor="modal_new_password">Nueva contraseña</label>
                  <input
                    id="modal_new_password"
                    type="password"
                    value={passForm.newPassword}
                    onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    required
                    disabled={changingPass}
                  />
                </div>

                <div className="modal-field">
                  <label htmlFor="modal_confirm_password">Confirmar nueva contraseña</label>
                  <input
                    id="modal_confirm_password"
                    type="password"
                    value={passForm.confirmPassword}
                    onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                    placeholder="Repite la nueva contraseña"
                    required
                    disabled={changingPass}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setShowPasswordModal(false)}
                    disabled={changingPass}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="modal-submit-btn"
                    disabled={changingPass}
                  >
                    {changingPass ? 'Actualizando...' : 'Guardar Contraseña'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
