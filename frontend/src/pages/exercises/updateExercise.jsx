import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Alert, CircularProgress, Snackbar} from '@mui/material';
import { updateExercise, getSingleExercise } from '../../services/exercises';
import ExerciseForm from '../../components/ExerciseForm';
import { useAuth } from '../../context/AuthContext';

const UpdateExercise = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    muscleGroup: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchExercise = async () => {
      const result = await getSingleExercise(id);
      if (result.success) {
        setFormData(result.data);
      } else {
        setError(result.error);
        if (result.error.includes('not found')) {
          setNotFound(true);
        }
        if (result.isAuthError) {
          logout();
        }
      }
      setIsLoading(false);
    };

    fetchExercise();
  }, [id, logout]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await updateExercise(id, formData);
    if (result.success) {
      setSnackbar({
        open: true,
        message: 'Exercise updated successfully!',
        severity: 'success'
      });
      setTimeout(() => navigate('/exercises'), 1500);
    } else {
      setError(result.error);
      if (result.isAuthError) {
        logout();
      }
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (notFound) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Alert 
          severity="error" 
        >
          Exercise not found
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Update Exercise
      </Typography>
      {error && !notFound && (
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateExercise;
