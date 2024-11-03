import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function EditarUsuario() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/editarUsuario/" + id)
      .then((res) => {
        setName(res.data.result[0].nombre);
        setEmail(res.data.result[0].email);
        console.log(res);
        console.log("Nombre: ", name, "   AASDSA: ", email);
      })
      .catch((err) => console.log(err));
  }, []);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3001/update/" + id, { email, name })
      .then((res) => {
        if (res.data.updated) {
          navigate("/");
        } else {
          alert("Not updated");
        }
      })
      .catch((err) => console.log("Error en la actualización:", err));
  };

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <form onSubmit={handleSubmit}>
          <h2>Editar Usuario</h2>
          <div className="mb-2">
            <label htmlFor="">Nombre</label>
            <input
              type="text"
              placeholder="Enter Name"
              className="fomr-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="">Email</label>
            <input
              type="text"
              placeholder="Enter Mail"
              className="fomr-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="btn btn-success">Update</button>
        </form>
      </div>
    </div>
  );
}

export default EditarUsuario;
