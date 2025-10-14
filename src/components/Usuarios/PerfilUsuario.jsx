import React from 'react';
import HeaderAuth from '../HeaderAuth/HeaderAuth';
import Footer from '../Footer/Footer';

export default function PerfilUsuario() {
  return (
    <>
      <HeaderAuth />
      <main className="perfil-usuario-container">
        <h2>Perfil de Usuario</h2>
        <p>Aquí podrás ver y editar tu información personal.</p>
      </main>
      <Footer />
    </>
  );
}
