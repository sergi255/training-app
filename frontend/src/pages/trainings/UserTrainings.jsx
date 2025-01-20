import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Container, Typography, Paper, Table, TableBody, TableCell, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
         TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Trainings = () => {
  const [trainings, setTrainings] = useState([])
  const [exercises, setExercises] = useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTraining, setSelectedTraining] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { logout } = useAuth()

  const fetchTrainingsFromAPI = async () => {
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

  const deleteTrainingFromAPI = async (trainingId) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:8080/api/trainings/${trainingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || `Failed to delete training (${response.status})`)
    }
  }

  const loadTrainings = async () => {
    try {
      const data = await fetchTrainingsFromAPI()
      setTrainings(data)
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

  const handleDeleteClick = (training) => {
    setSelectedTraining(training)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedTraining) return

    try {
      await deleteTrainingFromAPI(selectedTraining.id)
      setTrainings(prevTrainings => 
        prevTrainings.filter(t => t.id !== selectedTraining.id)
      )
      setDeleteError(null)
    } catch (error) {
      setDeleteError(error.message)
    } finally {
      setDeleteDialogOpen(false)
      setSelectedTraining(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setSelectedTraining(null)
    setDeleteError(null)
  }

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
        <Alert 
          severity="error" 
          sx={{ mt: 4 }}
          action={
            error.includes('Unauthorized') ? (
              <Button color="inherit" size="small" onClick={loadTrainings}>
                Refresh
              </Button>
            ) : null
          }
        >
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Trainings
      </Typography>
      {trainings.length === 0 && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          No trainings found. Create your first training!
        </Typography>
      )}
      {deleteError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {deleteError}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Exercises (Sets x Reps)</TableCell>
              <TableCell>Actions</TableCell>
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
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate(`/trainings/update/${training.id}`)}
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error"
                    onClick={() => handleDeleteClick(training)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Delete Training</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this training?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} variant="contained">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color='error' >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Trainings