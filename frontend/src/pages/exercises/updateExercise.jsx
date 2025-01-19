import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, TextField, Typography, MenuItem, Alert, CircularProgress } from '@mui/material';
import { updateExercise, getSingleExercise } from '../../hooks/useExercises';

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

  const muscleGroups = [
    'Chest',
    'Back',
    'Legs',
    'Shoulders',
    'Arms',
    'Core',
    'Full Body'
  ];

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
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Exercise Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          required
        />
        <TextField
          fullWidth
          select
          label="Muscle Group"
          name="muscleGroup"
          value={formData.muscleGroup}
          onChange={handleChange}
          margin="normal"
          required
        >
          {muscleGroups.map((group) => (
            <MenuItem key={group} value={group}>
              {group}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" color="primary">
            Update Exercise
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/exercises')} 
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateExercise;
