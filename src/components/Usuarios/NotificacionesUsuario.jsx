import React from 'react';
import HeaderAuth from '../HeaderAuth/HeaderAuth';
import Footer from '../Footer/Footer';

export default function NotificacionesUsuario() {
  return (
    <>
      <HeaderAuth />
      <main className="notificaciones-usuario-container">
        <h2>Notificaciones</h2>
        <p>Aquí verás tus notificaciones importantes y recordatorios.</p>
      </main>
      <Footer />
    </>
  );
}
