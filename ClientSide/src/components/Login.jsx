import { Box, Button, TextField, Typography, Paper } from '@mui/material'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../reduxwork/UserSlice'
import { useDispatch } from 'react-redux'

const Login = () => {
  let navigate = useNavigate()
  let dispatcher = useDispatch()

  let doLoginReq = async (event) => {
    event.preventDefault()
    let formEntries = new FormData(event.target)
    let LoginUserData = Object.fromEntries(formEntries.entries())
    console.log("Data", LoginUserData)

    try {
      let loginResult = await axios.post("http://localhost:5000/api/login", LoginUserData)
      console.log("RES", loginResult)
      navigate('/orders')
      dispatcher(login(loginResult.data.data))
    } catch (error) {
      console.log(error.response)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#FFEBEE',  // Light pink background for a soft touch
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 3,
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <Box
          component="form"
          onSubmit={(e) => doLoginReq(e)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            type="email"
            label="Enter Email"
            variant="outlined"
            name="CompanyEmail"
            required
            sx={{ marginBottom: 2 }}
          />

          <TextField
            type="password"
            label="Enter Password"
            variant="outlined"
            name="CompanyPassword"
            required
            sx={{ marginBottom: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{
              fontWeight: 'bold',
              textTransform: 'none',
              padding: '12px',
              '&:hover': {
                backgroundColor: '#4caf50',  // Lighter green on hover
              },
            }}
          >
            Login
          </Button>

          <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
            New User?{' '}
            <Button
              variant="text"
              size="small"
              onClick={() => navigate("/register")}
              sx={{ textTransform: 'none' }}
            >
              Register
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default Login
