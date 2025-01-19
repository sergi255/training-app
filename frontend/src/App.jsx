import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Trainings from './pages/trainings/Trainings'
import UserTrainings from './pages/trainings/UserTrainings'
import Exercises from './pages/exercises/Exercises'
import UserExercises from './pages/exercises/UserExercises'
import AddExercise from './pages/exercises/addExercise'
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
          <Route path="/exercises/all" element={<Exercises />} />
          <Route path="/exercises" element={<UserExercises />} />
          <Route path="/exercises/add" element={<AddExercise />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
