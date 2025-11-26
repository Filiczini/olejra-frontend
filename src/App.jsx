import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage.jsx";
import Board from "./pages/BoardPage/BoardPage.jsx";
import AuthGate from "./components/auth/AuthGate.jsx";
import TaskDetailsPage from "./pages/TaskDetailsPage.jsx";
import { Header } from "./components/Header/Header.jsx";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/board"
        element={
          <AuthGate>
            <Board />
          </AuthGate>
        }
      />
      <Route
        path="/tasks/:id"
        element={
          <AuthGate>
            <TaskDetailsPage />
          </AuthGate>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
