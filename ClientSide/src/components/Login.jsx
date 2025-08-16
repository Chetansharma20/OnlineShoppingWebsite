import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Fade,
  Slide,
  Divider,
  Link,
  Container,
  Grid
} from '@mui/material'
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Person,
  ShoppingBag,
  ArrowBack,
  Google,
  Facebook
} from '@mui/icons-material'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../reduxwork/UserSlice'
import { useDispatch } from 'react-redux'

const Login = () => {
  const navigate = useNavigate()
  const dispatcher = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formVisible, setFormVisible] = useState(false)

  useEffect(() => {
    setFormVisible(true)
  }, [])

  const doLoginReq = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const formEntries = new FormData(event.target)
    const LoginUserData = Object.fromEntries(formEntries.entries())

    try {
      const loginResult = await axios.post("http://localhost:5000/api/login", LoginUserData)
      setSuccess('Login successful! Redirecting...')
      setTimeout(() => {
        navigate('/orders')
        dispatcher(login(loginResult.data.data))
      }, 1500)
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            py: 4
          }}
        >
          {/* Welcome Section */}
          <Fade in={formVisible} timeout={1000}>
            <Box sx={{ textAlign: 'center', color: 'white', mb: 4 }}>
              <ShoppingBag sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                Welcome Back!
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                Sign in to access your account
              </Typography>
              <Button
                variant="text"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Back to Home
              </Button>
            </Box>
          </Fade>

          {/* Centered Login Form */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <Slide direction="left" in={formVisible} timeout={800}>
              <Paper
                elevation={20}
                sx={{
                  p: 5,
                  width: '100%',
                  maxWidth: 450,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Box textAlign="center" sx={{ mb: 4 }}>
                  <Person sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                    Sign In
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Enter your credentials to access your account
                  </Typography>
                </Box>

                {error && (
                  <Fade in={!!error}>
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  </Fade>
                )}

                {success && (
                  <Fade in={!!success}>
                    <Alert severity="success" sx={{ mb: 3 }}>
                      {success}
                    </Alert>
                  </Fade>
                )}

                <Box
                  component="form"
                  onSubmit={doLoginReq}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                >
                  <TextField
                    type="email"
                    label="Email Address"
                    variant="outlined"
                    name="userEmail"
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' }
                      }
                    }}
                  />

                  <TextField
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    variant="outlined"
                    name="userPassword"
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' }
                      }
                    }}
                  />

                   <Box textAlign="right">
                    <Link
                      component="button"
                      type="button"
                      variant="body2"
                      sx={{ color: '#667eea', textDecoration: 'none' }}
                      onClick={() => {/* Add forgot password logic */}}
                    >
                      Forgot password?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: 16,
                      fontWeight: 'bold',
                      textTransform: 'none',
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, .4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      or continue with
                    </Typography>
                  </Divider>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Google />}
                      sx={{
                        py: 1.2,
                        textTransform: 'none',
                        borderColor: '#ddd',
                        color: '#666',
                        '&:hover': { bgcolor: '#f5f5f5', borderColor: '#ccc' }
                      }}
                      onClick={() => window.location.href = "http://localhost:5000/api/google"}
                    >
                      Google
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Facebook />}
                      sx={{
                        py: 1.2,
                        textTransform: 'none',
                        borderColor: '#ddd',
                        color: '#666',
                        '&:hover': { bgcolor: '#f5f5f5', borderColor: '#ccc' }
                      }}
                    >
                      Facebook
                    </Button>
                  </Box>

                  <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                    Don't have an account?{' '}
                    <Link
                      component="button"
                      type="button"
                      variant="body2"
                      onClick={() => navigate("/register")}
                      sx={{
                        color: '#667eea',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Create Account
                    </Link>
                  </Typography>
                </Box>
              </Paper>
            </Slide>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Login
