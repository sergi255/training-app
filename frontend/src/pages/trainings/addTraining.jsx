import { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Alert, 
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useTrainings } from '../../services/trainings';
import { useNavigate } from 'react-router-dom';

const AddTraining = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    date: dayjs(),
    exercises: []
  });
  const [error, setError] = useState('');
  const { exercises, createTraining } = useTrainings();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      date: newDate
    }));
  };

  const addExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { exerciseId: '', sets: '', reps: '' }]
    }));
  };

  const removeExercise = (index) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleExerciseChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => {
        if (i === index) {
          return { ...exercise, [field]: value };
        }
        return exercise;
      })
    }));
  };

  const getAvailableExercises = (currentIndex) => {
    const selectedExerciseIds = formData.exercises
      .filter((_, index) => index !== currentIndex) // Exclude current exercise
      .map(ex => ex.exerciseId)
      .filter(id => id !== ''); // Filter out empty selections

    return exercises.filter(ex => 
      !selectedExerciseIds.includes(ex.id.toString()) && 
      !selectedExerciseIds.includes(ex.id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.exercises.length === 0) {
      setError('Please fill in all required fields and add at least one exercise');
      return;
    }

    const invalidExercises = formData.exercises.some(
      ex => !ex.exerciseId || !ex.sets || !ex.reps
    );
    if (invalidExercises) {
      setError('Please fill in all exercise details');
      return;
    }

    try {
      await createTraining(formData);
      setFormData({
        name: '',
        date: dayjs(),
        exercises: []
      });
      setError('');
      navigate('/trainings');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Training
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Training Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Training Date"
              value={formData.date}
              onChange={handleDateChange}
              sx={{ mt: 2, width: '100%' }}
            />
          </LocalizationProvider>

          <Typography variant="h6" sx={{ mt: 3 }}>Exercises</Typography>
          
          {formData.exercises.map((exercise, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
              <FormControl required sx={{ flexGrow: 1 }}>
                <InputLabel id={`exercise-label-${index}`}>Exercise</InputLabel>
                <Select
                  labelId={`exercise-label-${index}`}
                  value={exercise.exerciseId}
                  label="Exercise"
                  onChange={(e) => handleExerciseChange(index, 'exerciseId', e.target.value)}
                >
                  {getAvailableExercises(index).map((ex) => (
                    <MenuItem key={ex.id} value={ex.id}>
                      {ex.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                required
                label="Sets"
                type="number"
                value={exercise.sets}
                onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                sx={{ width: '80px' }}
              />
              <TextField
                required
                label="Reps"
                type="number"
                value={exercise.reps}
                onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                sx={{ width: '80px' }}
              />
              <IconButton onClick={() => removeExercise(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            type="button"
            variant="outlined"
            onClick={addExercise}
            sx={{ mt: 2 }}
          >
            Add Exercise
          </Button>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Training
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddTraining;