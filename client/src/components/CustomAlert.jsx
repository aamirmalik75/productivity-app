import { Alert } from '@mui/material'
import React from 'react'
import { alertComplete } from '../redux/userReducers'
import { useDispatch, useSelector } from 'react-redux'

const CustomAlert = () => {
  const dispatch = useDispatch();
  const { alertType, alertMessage } = useSelector(state => state.user);
  setTimeout(() => dispatch(alertComplete()), 5000);
  return (
    <Alert sx={{alignItems: 'center', position: 'absolute', bottom: '10px', right: '10px', width: '50%', zIndex: 100 , color: '#fff' }} variant='filled' severity={alertType} onClose={() => dispatch(alertComplete())} >
      {alertMessage}
    </Alert>
  )
}

export default CustomAlert
