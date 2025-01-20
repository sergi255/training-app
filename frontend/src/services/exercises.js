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

export const useExercises = (endpoint = '/api/exercises') => {
  const [exercises, setExercises] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { logout } = useAuth()

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:8080${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        handleApiError(response);
        const data = await response.json()
        setExercises(data)
      } catch (err) {
        setError(err.message)
        if (err.message.includes('Unauthorized')) {
          logout()
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchExercises()
  }, [endpoint, logout])

  return { exercises, isLoading, error }
}

export const useDeleteExercise = () => {
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const result = await deleteExercise(id);
      if (result.success) {
        window.location.reload();
        return true;
      } else {
        setDeleteError(result.error);
        return false;
      }
    } catch (err) {
      setDeleteError(err.message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDelete, deleteError, isDeleting };
};

export const addExercise = async (formData, endpoint = '/api/exercises') => {
  try {
    const response = await fetch(`http://localhost:8080${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData)
    });

    handleApiError(response);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      isAuthError: error.message.includes('Unauthorized')
    };
  }
};

export const deleteExercise = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/exercises/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.status === 500) {
      return { 
        success: false, 
        error: 'Cannot delete exercise that is used in trainings',
        isExerciseInUse: true
      };
    }

    handleApiError(response);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      isAuthError: error.message.includes('Unauthorized')
    };
  }
};

export const updateExercise = async (id, formData) => {
  try {
    const response = await fetch(`http://localhost:8080/api/exercises/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData)
    });

    handleApiError(response);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


export const getSingleExercise = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/exercises/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    handleApiError(response);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const useUserExercises = () => {
    const [exercises, setExercises] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const { logout } = useAuth()
  
    useEffect(() => {
      const fetchExercises = async () => {
        try {
          const token = localStorage.getItem('token')
          const response = await fetch('http://localhost:8080/api/exercises', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
  
          handleApiError(response);
          const data = await response.json()
          setExercises(data)
        } catch (err) {
          setError(err.message)
          if (err.message.includes('Unauthorized')) {
            logout()
          }
        } finally {
          setIsLoading(false)
        }
      }
  
      fetchExercises()
    }, [logout])
  
    return { exercises, isLoading, error }
  }
