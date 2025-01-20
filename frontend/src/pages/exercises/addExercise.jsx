import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Alert } from '@mui/material';
import ExerciseForm from '../../components/ExerciseForm';

const AddExercise = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    muscleGroup: '',
  });

  const addExerciseToAPI = async (exerciseData) => {
    const response = await fetch('http://localhost:8080/api/exercises', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(exerciseData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to add exercise');
    }

    return await response.json();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExerciseToAPI(formData);
      navigate('/exercises');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCancel = () => {
    navigate('/exercises');
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add New Exercise
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <ExerciseForm
        formData={formData}
        onSubmit={handleFormSubmit}
        onChange={handleInputChange}
        onCancel={handleCancel}
        submitButtonText="Add Exercise"
      />
    </Box>
  );
};

export default AddExercise;