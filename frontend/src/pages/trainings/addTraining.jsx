import { Container, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTrainings } from '../../hooks/useTrainings';
import TrainingForm from '../../components/TrainingForm';

const AddTraining = () => {
  const navigate = useNavigate();
  const { createTraining } = useTrainings();

  const handleSubmit = async (formData) => {
    await createTraining(formData);
    navigate('/trainings');
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
