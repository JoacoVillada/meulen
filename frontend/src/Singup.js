import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./validations/SingupValidation";
import { useState } from "react";
import axios from "axios";

function Singup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
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
    if (err.name === "" && err.email === "" && err.password === "") {
      console.log("Enviando datos:", values);
      axios
        .post("http://localhost:3001/signup", values)
        .then((res) => {
          navigate("/");
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Sing Up</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Nombre</strong>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ingrese Su nombre"
              className="form-control rounded 0"
              onChange={handleInput}
            ></input>
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Ingrese Email"
              className="form-control rounded 0"
              onChange={handleInput}
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
              name="password"
              placeholder="Ingrese Contraseña"
              className="form-control rounded 0"
              onChange={handleInput}
            ></input>
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
            )}
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            <strong>Sign Up</strong>
          </button>
          <p>Nasheeeeeeeeee</p>
          <Link
            to="/"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          >
            Log In
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Singup;
