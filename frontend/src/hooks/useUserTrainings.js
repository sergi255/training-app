import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

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

        if (!trainingsRes.ok) {
          if (trainingsRes.status === 401) {
            logout()
            return
          }
          throw new Error('Failed to fetch trainings')
        }

        const trainingsData = await trainingsRes.json()
        const exercisesData = await exercisesRes.json()
        
        setTrainings(trainingsData)
        setExercises(exercisesData.reduce((acc, exercise) => {
          acc[exercise.id] = exercise
          return acc
        }, {}))
      } catch (err) {
        setError(err.message)
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
