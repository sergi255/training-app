import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Trainings from './pages/trainings/Trainings'
import UserTrainings from './pages/trainings/UserTrainings'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/trainings/all" element={<Trainings />} />
          <Route path="/trainings" element={<UserTrainings />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
