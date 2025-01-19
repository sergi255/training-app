import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, MenuItem, Alert } from '@mui/material';
import { addExercise } from '../../hooks/useExercises';

const AddExercise = () => {
  const navigate = useNavigate();
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
            Add Exercise
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

export default AddExercise;
