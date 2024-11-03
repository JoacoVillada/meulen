import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Asegúrate de instalar axios
import Cookies from "js-cookie";

function VerNuevoPedido() {
  const location = useLocation();
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const { productosPedido } = location.state || {
    productosPedido: {},
  };
  const userId = Cookies.get("userId");
  //console.log("A: ", id_cliente);
  console.log("B: ", userId);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const [cantidadPedido, setCantidadPedido] = useState(productosPedido);
  const [totalCosto, setTotalCosto] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3001")
      .then((res) => {
        if (res.data === "Success") {
          setAuth(true);
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch((err) => console.log(err));

    const total = Object.values(cantidadPedido).reduce(
      (sum, { precio_unidad, cantidad }) => sum + precio_unidad * cantidad,
      0
    );
    setTotalCosto(total);
  }, [cantidadPedido]);

  const handleAddUnidad = (id) => {
    setCantidadPedido((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        cantidad: (prev[id].cantidad || 0) + 1,
      },
    }));
  };

  const handleRemoveUnidad = (id) => {
    setCantidadPedido((prev) => {
      const updated = { ...prev };
      if (updated[id].cantidad > 1) {
        updated[id].cantidad -= 1;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const handleConfirmarPedido = async () => {
    try {
      // Solo enviar nombre, id, cantidad y precio unidad
      const lista_productos = Object.keys(cantidadPedido).map((id) => ({
        id,
        nombre: cantidadPedido[id].nombre,
        cantidad: cantidadPedido[id].cantidad,
        precio_unidad: cantidadPedido[id].precio_unidad,
      }));

      console.log("HOLA MAMA ESTOYEN LA TELE: ", userId);
      const response = await axios.post("http://localhost:3001/crearPedido", {
        lista_productos,
        id_cliente: userId, // Asegúrate de que el nombre coincida con el backend
        precio_total: totalCosto,
      });
      if (response.data.Success) {
        alert("Pedido confirmado con éxito.");
        navigate("/home");
      } else {
        alert("Error al confirmar el pedido.");
      }
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
      alert("Error al confirmar el pedido.");
    }
  };

  return (
    <div className="container mt-4">
      {auth ? (
        <>
          <h1 className="mb-4 text-center">Lista de Productos en el Pedido</h1>
          {Object.keys(cantidadPedido).length === 0 ? (
            <div className="alert alert-warning text-center">
              No hay productos en el pedido.
            </div>
          ) : (
            <ul className="list-group">
              {Object.keys(cantidadPedido).map((id) => {
                const { nombre, precio_unidad, cantidad } = cantidadPedido[id];
                return (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={id}
                  >
                    <div>
                      <h5>{nombre}</h5>
                      <p className="mb-0">Precio: ${precio_unidad}</p>
                    </div>
                    <span className="d-flex align-items-center">
                      <button
                        className="btn btn-secondary btn-sm me-2"
                        onClick={() => handleRemoveUnidad(id)}
                      >
                        -
                      </button>
                      <span className="badge bg-primary rounded-pill">
                        {cantidad}
                      </span>
                      <button
                        className="btn btn-secondary btn-sm ms-2"
                        onClick={() => handleAddUnidad(id)}
                      >
                        +
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mt-4 text-center">
            <h3>Total del Pedido: ${totalCosto.toFixed(2)}</h3>
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-success" onClick={handleConfirmarPedido}>
              Confirmar Pedido
            </button>
            <Link className="btn btn-danger ms-2" to="/home">
              Cancelar Pedido
            </Link>
            <Link
              className="btn btn-secondary ms-2"
              to="/nuevoPedido"
              state={{ productosPedido: cantidadPedido }}
            >
              Volver a Nuevo Pedido
            </Link>
          </div>
        </>
      ) : (
        <div>
          <h3>{message}</h3>
          <Link to="/" className="btn btn-primary">
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default VerNuevoPedido;
