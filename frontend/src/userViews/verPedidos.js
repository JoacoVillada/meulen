import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

function VerPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [message, setMessage] = useState("");
  const userId = Cookies.get("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/verPedidos/${userId}`
        );
        setPedidos(response.data);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        setMessage("No se pudieron obtener los pedidos.");
      }
    };

    if (userId) {
      fetchPedidos();
    } else {
      setMessage("Por favor, inicia sesión para ver tus pedidos.");
    }
  }, [userId]);

  const handleVerDetalles = (pedidoId) => {
    //
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5" style={{ color: "#4a4a4a" }}>
        Mis Pedidos
      </h1>
      {message && <p className="text-danger text-center">{message}</p>}

      {pedidos.length > 0 ? (
        <div className="row justify-content-center">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="col-md-6 mb-4">
              <div
                className="card shadow-sm border-light"
                style={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
              >
                <div className="card-body">
                  <h5 className="card-title">Pedido #{pedido.id}</h5>
                  <p className="card-text">
                    <strong>Fecha:</strong>{" "}
                    {new Date(pedido.fecha).toLocaleDateString()}
                  </p>
                  <p className="card-text">
                    <strong>Total:</strong> ${pedido.precio_total.toFixed(2)}
                  </p>
                  <button
                    className="btn btn-outline-info btn-sm mt-2"
                    onClick={() => handleVerDetalles(pedido.id)}
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-4">No tienes pedidos realizados.</p>
      )}

      <div className="text-center mt-5">
        <Link to="/home" className="btn btn-outline-primary px-4 py-2">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

export default VerPedidos;
