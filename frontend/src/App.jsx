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
import UpdateExercise from './pages/exercises/updateExercise'
import AddTraining from './pages/trainings/AddTraining'
import UpdateTraining from './pages/trainings/updateTraining'
import AdminUsers from './pages/admin/users/Users'
import AdminExercises from './pages/admin/exercises/Exercises'
import AdminUpdateExercise from './pages/admin/exercises/updateExercise'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/exercises" element={<AdminExercises />} />
          <Route path="/admin/exercises/update/:id" element={<AdminUpdateExercise />} />
          <Route path="/register" element={<Register />} />
          <Route path="/trainings/all" element={<Trainings />} />
          <Route path="/trainings" element={<UserTrainings />} />
          <Route path="/exercises/all" element={<Exercises />} />
          <Route path="/exercises" element={<UserExercises />} />
          <Route path="/exercises/add" element={<AddExercise />} />
          <Route path="/exercises/update/:id" element={<UpdateExercise />} />
          <Route path="/trainings/add" element={<AddTraining />} />
          <Route path="/trainings/update/:id" element={<UpdateTraining />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
