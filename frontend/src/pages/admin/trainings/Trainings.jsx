import { useState, useEffect } from 'react'
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, CircularProgress, Alert, Button,
         Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Trainings = () => {
  const [trainings, setTrainings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [selectedTraining, setSelectedTraining] = useState(null)
  const [exercises, setExercises] = useState({})
  const navigate = useNavigate()
  const isAdmin = localStorage.getItem('role') === 'ROLE_ADMIN'

  const fetchTrainings = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/admin/trainings/all', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch trainings')
      }
      setTrainings(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch trainings')
    }
    setIsLoading(false)
  }


  const fetchExercisesFromAPI = async () => {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:8080/api/admin/exercises/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch exercises')
    }
    return await response.json()
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
    fetchTrainings()
    loadExercises()
  }, [])

  const handleDeleteClick = (training) => {
    setSelectedTraining(training)
    setDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/admin/trainings/${selectedTraining.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `Failed to delete training (${response.status})`);
      }

      await fetchTrainings();
      setDeleteDialog(false)
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the training');
      setTimeout(() => setError(null), 5000);
    }
  }

  const renderExercises = (trainingExercises) => {
    return trainingExercises.map(ex => {
      const exercise = exercises[ex.exerciseId]
      return exercise ? `${exercise.name} (${ex.sets}x${ex.reps})` : `Unknown Exercise (${ex.sets}x${ex.reps})`
    }).join(', ')
  }

  if (!isAdmin) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Access Denied - Admin privileges required
        </Alert>
      </Container>
    );
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
              <Button color="inherit" size="small" onClick={() => window.location.reload()}>
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
        Trainings
      </Typography>
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
                    onClick={() => navigate(`/admin/trainings/update/${training.id}`)}
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
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete training: {selectedTraining?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} variant='contained'>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Trainings
