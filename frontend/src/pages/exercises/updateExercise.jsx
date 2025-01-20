import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Alert, CircularProgress, Button } from '@mui/material';
import ExerciseForm from '../../components/ExerciseForm';
import { useAuth } from '../../context/AuthContext';

const UpdateExercise = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    muscleGroup: '',
  });

  const fetchExerciseFromAPI = async (exerciseId) => {
    const response = await fetch(`http://localhost:8080/api/exercises/${exerciseId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Exercise not found');
      }
      if (response.status === 401) {
        logout();
      }
      throw new Error('Failed to fetch exercise');
    }

    return await response.json();
  };

  const updateExerciseInAPI = async (exerciseId, exerciseData) => {
    const response = await fetch(`http://localhost:8080/api/exercises/${exerciseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(exerciseData)
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      throw new Error('Failed to update exercise');
    }

    return await response.json();
  };

  const loadExercise = async () => {
    try {
      const data = await fetchExerciseFromAPI(id);
      setFormData(data);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('not found')) {
        setNotFound(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExercise();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateExerciseInAPI(id, formData);
      navigate('/exercises');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/exercises');
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
          Exercise not found
        </Alert>
        <Button
          variant="contained"
          onClick={handleCancel}
          sx={{ mt: 2 }}
        >
          Back to Exercises
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Update Exercise
      </Typography>
      {error && !notFound && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <ExerciseForm
        formData={formData}
        onSubmit={handleFormSubmit}
        onChange={handleInputChange}
        onCancel={handleCancel}
        submitButtonText="Update Exercise"
      />
    </Box>
  );
};

export default UpdateExercise;