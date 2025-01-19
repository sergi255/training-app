import { useAuth } from '../../context/AuthContext'
import { useUserExercises } from '../../hooks/useUserExercises'
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material'

const Exercises = () => {
  const { username } = useAuth()
  const { exercises, isLoading, error } = useUserExercises()

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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exercises.map((exercise) => (
              <TableRow key={exercise.id}>
                <TableCell>{exercise.name}</TableCell>
                <TableCell>{exercise.description}</TableCell>
                <TableCell>{exercise.muscleGroup}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default Exercises
