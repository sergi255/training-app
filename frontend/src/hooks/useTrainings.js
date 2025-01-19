import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export const useTrainings = (endpoint = '/api/trainings') => {
  const [trainings, setTrainings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { logout } = useAuth()

  useEffect(() => {
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

    fetchTrainings()
  }, [endpoint, logout])

  return { trainings, isLoading, error }
}
