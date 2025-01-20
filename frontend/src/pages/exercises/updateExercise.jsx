import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { updateExercise, getSingleExercise } from '../../services/exercises';
import ExerciseForm from '../../components/ExerciseForm';

const UpdateExercise = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    muscleGroup: '',
  });

  useEffect(() => {
    const fetchExercise = async () => {
      const result = await getSingleExercise(id);
      if (result.success) {
        setFormData(result.data);
      } else {
        setError(result.error);
      }
      setIsLoading(false);
    };

    fetchExercise();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateExercise(id, formData);
    if (result.success) {
      navigate('/exercises');
    } else {
      setError(result.error);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Update Exercise
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
        submitButtonText="Update Exercise"
      />
    </Box>
  );
};

export default UpdateExercise;
