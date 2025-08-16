import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  LinearProgress,
  Alert,
  Collapse,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  Chip,
  Fade,
  Slide,
  Avatar,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  Phone,
  Home,
  CheckCircle,
  Error,
  ArrowBack,
  PersonAdd,
  Security,
  AccountCircle
} from '@mui/icons-material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    confirmPassword: '',
    userAge: '',
    userPhone: '',
    userAddress: '',
    userGender: 'Male'
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'info' });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const steps = ['Personal Info', 'Contact Details', 'Account Security'];

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 30) return 'error';
    if (strength < 60) return 'warning';
    if (strength < 80) return 'info';
    return 'success';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  };

  useEffect(() => {
    if (formData.userPassword) {
      setPasswordStrength(calculatePasswordStrength(formData.userPassword));
    }
  }, [formData.userPassword]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'userName':
        if (!value.trim()) {
          newErrors.userName = 'Name is required';
        } else if (value.length < 2) {
          newErrors.userName = 'Name must be at least 2 characters';
        } else {
          delete newErrors.userName;
        }
        break;

      case 'userEmail':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.userEmail = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.userEmail = 'Please enter a valid email';
        } else {
          delete newErrors.userEmail;
        }
        break;

      case 'userPassword':
        if (!value) {
          newErrors.userPassword = 'Password is required';
        } else if (value.length < 8) {
          newErrors.userPassword = 'Password must be at least 8 characters';
        } else {
          delete newErrors.userPassword;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.userPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      case 'userAge':
        if (value && (value < 13 || value > 120)) {
          newErrors.userAge = 'Please enter a valid age (13-120)';
        } else {
          delete newErrors.userAge;
        }
        break;

      case 'userPhone':
        const phoneRegex = /^[0-9]{10}$/;
        if (value && !phoneRegex.test(value.replace(/\D/g, ''))) {
          newErrors.userPhone = 'Please enter a valid 10-digit phone number';
        } else {
          delete newErrors.userPhone;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleNext = () => {
    const currentStepFields = getStepFields(activeStep);
    const isValid = currentStepFields.every(field => {
      const value = formData[field];
      return validateField(field, value) && value.trim() !== '';
    });

    if (isValid) {
      setActiveStep(prev => prev + 1);
    } else {
      setAlert({
        show: true,
        message: 'Please fill in all required fields correctly',
        severity: 'error'
      });
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const getStepFields = (step) => {
    switch (step) {
      case 0: return ['userName', 'userAge', 'userGender'];
      case 1: return ['userEmail', 'userPhone', 'userAddress'];
      case 2: return ['userPassword', 'confirmPassword'];
      default: return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isFormValid = Object.keys(formData).every(field => {
      if (field === 'confirmPassword') return true;
      return validateField(field, formData[field]);
    });

    if (!isFormValid || formData.userPassword !== formData.confirmPassword) {
      setAlert({
        show: true,
        message: 'Please correct all errors before submitting',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      const result = await axios.post("http://localhost:5000/api/createuser", submitData);
      
      setAlert({
        show: true,
        message: 'Registration successful! Redirecting to login...',
        severity: 'success'
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                error={!!errors.userName}
                helperText={errors.userName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="userAge"
                type="number"
                value={formData.userAge}
                onChange={handleInputChange}
                error={!!errors.userAge}
                helperText={errors.userAge}
                inputProps={{ min: 13, max: 120 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ mb: 1 }}>Gender</FormLabel>
                <RadioGroup
                  row
                  name="userGender"
                  value={formData.userGender}
                  onChange={handleInputChange}
                >
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  <FormControlLabel value="Others" control={<Radio />} label="Others" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="userEmail"
                type="email"
                value={formData.userEmail}
                onChange={handleInputChange}
                error={!!errors.userEmail}
                helperText={errors.userEmail}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="userPhone"
                value={formData.userPhone}
                onChange={handleInputChange}
                error={!!errors.userPhone}
                helperText={errors.userPhone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="userAddress"
                multiline
                rows={3}
                value={formData.userAddress}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <Home color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="userPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.userPassword}
                onChange={handleInputChange}
                error={!!errors.userPassword}
                helperText={errors.userPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />
              {formData.userPassword && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Password Strength:
                    </Typography>
                    <Chip
                      label={getPasswordStrengthText(passwordStrength)}
                      color={getPasswordStrengthColor(passwordStrength)}
                      size="small"
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    color={getPasswordStrengthColor(passwordStrength)}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Security color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Fade in timeout={1000}>
        <Card
          elevation={12}
          sx={{
            width: '100%',
            maxWidth: 600,
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 4,
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                width: 60,
                height: 60,
                mx: 'auto',
                mb: 2,
                backdropFilter: 'blur(10px)'
              }}
            >
              <PersonAdd sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Join our community and start shopping today!
            </Typography>
            
            {/* Back to Login */}
            <IconButton
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
              onClick={() => navigate('/login')}
            >
              <ArrowBack />
            </IconButton>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {/* Alert */}
            <Collapse in={alert.show}>
              <Alert
                severity={alert.severity}
                onClose={() => setAlert({ ...alert, show: false })}
                sx={{ mb: 3 }}
              >
                {alert.message}
              </Alert>
            </Collapse>

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Slide direction="left" in mountOnEnter unmountOnExit>
                <Box sx={{ mb: 4 }}>
                  {renderStepContent(activeStep)}
                </Box>
              </Slide>

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<ArrowBack />}
                >
                  Back
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)',
                      }
                    }}
                    startIcon={<CheckCircle />}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)',
                      }
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>

            {/* Login Link */}
            <Divider sx={{ my: 3 }} />
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Button
                  variant="text"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#667eea',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' }
                  }}
                >
                  Sign In
                </Button>
              </Typography>
            </Box>
          </CardContent>

          {/* Loading Progress */}
          {loading && (
            <LinearProgress
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }
              }}
            />
          )}
        </Card>
      </Fade>
    </Box>
  );
};

export default Register;
