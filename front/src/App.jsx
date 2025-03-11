import './App.css'
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import RequestPasswordReset from "./components/RequestPasswordReset";
import ResetPassword from "./components/ResetPassword";
import Home from './components/Home';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/forgot-password" element={<RequestPasswordReset />} />
      <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
      <Route path='/' element={<Home/>}/>
    </Routes>
  </Router>
);
};

export default App;