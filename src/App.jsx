import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/pages/Login";
import Board from "./components/pages/Board";
import Demo from "./components/pages/Demo.jsx";

function Home() {
  return <h1>Home</h1>;
}

import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/board" element={<Board />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>
    </>
  );
}

export default App;
