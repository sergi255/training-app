import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material'

const Trainings = () => {
  const [trainings, setTrainings] = useState([])
  const [exercises, setExercises] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { logout, username } = useAuth()

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:8080/api/trainings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            logout()
            return
          }
          throw new Error('Failed to fetch trainings')
        }

        const data = await response.json()
        setTrainings(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrainings()
  }, [logout])

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:8080/api/exercises/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const exerciseData = await response.json()
          // Convert array to object with id as key for easier lookup
          const exercisesMap = exerciseData.reduce((acc, exercise) => {
            acc[exercise.id] = exercise
            return acc
          }, {})
          setExercises(exercisesMap)
        }
      } catch (error) {
        console.error('Failed to fetch exercises:', error)
      }
    }

    fetchExercises()
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
        {username}&apos;s Trainings
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
