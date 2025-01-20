import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material'

const Trainings = () => {
  const [trainings, setTrainings] = useState([])
  const [exercises, setExercises] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { logout } = useAuth()

  const fetchTrainingsFromAPI = async () => {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:8080/api/trainings/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      if (response.status === 401) {
        logout()
        return null
      }
      throw new Error('Failed to fetch trainings')
    }
    return await response.json()
  }

  const fetchExercisesFromAPI = async () => {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:8080/api/exercises/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch exercises')
    }
    return await response.json()
  }

  const loadTrainings = async () => {
    try {
      const data = await fetchTrainingsFromAPI()
      if (data) {
        setTrainings(data)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const loadExercises = async () => {
    try {
      const exerciseData = await fetchExercisesFromAPI()
      const exercisesMap = exerciseData.reduce((acc, exercise) => {
        acc[exercise.id] = exercise
        return acc
      }, {})
      setExercises(exercisesMap)
    } catch (error) {
      console.error('Failed to fetch exercises:', error)
    }
  }

  useEffect(() => {
    loadTrainings()
    loadExercises()
  }, [])
  
  const renderExercises = (trainingExercises) => {
    return trainingExercises.map(ex => {
      const exercise = exercises[ex.exerciseId]
      return exercise ? `${exercise.name} (${ex.sets}x${ex.reps})` : `Unknown Exercise (${ex.sets}x${ex.reps})`
    }).join(', ')
  }

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    )
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Trainings
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Exercises (Sets x Reps)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainings.map((training) => (
              <TableRow key={training.id}>
                <TableCell>{training.name}</TableCell>
                <TableCell>
                  {training.date ? new Date(training.date).toLocaleDateString() : 'Not scheduled'}
                </TableCell>
                <TableCell>
                  {training.exercises.length > 0 ? renderExercises(training.exercises) : 'No exercises'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default Trainings