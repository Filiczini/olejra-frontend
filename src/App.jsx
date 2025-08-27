import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/pages/Login';
import Board from './components/pages/Board';


import './App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/board" element={<Board />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
