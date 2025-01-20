import { useState } from 'react';
import { Container, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTrainings } from '../../services/trainings';
import TrainingForm from '../../components/TrainingForm';
import { useAuth } from '../../context/AuthContext';

const AddTraining = () => {
  const navigate = useNavigate();
  const { createTraining } = useTrainings();
  const { logout } = useAuth();
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      await createTraining(formData);
      navigate('/trainings');
    } catch (err) {
      if (err.message.includes('Unauthorized')) {
        logout();
      }
      setError(err.message);
    }
  };

  const initialData = {
    name: '',
    date: dayjs(),
    exercises: []
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Training
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TrainingForm 
          initialData={initialData}
          onSubmit={handleSubmit}
          submitButtonText="Create Training"
        />
      </Box>
    </Container>
  );
};

export default AddTraining;
