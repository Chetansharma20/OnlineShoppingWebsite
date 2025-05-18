import { Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'


const Profile = () => {
  const {userData} = useSelector((state)=> state.user)
  return (
    <div>
        <Typography variant='h5'>Email:{userData?.userEmail}</Typography>
        <Typography variant='h5'>password:{userData?.userPassword}</Typography>
    </div>
  )
}

export default Profile