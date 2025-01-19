import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Alert } from '@mui/material';
import { addExercise } from '../../hooks/useExercises';
import ExerciseForm from '../../components/ExerciseForm';

const AddExercise = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    muscleGroup: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addExercise(formData, '/api/exercises');
    
    if (result.success) {
      navigate('/exercises');
    } else {
      setError(result.error);
    }
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
        onSubmit={handleSubmit}
        onChange={handleChange}
        onCancel={() => navigate('/exercises')}
        submitButtonText="Add Exercise"
      />
    </Box>
  );
};

export default AddExercise;
