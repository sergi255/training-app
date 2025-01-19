export const parseToken = (token) => {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) throw new Error('Invalid token format')
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Token parsing failed:', error)
    return null
  }
}

export const isTokenValid = (token) => {
  const parsed = parseToken(token)
  if (!parsed || !parsed.exp) return false
  return parsed.exp * 1000 > Date.now()
}
