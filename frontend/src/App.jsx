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
import AddTraining from './pages/trainings/addTraining'
import UpdateTraining from './pages/trainings/updateTraining'
import AdminUsers from './pages/admin/users/Users'
import AdminExercises from './pages/admin/exercises/Exercises'
import AdminUpdateExercise from './pages/admin/exercises/updateExercise'
import AdminTrainings from './pages/admin/trainings/Trainings'
import AdminUpdateTraining from './pages/admin/trainings/updateTraining'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Auth routes */}
          <Route path="/">
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Admin routes */}
          <Route path="admin">
            <Route path="users" element={<AdminUsers />} />
            <Route path="exercises">
              <Route index element={<AdminExercises />} />
              <Route path="update/:id" element={<AdminUpdateExercise />} />
            </Route>
            <Route path="trainings">
              <Route index element={<AdminTrainings />} />
              <Route path="update/:id" element={<AdminUpdateTraining />} />
            </Route>
          </Route>

          {/* Exercise routes */}
          <Route path="exercises">
            <Route index element={<UserExercises />} />
            <Route path="all" element={<Exercises />} />
            <Route path="add" element={<AddExercise />} />
            <Route path="update/:id" element={<UpdateExercise />} />
          </Route>

          {/* Training routes */}
          <Route path="trainings">
            <Route index element={<UserTrainings />} />
            <Route path="all" element={<Trainings />} />
            <Route path="add" element={<AddTraining />} />
            <Route path="update/:id" element={<UpdateTraining />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App