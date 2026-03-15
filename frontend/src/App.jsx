import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import Home from './pages/HomePg'
import Loginpg from './pages/Loginpg'
import Nav from './components/Nav'
import NewRoom from './pages/NewRoom'
export default function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Loginpg />} />
        <Route path="/new-room" element={<NewRoom />} />
      </Routes>
    </Router>
  )
}