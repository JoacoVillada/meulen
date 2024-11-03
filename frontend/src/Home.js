import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function Home() {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  // const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const userId = Cookies.get("userId");

  useEffect(() => {
    axios
      .get("http://localhost:3001")
      .then((res) => {
        if (res.data === "Success") {
          setAuth(true);
          setName(res.data.name);
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  });

  const handleDelete = () => {
    axios
      .get("http://localhost:3001/logout")
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-4">
      {auth ? (
        <div
          className="container-fluid vh-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#f0f8ff" }}
        >
          <div
            className="container text-center p-5 rounded"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <img
              src=""
              alt="Logo de Meulen"
              className="mb-4"
              style={{ width: "120px", height: "120px" }}
            />
            <h3 className="mb-5">Bienvenido a Meulen --- {name}</h3>
            <div className="row justify-content-center mt-5">
              <div className="col-12 col-md-6 col-lg-4 mb-3">
                <Link
                  className="btn btn-primary btn-lg w-100"
                  to="/nuevoPedido"
                >
                  Nuevo Pedido
                </Link>
              </div>
              <div className="col-12 col-md-6 col-lg-4 mb-3">
                <Link
                  className="btn btn-secondary btn-lg w-100"
                  to="/verPedidos"
                >
                  Mostrar Pedidos
                </Link>
              </div>
              <div className="col-12 col-md-6 col-lg-4 mb-3">
                <Link
                  className="btn btn-info btn-lg w-100"
                  to={`/editarUsuario/${userId}`}
                >
                  Editar Cuenta
                </Link>
              </div>
              <div className="col-12 col-md-6 col-lg-4 mb-3">
                <button
                  className="btn btn-danger btn-lg w-100"
                  onClick={handleDelete}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
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

export default Home;
