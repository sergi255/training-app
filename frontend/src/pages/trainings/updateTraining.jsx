import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert, 
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useTrainings } from '../../services/trainings';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UpdateTraining = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [setSubmitting] = useState(false);  // Add this line
  const [formData, setFormData] = useState({
    name: '',
    date: dayjs(),
    exercises: []
  });
  const [error, setError] = useState('');
  const { exercises, updateTraining, getTraining } = useTrainings();
  const [notFound, setNotFound] = useState(false);

  const fetchTraining = useCallback(async () => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const result = await getTraining(id);
      
      if (!result.success || !result.data) {
        setNotFound(true);
        return;
      }

      setFormData({
        name: result.data.name,
        date: dayjs(result.data.date),
        exercises: result.data.exercises.map(ex => ({
          exerciseId: ex.exerciseId ? ex.exerciseId.toString() : ex.id.toString(),
          sets: ex.sets ? ex.sets.toString() : '',
          reps: ex.reps ? ex.reps.toString() : ''
        }))
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch training');
      if (err.message?.includes('Unauthorized')) {
        logout();
      }
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id, logout, getTraining]);

  useEffect(() => {
    if (!loading) return;
    fetchTraining();
  }, [fetchTraining, loading]);

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
      .filter((_, index) => index !== currentIndex)
      .map(ex => ex.exerciseId)
      .filter(id => id !== '');

    const currentExercise = formData.exercises[currentIndex]?.exerciseId;
    
    return exercises.filter(ex => 
      !selectedExerciseIds.includes(ex.id.toString()) || 
      ex.id.toString() === currentExercise
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
      setError('');
      setSubmitting(true); // Use submitting instead of loading
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
      if (!result || !result.success) {
        throw new Error(result?.error || 'Failed to update training');
      }
      navigate('/trainings', { replace: true });
    } catch (err) {
      setError(err.message);
      if (err.message?.includes('Unauthorized')) {
        logout();
      }
      setSubmitting(false);
    }
  };

  // Loading state first
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Not found state next
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

  // Only if not loading and not notFound, render the form
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Update Training
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
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
          Update Training
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateTraining;