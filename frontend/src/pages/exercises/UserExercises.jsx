import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useUserExercises } from '../../hooks/useExercises'
import { useNavigate } from 'react-router-dom'
import { useDeleteExercise } from '../../hooks/useExercises'
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, CircularProgress, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText
} from '@mui/material'

const Exercises = () => {
  const { username } = useAuth()
  const { exercises, isLoading, error } = useUserExercises()
  const { handleDelete, deleteError } = useDeleteExercise()
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [exerciseToDelete, setExerciseToDelete] = useState(null)

  const handleDeleteClick = (exercise) => {
    setExerciseToDelete(exercise)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    await handleDelete(exerciseToDelete.id);
    setDeleteDialogOpen(false);
    setExerciseToDelete(null);
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
        {username}&apos;s Exercises
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
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exercises.map((exercise) => (
              <TableRow key={exercise.id}>
                <TableCell>{exercise.name}</TableCell>
                <TableCell>{exercise.description}</TableCell>
                <TableCell>{exercise.muscleGroup}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate(`/exercises/update/${exercise.id}`)}
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error"
                    onClick={() => handleDeleteClick(exercise)}
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
        <DialogTitle>Delete Exercise</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{exerciseToDelete?.name}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} variant='contained'>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Exercises
