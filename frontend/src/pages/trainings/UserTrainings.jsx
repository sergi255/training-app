import { useAuth } from '../../context/AuthContext'
import { useUserTrainings } from '../../hooks/useUserTrainings'
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material'

const Trainings = () => {
  const { username } = useAuth()
  const { trainings, isLoading, error, renderExercises } = useUserTrainings()

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
