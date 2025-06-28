import { useEffect, useState } from "react";

function App() {
  // Estados principales
  const [nombre, setNombre] = useState("");
  const [asignatura, setAsignatura] = useState("");
  const [promedio, setPromedio] = useState("");
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Cargar evaluaciones desde localStorage al iniciar
  useEffect(() => {
    const data = localStorage.getItem("evaluaciones");
    if (data) {
      setEvaluaciones(JSON.parse(data));
    }
  }, []);

  // Guardar evaluaciones en localStorage cuando cambian
  useEffect(() => {
    if (evaluaciones.length > 0) {
      localStorage.setItem("evaluaciones", JSON.stringify(evaluaciones));
    }
  }, [evaluaciones]);

  // Agregar o actualizar evaluación
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !asignatura || !promedio) return;

    const nuevaNota = parseFloat(promedio);

    // Buscar si ya existe una evaluación con el mismo nombre y asignatura
    const indexExistente = evaluaciones.findIndex(
      (ev) =>
        ev.nombre.trim().toLowerCase() === nombre.trim().toLowerCase() &&
        ev.asignatura.trim().toLowerCase() === asignatura.trim().toLowerCase()
    );

    if (indexExistente !== -1 && editIndex === null) {
      // Si existe, calcular el nuevo promedio
      const evalExistente = evaluaciones[indexExistente];
      const nuevoPromedio = ((evalExistente.promedio + nuevaNota) / 2).toFixed(2);

      const copia = [...evaluaciones];
      copia[indexExistente] = {
        ...evalExistente,
        promedio: parseFloat(nuevoPromedio),
      };
      setEvaluaciones(copia);
    } else if (editIndex !== null) {
      // Si está editando, actualizar normalmente
      const copia = [...evaluaciones];
      copia[editIndex] = {
        nombre,
        asignatura,
        promedio: nuevaNota,
      };
      setEvaluaciones(copia);
      setEditIndex(null);
    } else {
      // Si no existe, agregar normalmente
      setEvaluaciones([
        ...evaluaciones,
        {
          nombre,
          asignatura,
          promedio: nuevaNota,
        },
      ]);
    }

    setNombre("");
    setAsignatura("");
    setPromedio("");
  };

  // Eliminar evaluación
  const handleEliminar = (index) => {
    const copia = [...evaluaciones];
    copia.splice(index, 1);
    setEvaluaciones(copia);
  };

  // Cargar datos de evaluación al formulario para editar
  const handleEditar = (index) => {
    const evalSeleccionada = evaluaciones[index];
    setNombre(evalSeleccionada.nombre);
    setAsignatura(evalSeleccionada.asignatura);
    setPromedio(evalSeleccionada.promedio.toString());
    setEditIndex(index);
  };

  // Renderizado principal
  return (
    <div className="container-app">
      <h1 className="titulo">Evaluación de Alumnos</h1>

      {/* Formulario */}
      <section className="card">
        <h2 className="subtitulo">Agregar Nueva Evaluación</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Ej: Matemáticas"
            value={asignatura}
            onChange={(e) => setAsignatura(e.target.value)}
            className="input"
          />
          <input
            type="number"
            step="0.1"
            min="0"
            max="7"
            placeholder="Ej: 5.5"
            value={promedio}
            onChange={(e) => setPromedio(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn btn-primary">
            {editIndex !== null ? "Actualizar Evaluación" : "Agregar Evaluación"}
          </button>
        </form>
      </section>

      {/* Lista de Evaluaciones */}
      <section className="card">
        <h2 className="subtitulo">Evaluaciones Guardadas</h2>
        {evaluaciones.length === 0 ? (
          <p className="texto-secundario">No hay evaluaciones registradas.</p>
        ) : (
          evaluaciones.map((eval_, index) => {
            // Escala de apreciación según el promedio
            let apreciacion = "";
            if (eval_.promedio >= 1 && eval_.promedio <= 3.9) {
              apreciacion = "Deficiente";
            } else if (eval_.promedio >= 4.0 && eval_.promedio <= 5.5) {
              apreciacion = "Con mejora";
            } else if (eval_.promedio >= 5.6 && eval_.promedio <= 6.4) {
              apreciacion = "Buen trabajo";
            } else if (eval_.promedio >= 6.5 && eval_.promedio <= 7.0) {
              apreciacion = "Destacado";
            }

            return (
              <div key={index} className="evaluacion-item">
                <p className="dato"><strong>Alumno:</strong> {eval_.nombre}</p>
                <p className="dato"><strong>Asignatura:</strong> {eval_.asignatura}</p>
                <p className="dato">
                  <strong>Promedio:</strong> {eval_.promedio.toFixed(1)}
                </p>
                <span
                  className={`apreciacion etiqueta-${apreciacion.replace(/\s/g, '').toLowerCase()}`}
                  style={{
                    display: "inline-block",
                    marginLeft: "0",
                    marginTop: "0.4rem",
                    minWidth: "unset",
                    width: "auto",
                    maxWidth: "100%",
                    textAlign: "center"
                  }}
                >
                  {apreciacion}
                </span>
                <div className="acciones">
                  <button onClick={() => handleEditar(index)} className="btn btn-warning">
                    Editar
                  </button>
                  <button onClick={() => handleEliminar(index)} className="btn btn-danger">
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      <style>{`
        html, body, #root {
          height: 100%;
          min-height: 100%;
        }
        body {
          margin: 0;
          padding: 0;
          height: 100%;
        }
        .container-app {
          min-height: 100vh;
          min-width: 100vw;
          width: 100vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          background: #f9fafb;
          font-family: 'Segoe UI', Arial, sans-serif;
          box-sizing: border-box;
          overflow-y: auto;
        }
        .titulo {
          text-align: center;
          margin-bottom: 2rem;
          color: #1e293b;
          font-size: 2rem;
          font-weight: 600;
        }
        .subtitulo {
          color: #1e293b;
          font-size: 1.2rem;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        .card {
          background: #fff;
          border-radius: 10px;
          max-width: 480px;
          width: 100%;
          margin: 0 auto 2rem auto;
          box-shadow: 0 2px 8px rgba(30,41,59,0.07);
          padding: 1.5rem 1.2rem;
          box-sizing: border-box;
          overflow: hidden;
        }
        .input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.55rem 0.7rem;
          margin-bottom: 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 5px;
          font-size: 1rem;
          color: #1e293b;
          background: #f8fafc;
          transition: border 0.2s;
          display: block;
        }
        .input:focus {
          outline: none;
          border: 1.5px solid #2563eb;
        }
        .btn {
          padding: 0.5rem 1.2rem;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-right: 0.5rem;
          margin-bottom: 0.3rem;
          transition: background 0.2s, color 0.2s;
        }
        .btn-primary {
          background: #2563eb;
          color: #fff;
        }
        .btn-primary:hover {
          background: #1d4ed8;
        }
        .btn-warning {
          background: #fbbf24;
          color: #1e293b;
        }
        .btn-warning:hover {
          background: #f59e42;
        }
        .btn-danger {
          background: #ef4444;
          color: #fff;
        }
        .btn-danger:hover {
          background: #dc2626;
        }
        .evaluacion-item {
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }
        .evaluacion-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .acciones {
          margin-top: 0.7rem;
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .destacado {
          display: inline-block;
          background: #2563eb;
          color: #fff;
          padding: 0.2rem 0.7rem;
          border-radius: 5px;
          font-size: 0.85rem;
          margin-top: 0.3rem;
        }
        .texto-secundario {
          color: #64748b;
        }
        .dato {
          color: #1e293b;
          margin: 0.2rem 0;
          word-break: break-word;
        }
        .apreciacion {
          display: inline-block;
          margin-left: 0;
          margin-top: 0.4rem;
          padding: 0.15rem 0.7rem;
          border-radius: 5px;
          font-size: 0.85rem;
          font-style: normal;
          font-weight: 500;
          color: #fff;
          min-width: unset;
          width: auto;
          max-width: 100%;
          text-align: center;
        }
        .etiqueta-deficiente {
          background: #ef4444;
        }
        .etiqueta-conmejora {
          background: #fbbf24;
          color: #1e293b;
        }
        .etiqueta-buentrabajo {
          background: #2563eb;
        }
        .etiqueta-destacado {
          background: #059669;
        }
        @media (max-width: 600px) {
          .card {
            max-width: 98vw;
            padding: 1rem 0.5rem;
          }
          .titulo {
            font-size: 1.2rem;
          }
          .subtitulo {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
