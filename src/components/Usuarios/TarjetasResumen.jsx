export default function TarjetasResumen({resumen}) {
  // resumen: {ultimoAcceso, libros, salas, tiempo}
  return (
    <div style={{display:'flex',gap:16,margin:'2rem 0'}}>
      <div style={cardStyle}>
        <span role="img" aria-label="reloj">🕒</span>
        <div><b>Último acceso</b></div>
        <div>{resumen.ultimoAcceso || '-'}</div>
      </div>
      <div style={cardStyle}>
        <span role="img" aria-label="libros">📚</span>
        <div><b>Libros en préstamo</b></div>
        <div>{resumen.libros ?? '-'}</div>
      </div>
      <div style={cardStyle}>
        <span role="img" aria-label="salas">🏫</span>
        <div><b>Uso de salas</b></div>
        <div>{resumen.salas ?? '-'}</div>
      </div>
      <div style={cardStyle}>
        <span role="img" aria-label="tiempo">⏱️</span>
        <div><b>Tiempo total</b></div>
        <div>{resumen.tiempo ?? '-'}</div>
      </div>
    </div>
  );
}

const cardStyle = {
  flex:1,
  background:'#f8f8f8',
  borderRadius:8,
  padding:'1rem',
  textAlign:'center',
  minWidth:120
};
