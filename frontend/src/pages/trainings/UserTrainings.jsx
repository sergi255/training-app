import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useUserTrainings, useDeleteTraining } from '../../services/trainings'
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, CircularProgress, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Trainings = () => {
  const { username } = useAuth()
  const { trainings, isLoading, error, renderExercises } = useUserTrainings()
  const { handleDelete, deleteError } = useDeleteTraining()
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [trainingToDelete, setTrainingToDelete] = useState(null)

  const handleDeleteClick = (training) => {
    setTrainingToDelete(training)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    await handleDelete(trainingToDelete.id)
    setDeleteDialogOpen(false)
    setTrainingToDelete(null)
  };

  
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
      {deleteError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {deleteError}
        </Typography>
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
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Training</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this training?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="contained">
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
