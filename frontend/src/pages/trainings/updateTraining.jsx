import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Alert, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import { useTrainings } from '../../services/trainings';
import TrainingForm from '../../components/TrainingForm';
import { useAuth } from '../../context/AuthContext';  // Fixed import path

const UpdateTraining = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialData, setInitialData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { updateTraining, getTraining } = useTrainings();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchTraining = async () => {
      if (!id || !getTraining) return;
      
      try {
        const training = await getTraining(id);
        const mappedData = {
          name: training.name,
          date: dayjs(training.date),
          exercises: training.exercises.map(ex => ({
            exerciseId: ex.exerciseId ? ex.exerciseId.toString() : ex.id.toString(),
            sets: ex.sets ? ex.sets.toString() : '',
            reps: ex.reps ? ex.reps.toString() : ''
          }))
        };
        setLoading(false);
        setInitialData(mappedData);
      } catch (err) {
        setLoading(false);
        if (err.message.includes('not found')) {
          setNotFound(true);
        } else if (err.message.includes('Unauthorized')) {
          logout();
        }
        setError(err.message);
      }
    };

    if (loading) {
      fetchTraining();
    }
  }, [id, getTraining, loading, logout]);

  const handleSubmit = async (formData) => {
    try {
      const submissionData = {
        ...formData,
        exercises: formData.exercises.map(ex => ({
          ...ex,
          exerciseId: parseInt(ex.exerciseId),
          sets: parseInt(ex.sets),
          reps: parseInt(ex.reps)
        }))
      };
      
      await updateTraining(id, submissionData);
      navigate('/trainings');
    } catch (err) {
      setError(err.message);
      throw err; // Propagate error to TrainingForm
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (notFound) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Alert 
            severity="error" 
          >
            Training not found
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Update Training
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {initialData && (
          <TrainingForm 
            initialData={initialData}
            onSubmit={handleSubmit}
            submitButtonText="Update Training"
          />
        )}
      </Box>
    </Container>
  );
};

export default UpdateTraining;
