import { createContext, useState, useContext, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { parseToken, isTokenValid, getRolesFromToken } from '../utils/tokenUtils'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [roles, setRoles] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('role') // Clear roles from localStorage
    setIsAuthenticated(false)
    setUsername('')
    setRoles([])
  }, [])

  const login = useCallback((token) => {
    if (!isTokenValid(token)) {
      logout()
      return
    }

    const parsedToken = parseToken(token)
    if (!parsedToken) {
      logout()
      return
    }

    const roles = getRolesFromToken(token)
    localStorage.setItem('role', roles[0])
    setRoles(roles)
    setIsAdmin(roles.includes('ROLE_ADMIN'))
    localStorage.setItem('token', token)
    setUsername(parsedToken.sub)
    setIsAuthenticated(true)
  }, [logout])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      login(token)
    }
    setIsLoading(false)
  }, [login])

  if (isLoading) {
    return null // or return a loading spinner component
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, username, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useAuth = () => useContext(AuthContext)
