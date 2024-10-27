import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import Singup from "./Singup";
import { useState } from "react";
import Validation from "./validations/LoginValidation";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: [event.target.value],
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);
    if (err.email === "" && err.password === "") {
      console.log("Enviando datos:", values);
      axios
        .post("http://localhost:3001/login", values)
        .then((res) => {
          if (res.data === "Success") {
            navigate("/home");
          } else {
            alert("No recod existed");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Ingrese Email"
              name="email"
              onChange={handleInput}
              className="form-control rounded 0"
            ></input>
            {errors.email && (
              <span className="text-danger">{errors.email}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Contraseña</strong>
            </label>
            <input
              type="password"
              placeholder="Ingrese Contraseña"
              name="password"
              onChange={handleInput}
              className="form-control rounded 0"
            ></input>
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
            )}
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            <strong>Log in</strong>
          </button>
          <p>Nasheeeeeeeeee</p>
          <Link
            to="./Singup"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          >
            Crear Cuenta
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
