import { useState, useEffect } from 'react';

function App() {
  const [mensaje, setMensaje] = useState('');

  // Leer desde localStorage al iniciar
  useEffect(() => {
    const guardado = localStorage.getItem('miMensaje');
    if (guardado) {
      setMensaje(guardado);
    }
  }, []);

  // Guardar en localStorage cuando cambia el mensaje
  const guardarEnLocalStorage = (nuevoMensaje) => {
    setMensaje(nuevoMensaje);
    localStorage.setItem('miMensaje', nuevoMensaje);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Ejemplo LocalStorage</h2>
      <input
        type="text"
        value={mensaje}
        onChange={(e) => guardarEnLocalStorage(e.target.value)}
        placeholder="Escribe algo..."
      />
      <p>Mensaje guardado: <strong>{mensaje}</strong></p>
    </div>
  );
}

export default App;
