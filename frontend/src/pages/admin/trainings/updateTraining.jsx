import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Alert, CircularProgress, Button } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import TrainingForm from '../../../components/TrainingForm';
import dayjs from 'dayjs';

const UpdateTraining = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: dayjs(),
    exercises: []
  });
  const [exercises, setExercises] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const getTraining = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/trainings/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: 'Training not found', isNotFound: true };
        }
        if (response.status === 401) {
          return { success: false, error: 'Unauthorized', isAuthError: true };
        }
        if (response.status === 500) {
          return { success: false, error: 'Server error occurred. Please try again later.' };
        }
        throw new Error(data.message || 'Failed to fetch training');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching training:', error);
      return { success: false, error: 'Failed to connect to the server. Please try again later.' };
    }
  };

  const updateTraining = async (id, trainingData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/trainings/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trainingData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, error: 'Unauthorized', isAuthError: true };
        }
        if (response.status === 500) {
          return { success: false, error: 'Server error occurred. Please try again later.' };
        }
        throw new Error(data.message || 'Failed to update training');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error updating training:', error);
      return { success: false, error: 'Failed to connect to the server. Please try again later.' };
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/exercises/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, error: 'Unauthorized', isAuthError: true };
        }
        throw new Error('Failed to fetch exercises');
      }

      setExercises(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (!id) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      const exercisesResult = await fetchExercises();
      if (!exercisesResult.success) {
        setError(exercisesResult.error);
        if (exercisesResult.isAuthError) {
          logout();
        }
        setIsLoading(false);
        return;
      }

      const result = await getTraining(id);
      if (result.success) {
        setFormData({
          name: result.data.name,
          date: dayjs(result.data.date),
          exercises: result.data.exercises.map(ex => ({
            exerciseId: ex.exerciseId ? ex.exerciseId.toString() : ex.id.toString(),
            sets: ex.sets ? ex.sets.toString() : '',
            reps: ex.reps ? ex.reps.toString() : ''
          }))
        });
      } else {
        setError(result.error);
        if (result.isNotFound) {
          setNotFound(true);
        }
        if (result.isAuthError) {
          logout();
        }
      }
      setIsLoading(false);
    };

    initialize();
  }, [id, logout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Check for duplicate exercises
    const exerciseIds = formData.exercises.map(ex => ex.exerciseId);
    const hasDuplicates = exerciseIds.length !== new Set(exerciseIds).size;
    
    if (hasDuplicates) {
      setError("Each exercise can only be added once");
      setIsLoading(false);
      return;
    }

    const submissionData = {
      ...formData,
      exercises: formData.exercises.map(ex => ({
        ...ex,
        exerciseId: parseInt(ex.exerciseId),
        sets: parseInt(ex.sets),
        reps: parseInt(ex.reps)
      }))
    };

    const result = await updateTraining(id, submissionData);
    if (result.success) {
      navigate('/admin/trainings');
    } else {
      setError(result.error);
      if (result.isAuthError) {
        logout();
      }
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (notFound) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Alert severity="error">
          Training not found
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/trainings')}
          sx={{ mt: 2 }}
        >
          Back to Trainings
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Update Training
      </Typography>
      {error && !notFound && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TrainingForm
        formData={formData}
        exercises={exercises}
        onSubmit={handleSubmit}
        onChange={(newFormData) => setFormData(newFormData)}
        onCancel={() => navigate('/admin/trainings')}
        submitButtonText="Update Training"
      />
    </Box>
  );
};

export default UpdateTraining;