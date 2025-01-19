import { Box, Button, TextField, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';

const ExerciseForm = ({ formData, onSubmit, onChange, onCancel, submitButtonText }) => {
  const muscleGroups = [
    'Chest',
    'Back',
    'Legs',
    'Shoulders',
    'Arms',
    'Core',
    'Full Body'
  ];

  return (
    <form onSubmit={onSubmit}>
      <TextField
        fullWidth
        label="Exercise Name"
        name="name"
        value={formData.name}
        onChange={onChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={formData.description}
        onChange={onChange}
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
        onChange={onChange}
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
          {submitButtonText}
        </Button>
        <Button 
          variant="outlined" 
          onClick={onCancel} 
          sx={{ ml: 2 }}
        >
          Cancel
        </Button>
      </Box>
    </form>
  );
};

ExerciseForm.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    muscleGroup: PropTypes.string.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string.isRequired
};

export default ExerciseForm;
