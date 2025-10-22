import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/pages/LoginPage.jsx";
import Board from "./components/pages/BoardPage.jsx";

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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
