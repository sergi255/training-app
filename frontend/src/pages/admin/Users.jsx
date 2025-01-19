import { useEffect, useState } from 'react'
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material'
const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAdmin = true; // This should be replaced with actual admin check logic

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
        const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/api/admin/users', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch users')
        }
        setUsers(data)
    } catch (err) {
        setError(err.message || 'Failed to fetch users')
    }
    setIsLoading(false)
    }

    useEffect(() => {
        fetchUsers()
    }, [])


  if (!isAdmin) {
    return (
      <Container>
        <Typography color="error" sx={{ mt: 4 }}>
          Access Denied
        </Typography>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default Users