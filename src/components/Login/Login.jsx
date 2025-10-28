import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAuth from '../HeaderAuth/HeaderAuth';
import Footer from '../Footer/Footer';
import './Login.css';

export default function Login() {
  const [id_usuario, setId_usuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    
    try {
      const res = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, contrasena })
      });
            
      if (res.ok) {
        const responseData = await res.json();
        console.log(responseData);
        // Tu backend devuelve { message, data: usuario }
        const usuario = responseData;
        
        if (usuario && usuario.nombre_completo) {
          localStorage.setItem("nombre", usuario.nombre_completo);
          navigate("/inicio");
        } else {
          setError('Credenciales inválidas');
          setLoading(false);
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || 'Credenciales inválidas');
        setLoading(false);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('La solicitud tardó demasiado. Verifica que el backend esté corriendo en localhost:3000');
      } else {
        console.error('Error en login:', err);
        setError('Error de conexión con el servidor');
      }
      setLoading(false);
    }
  };

  return (
    <main>
      <HeaderAuth />
      <div className="login-container">
        <h2 className="login-title">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">DNI:</label>
            <input 
              className="form-input"
              value={id_usuario} 
              onChange={e => setId_usuario(e.target.value)} 
              placeholder="Ingresa tu DNI"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña:</label>
            <input 
              className="form-input"
              type="password"
              value={contrasena} 
              onChange={e => setContrasena(e.target.value)} 
              placeholder="Ingresa tu contraseña"
              required 
            />
          </div>
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Buscando...' : 'Ingresar'}
          </button>
        </form>
        {error && <p className="login-error">{error}</p>}
      </div>
      <Footer />
    </main>
  );
}  

