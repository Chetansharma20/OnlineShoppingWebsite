import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux'
import axios from 'axios'
const CompleteProfile = () => {

    const[phone, setPhone] = useState('')
    const navigate = useNavigate()
 
  const { userData } = useSelector((state) => state.user);
  console.log(userData)
  const handleSubmit = async ()=>
  {
    if (!phone.match(/^\d{10}$/)) 
    {
        alert("please enter a 10 digit valid phone number")
        return 
        
    }
    try
    {
        await axios.put("http://localhost:5000/api/updateuser",
            {
            userId: userData._id,
            userPhone: phone
        }, {withCredentials:true})
        navigate("/")
    } catch(error)
    {
        console.log(error)
        alert("try again")
    }
  };
  return (
   <Box sx={{ maxWidth: 400, mx: "auto", mt: 6, p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
        Complete Your Profile
      </Typography>
      <TextField
        label="Mobile Number"
        variant="outlined"
        fullWidth
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        type="tel"
        placeholder="Enter your mobile number"
        inputProps={{ maxLength: 10 }}
        sx={{ mb: 3 }}
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
        Save
      </Button>
    </Box>
  );
};

export default CompleteProfile