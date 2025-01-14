import React from "react";
import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Singup from "./Singup";
import Home from "./Home";
import NuevoPedido from "./userViews/nuevoPedido";
import VerNuevoPedido from "./userViews/verNuevoPedido";
import VerPedidos from "./userViews/verPedidos";
import EditarUsuario from "./userViews/editarUsuario";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/singup" element={<Singup />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/nuevoPedido" element={<NuevoPedido />}></Route>
          <Route path="/verNuevoPedido" element={<VerNuevoPedido />}></Route>
          <Route path="/verPedidos" element={<VerPedidos />}></Route>
          <Route path="/editarUsuario/:id" element={<EditarUsuario />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
