import React from "react";
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { WrapperComponentContext } from "./context/userContext";
import { SocketProvider } from './context/socketContext';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <WrapperComponentContext>
                <SocketProvider>
                  <Home />
                </SocketProvider>
              </WrapperComponentContext>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
