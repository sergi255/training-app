import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export const useTrainings = (endpoint = '/api/trainings') => {
  const [trainings, setTrainings] = useState([])
  const [exercises, setExercises] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { logout } = useAuth()

  const fetchTrainings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          logout()
          return
        }
        throw new Error('Failed to fetch trainings')
      }

      const data = await response.json()
      setTrainings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/exercises/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch exercises')
      }

      const data = await response.json()
      setExercises(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const createTraining = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        date: formData.date.format('YYYY-MM-DD'),
        exercises: formData.exercises.map(ex => ({
          exerciseId: parseInt(ex.exerciseId),
          sets: parseInt(ex.sets),
          reps: parseInt(ex.reps)
        }))
      };

      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/trainings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create training')
      }

      await fetchTrainings()
      return response.json()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    fetchTrainings()
    fetchExercises()
  }, [endpoint])

  return { 
    trainings, 
    exercises,
    isLoading, 
    error,
    createTraining,
    fetchTrainings 
  }
}
