import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const handleApiError = (response) => {
  if (!response.ok) {
    switch (response.status) {
      case 400:
        throw new Error('Invalid request data');
      case 401:
        throw new Error('Unauthorized - Please login again');
      case 403:
        throw new Error('Access forbidden - You don\'t have permission');
      case 404:
        throw new Error('Resource not found');
      case 429:
        throw new Error('Too many requests - Please try again later');
      case 500:
        throw new Error('Server error - Please try again later');
      default:
        throw new Error('An unexpected error occurred');
    }
  }
  return response;
};

export const useTrainings = (endpoint = '/api/trainings') => {
  const [trainings, setTrainings] = useState([])
  const [exercises, setExercises] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { logout } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exercisesResult = await getAllExercises();
        if (exercisesResult.success) {
          setExercises(exercisesResult.data);
        }
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:8080${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        handleApiError(response);
        const data = await response.json()
        setTrainings(data)
      } catch (err) {
        setError(err.message)
        if (err.message.includes('Unauthorized')) {
          logout()
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [endpoint, logout])

  const getTraining = async (id) => {
    try {
      const result = await getSingleTraining(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch training');
      }
      return result;  // Return the whole result object instead of just data
    } catch (err) {
      if (err.message?.includes('Unauthorized')) {
        logout();
      }
      throw err;
    }
  };

  const handleUpdateTraining = async (id, formData) => {
    const result = await updateTraining(id, formData);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result;
  };

  const handleCreateTraining = async (formData) => {
    const result = await addTraining(formData);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result;
  };

  const handleDeleteTraining = async (id) => {
    try {
      const result = await deleteTraining(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      setTrainings(prevTrainings => prevTrainings.filter(t => t.id !== id));
      return result;
    } catch (err) {
      setError(err.message);
    }
  };

  return { 
    trainings, 
    isLoading, 
    error, 
    exercises, 
    getTraining,
    updateTraining: handleUpdateTraining,
    createTraining: handleCreateTraining,
    deleteTraining: handleDeleteTraining 
  };
}

export const useDeleteTraining = () => {
  const [deleteError, setDeleteError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id) => {
    setIsDeleting(true)
    try {
      const result = await deleteTraining(id)
      if (result.success) {
        window.location.reload()
        return true
      } else {
        setDeleteError(result.error)
        return false
      }
    } catch (err) {
      setDeleteError(err.message)
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return { handleDelete, deleteError, isDeleting }
}

export const addTraining = async (formData, endpoint = '/api/trainings') => {
  try {
    const payload = {
      name: formData.name,
      date: formData.date.format('YYYY-MM-DD'),
      exercises: formData.exercises.map(ex => ({
        exerciseId: parseInt(ex.exerciseId),
        sets: parseInt(ex.sets),
        reps: parseInt(ex.reps)
      }))
    }

    const response = await fetch(`http://localhost:8080${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    })

    handleApiError(response);
    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      isAuthError: error.message.includes('Unauthorized')
    }
  }
}

export const deleteTraining = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/trainings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    handleApiError(response);
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      isAuthError: error.message.includes('Unauthorized')
    }
  }
}

export const updateTraining = async (id, formData) => {
  try {
    const payload = {
      name: formData.name,
      date: formData.date.format('YYYY-MM-DD'),
      exercises: formData.exercises.map(ex => ({
        exerciseId: parseInt(ex.exerciseId),
        sets: parseInt(ex.sets),
        reps: parseInt(ex.reps)
      }))
    }

    const response = await fetch(`http://localhost:8080/api/trainings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    })

    handleApiError(response);
    
    if (response.status === 404) {
      return { 
        success: false, 
        error: 'Training not found',
        isAuthError: false
      }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      isAuthError: error.message.includes('Unauthorized')
    }
  }
}

export const getSingleTraining = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/trainings/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { 
          success: false, 
          error: 'Training not found'
        };
      }
      handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      isAuthError: error.message?.includes('Unauthorized')
    };
  }
};

export const getAllExercises = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/exercises/all', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    handleApiError(response);
    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      isAuthError: error.message.includes('Unauthorized')
    }
  }
}

export const useUserTrainings = () => {
  const [trainings, setTrainings] = useState([])
  const [exercises, setExercises] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { logout } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const [trainingsRes, exercisesRes] = await Promise.all([
          fetch('http://localhost:8080/api/trainings', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:8080/api/exercises/all', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ])

        handleApiError(trainingsRes);
        handleApiError(exercisesRes);

        const trainingsData = await trainingsRes.json()
        const exercisesData = await exercisesRes.json()
        
        setTrainings(trainingsData)
        setExercises(exercisesData.reduce((acc, exercise) => {
          acc[exercise.id] = exercise
          return acc
        }, {}))
      } catch (err) {
        setError(err.message)
        if (err.message.includes('Unauthorized')) {
          logout()
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [logout])

  const renderExercises = (trainingExercises) => {
    return trainingExercises.map(ex => {
      const exercise = exercises[ex.exerciseId]
      return exercise ? `${exercise.name} (${ex.sets}x${ex.reps})` : `Unknown Exercise (${ex.sets}x${ex.reps})`
    }).join(', ')
  }

  return { trainings, isLoading, error, renderExercises }
}