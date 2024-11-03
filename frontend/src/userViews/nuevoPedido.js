import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

function NuevoPedido() {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [productosPedido, setProductosPedido] = useState({});
  const [auth, setAuth] = useState(false); // Estado para la autenticación
  const [message, setMessage] = useState(""); // Mensaje de error
  const userId = Cookies.get("userId");
  const navigate = useNavigate();

  const location = useLocation();

  console.log("A: ", userId);

  useEffect(() => {
    // Verificar autenticación
    axios
      .get("http://localhost:3001")
      .then((res) => {
        if (res.data === "Success") {
          setAuth(true);
        } else {
          setAuth(false);
          setMessage(res.data.Error || "No autorizado");
        }
      })
      .catch((error) => {
        console.error("Error en la verificación de autenticación:", error);
        setAuth(false);
        setMessage("Error en la verificación de autenticación");
      });

    // Obtener los productos desde el servidor
    axios
      .get("http://localhost:3001/productos")
      .then((response) => {
        setProductos(response.data);
        setFilteredProductos(response.data);
      })
      .catch((error) =>
        console.error("Error al obtener los productos:", error)
      );
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(value)
    );
    setFilteredProductos(filtered);
  };

  const handleAddToPedido = (producto) => {
    setProductosPedido((prev) => ({
      ...prev,
      [producto.id]: (prev[producto.id] || 0) + 1,
    }));
  };

  const handleRemoveFromPedido = (producto) => {
    setProductosPedido((prev) => {
      const updated = { ...prev };
      if (updated[producto.id] > 0) {
        updated[producto.id] -= 1;
      }
      if (updated[producto.id] === 0) {
        delete updated[producto.id];
      }
      return updated;
    });
  };

  const handleVerNuevoPedido = () => {
    const productosConDetalles = Object.keys(productosPedido).map((id) => {
      const producto = productos.find((p) => p.id === parseInt(id));
      return {
        ...producto,
        cantidad: productosPedido[id],
      };
    });
    navigate("/verNuevoPedido", {
      state: { productosPedido: productosConDetalles },
    });
  };

  return (
    <div className="container mt-4">
      {auth ? (
        <>
          <h1 className="mb-4">Nuevo Pedido</h1>
          <div className="float-right">
            <button
              className="btn btn-success ms-1 mt-4"
              onClick={handleVerNuevoPedido}
              disabled={Object.keys(productosPedido).length === 0}
            >
              Ver Pedido
            </button>
            <Link className="btn btn-danger ms-2 mt-4" to="/home">
              Cancelar Pedido
            </Link>
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={handleSearch}
              className="form-control mt-4"
            />
          </div>
          <div className="row">
            {filteredProductos.map((producto) => (
              <div className="col-12 col-md-6 col-lg-4 mb-3" key={producto.id}>
                <div className="card">
                  <img
                    src={
                      producto.imagen
                        ? producto.imagen
                        : "ruta/a/imagen/no_disponible.jpg"
                    }
                    alt={producto.nombre}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  {!producto.imagen && (
                    <p className="text-danger">Imagen no disponible</p>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text">Marca: {producto.marca}</p>
                    <p className="card-text">
                      Precio: ${producto.precio_unidad}
                    </p>
                    <p className="card-text">
                      Stock: {producto.stock ? "Disponible" : "No Disponible"}
                    </p>
                    <p className="card-text">Rubro: {producto.rubro}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddToPedido(producto)}
                    >
                      Añadir al Pedido
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h3 className="mt-4">Productos en el Pedido</h3>
          <ul className="list-group">
            {Object.keys(productosPedido).map((id) => {
              const producto = productos.find((p) => p.id === parseInt(id));
              return (
                <li
                  className="list-group-item d-flex justify-content-between align-items-center"
                  key={id}
                >
                  {producto.nombre} - ${producto.precio_unidad}
                  <span className="d-flex align-items-center">
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleRemoveFromPedido(producto)}
                    >
                      -
                    </button>
                    {productosPedido[id]}
                    <button
                      className="btn btn-secondary btn-sm ms-2"
                      onClick={() => handleAddToPedido(producto)}
                    >
                      +
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
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

export default NuevoPedido;
