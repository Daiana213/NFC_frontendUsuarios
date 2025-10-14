import { useState } from 'react';
import HeaderAuth from '../HeaderAuth/HeaderAuth';
import Footer from '../Footer/Footer';
import './Registro.css';

const categorias = [
	'Aspirante',
    'Cursante',
	'No cursante',
	'Docente',
	'No Docente',
	'Egresado',
	'Externo'
];

export default function Registro() {
	const [form, setForm] = useState({
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
		legajo: '',
		contrasena: ''
	});
	const [mensaje, setMensaje] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		
		if (name === 'tipo_usuario' && !['Cursante', 'Docente', 'No Docente'].includes(value)) {
			setForm({ ...form, [name]: value, legajo: '' });
		} else {
			setForm({ ...form, [name]: value });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMensaje('');
		setError('');
		setLoading(true);
		
		if (!form.id_usuario || !form.nombre_completo || !form.tipo_usuario) {
			setError('Los campos DNI, Nombre completo y Tipo de usuario son obligatorios');
			setLoading(false);
			return;
		}

		try {
			const res = await fetch('http://localhost:3000/api/usuarios', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form)
			});
			const data = await res.json();
			if (res.ok) {
				setMensaje('Usuario registrado correctamente');
				setForm({
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
					legajo: '',
					contrasena: ''
				});
			} else {
				setError(data.error || 'Error al registrar usuario');
			}
		} catch (err) {
			setError('Error de conexión con el servidor');
		} finally {
			setLoading(false);
		}
	};

		return (
			<>
				<HeaderAuth />
				<div className="registro-container">
					<h2 className="registro-title">Registro de Usuario</h2>
					<form onSubmit={handleSubmit} className="registro-form">
						<div className={`form-section ${(form.tipo_usuario === 'Cursante' || form.tipo_usuario === 'Docente' || form.tipo_usuario === 'No Docente') ? 'two-columns' : 'two-columns'}`}>
							<div className="form-group">
								<label className="form-label required">DNI (ID Usuario)</label>
								<input 
									className="form-input"
									name="id_usuario" 
									value={form.id_usuario} 
									onChange={handleChange} 
									placeholder="Ingresa tu DNI"
									required 
								/>
							</div>
							<div className="form-group">
								<label className="form-label required">Tipo de Usuario</label>
								<select 
									className="form-select"
									name="tipo_usuario" 
									value={form.tipo_usuario} 
									onChange={handleChange} 
									required
								>
									{categorias.map(cat => (
										<option key={cat} value={cat}>{cat}</option>
									))}
								</select>
							</div>
						</div>
						
						<div className="form-section single-column">
							<div className="form-group">
								<label className="form-label required">Nombre Completo</label>
								<input 
									className="form-input"
									name="nombre_completo" 
									value={form.nombre_completo} 
									onChange={handleChange} 
									placeholder="Nombre y apellido completo"
									required 
								/>
							</div>
						</div>

						<div className="form-section two-columns">
							<div className="form-group">
								<label className="form-label">Email</label>
								<input 
									className="form-input"
									name="email" 
									type="email" 
									value={form.email} 
									onChange={handleChange} 
									placeholder="correo@ejemplo.com"
								/>
							</div>
							<div className="form-group">
								<label className="form-label">Teléfono</label>
								<input 
									className="form-input"
									name="telefono" 
									value={form.telefono} 
									onChange={handleChange} 
									placeholder="Número de teléfono"
								/>
							</div>
						</div>

						<div className="form-section single-column">
							<div className="form-group">
								<label className="form-label">Domicilio</label>
								<input 
									className="form-input"
									name="domicilio" 
									value={form.domicilio} 
									onChange={handleChange} 
									placeholder="Dirección completa"
								/>
							</div>
						</div>

						<div className="form-section three-columns">
							<div className="form-group">
								<label className="form-label">Código Postal</label>
								<input 
									className="form-input"
									name="codigo_postal" 
									value={form.codigo_postal} 
									onChange={handleChange} 
									placeholder="CP"
								/>
							</div>
							<div className="form-group">
								<label className="form-label">Ciudad</label>
								<input 
									className="form-input"
									name="ciudad" 
									value={form.ciudad} 
									onChange={handleChange} 
									placeholder="Ciudad"
								/>
							</div>
							<div className="form-group">
								<label className="form-label">Provincia</label>
								<input 
									className="form-input"
									name="provincia" 
									value={form.provincia} 
									onChange={handleChange} 
									placeholder="Provincia"
								/>
							</div>
						</div>

						<div className={`form-section ${(form.tipo_usuario === 'Cursante' || form.tipo_usuario === 'Docente' || form.tipo_usuario === 'No Docente') ? 'two-columns' : 'single-column'}`}>
							<div className="form-group">
								<label className="form-label">Sexo</label>
								<select 
									className="form-select"
									name="sexo" 
									value={form.sexo} 
									onChange={handleChange}
								>
									<option value="">Seleccionar...</option>
									<option value="M">Masculino</option>
									<option value="F">Femenino</option>
									<option value="O">Otro</option>
								</select>
							</div>
							{(form.tipo_usuario === 'Cursante' || form.tipo_usuario === 'Docente' || form.tipo_usuario === 'No Docente') && (
								<div className="form-group">
									<label className="form-label">Legajo</label>
									<input 
										className="form-input"
										name="legajo" 
										value={form.legajo} 
										onChange={handleChange} 
										placeholder="Número de legajo"
									/>
								</div>
							)}
						</div>

						<div className="form-section single-column">
							<div className="form-group">
								<label className="form-label">Contraseña</label>
								<input 
									className="form-input"
									name="contrasena" 
									type="password" 
									value={form.contrasena} 
									onChange={handleChange} 
									placeholder="Contraseña opcional"
								/>
							</div>
						</div>

						<button type="submit" disabled={loading} className="registro-button">
							{loading ? 'Registrando...' : 'Registrar Usuario'}
						</button>
					</form>
					{mensaje && <div className="success-message">{mensaje}</div>}
					{error && <div className="error-message">{error}</div>}
				</div>
				<Footer />
			</>
		);
}
