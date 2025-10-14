export default function PrestamosUsuario({prestamos}) {
  return (
    <section style={{margin:'2rem 0'}}>
      <h3>Préstamos activos</h3>
      <table style={{width:'100%',borderCollapse:'collapse',marginTop:8}}>
        <thead>
          <tr style={{background:'#f0f0f0'}}>
            <th>Título</th>
            <th>Fecha de retiro</th>
            <th>Fecha de devolución</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {prestamos && prestamos.length ? prestamos.map((p,i) => (
            <tr key={i}>
              <td>{p.titulo}</td>
              <td>{p.retiro}</td>
              <td>{p.devolucion}</td>
              <td>{p.estado}</td>
            </tr>
          )) : (
            <tr><td colSpan={4} style={{textAlign:'center',color:'#888'}}>Sin préstamos</td></tr>
          )}
        </tbody>
      </table>
      <div style={{color:'#888',fontSize:13,marginTop:8}}>
        (En desarrollo)
      </div>
    </section>
  );
}
