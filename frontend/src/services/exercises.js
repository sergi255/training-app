import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

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

        if (!response.ok) {
          if (response.status === 401) {
            logout()
            return
          }
          throw new Error('Failed to fetch exercises')
        }

        const data = await response.json()
        setExercises(data)
      } catch (err) {
        setError(err.message)
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

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to add exercise');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
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

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to delete exercise');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
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

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to update exercise');
    }

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

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch exercise');
    }

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
  
          if (!response.ok) {
            if (response.status === 401) {
              logout()
              return
            }
            throw new Error('Failed to fetch exercises')
          }
  
          const data = await response.json()
          setExercises(data)
        } catch (err) {
          setError(err.message)
        } finally {
          setIsLoading(false)
        }
      }
  
      fetchExercises()
    }, [logout])
  
    return { exercises, isLoading, error }
  }
