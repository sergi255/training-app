import { Box, Button, TextField, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PropTypes from 'prop-types';

const TrainingForm = ({ 
  formData, 
  exercises, 
  onSubmit, 
  onChange, 
  onCancel, 
  submitButtonText = 'Submit'
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (newDate) => {
    onChange({
      ...formData,
      date: newDate
    });
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...formData.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    
    // If changing exercise ID, check for duplicates
    if (field === 'exerciseId' && value) {
      const isDuplicate = newExercises.some(
        (ex, i) => i !== index && ex.exerciseId === value
      );
      
      if (isDuplicate) {
        // If duplicate found, don't update the value
        return;
      }
    }
    
    onChange({
      ...formData,
      exercises: newExercises
    });
  };

  const addExercise = () => {
    onChange({
      ...formData,
      exercises: [...formData.exercises, { exerciseId: '', sets: '', reps: '' }]
    });
  };

  const removeExercise = (index) => {
    onChange({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index)
    });
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

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
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

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          sx={{ flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{ flex: 1 }}
        >
          {submitButtonText}
        </Button>
      </Box>
    </Box>
  );
};

TrainingForm.propTypes = {
    formData: PropTypes.object.isRequired,
    exercises: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    submitButtonText: PropTypes.string
    };
    
export default TrainingForm;