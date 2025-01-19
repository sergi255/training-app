import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

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
