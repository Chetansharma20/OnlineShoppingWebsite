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
} from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const reqData = Object.fromEntries(formData.entries());
    console.log("REQ", reqData);

    try {
      const result = await axios.post("http://localhost:5000/api/createuser", reqData);
      console.log(result.data);
      alert(result.data.message);
      navigate('/login'); // Redirect after success
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#FFEBEE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <TextField size="small" label="User Name" name="userName" required />
          <TextField size="small" label="Email" name="userEmail" type="email" required />
          <TextField size="small" label="Password" name="userPassword" type="password" required />
          <TextField size="small" label="Age" name="userAge" type="number" />
          <TextField size="small" label="Phone" name="userPhone" />
          <TextField
            size="small"
            label="Address"
            name="userAddress"
            multiline
            rows={3}
          />

          <FormControl>
            <FormLabel sx={{ fontSize: '0.875rem' }}>Gender</FormLabel>
            <RadioGroup row defaultValue="Male" name="userGender">
              <FormControlLabel value="Female" control={<Radio size="small" />} label="Female" />
              <FormControlLabel value="Male" control={<Radio size="small" />} label="Male" />
              <FormControlLabel value="Others" control={<Radio size="small" />} label="Others" />
            </RadioGroup>
          </FormControl>

          <Button type="submit" variant="contained" size="small" color="success" fullWidth>
            Register
          </Button>

          <Typography align="center" variant="body2">
            Already Registered?{' '}
            <Button variant="text" size="small" onClick={() => navigate('/login')}>
              Login
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
