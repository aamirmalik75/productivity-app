import { Box, Button, CircularProgress, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup';
import Header from '../../components/Header';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadingComplete, setAlert, setLoading } from '../../redux/userReducers';
import { tokens } from '../../theme';

const SignUp = () => {
  const navigate = useNavigate();
  const isNonMobileScreen = useMediaQuery("(min-width: 600px)");
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const { user, loading } = useSelector(state => state.user);

  useEffect(() => {
    document.title = `ProFectivity - Registration`;
    if (user)
      navigate('/');
  })

  const handleSubmit = async (data) => {
    dispatch(setLoading());
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/auth/register', data);
      if (response.data.success) {
        const payload = {
          type: 'success',
          message: 'Account Created Successfully'
        }
        dispatch(setAlert(payload));
        dispatch(loadingComplete());
        navigate('/sign-in');
      } else {
        const payload = {
          type: 'error',
          message: response.data.error || 'Something went wrong please try later!'
        }
        dispatch(setAlert(payload));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
      const payload = {
        type: 'error',
        message: errorMessage,
      }
      dispatch(setAlert(payload));
    } finally {
      dispatch(loadingComplete());
    }
  };

  const initialValues = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  };

  const userSchema = yup.object().shape({
    name: yup.string().required('required'),
    email: yup.string().email('This email is invalid').required('required'),
    password: yup.string().required('required').min(6, 'Password must be at least 6 characters'),
    password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('required'),
  });

  return (
    <Box m={isNonMobileScreen ? '8rem auto' : '7rem auto'} width={isNonMobileScreen ? '50%' : '100%'}>
      <Header title='Sign Up' />
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
      >
        {({ values, errors, touched, handleSubmit, handleBlur, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display='grid'
              gap='20px'
              sx={{
                "& > div": { gridColumn: isNonMobileScreen ? undefined : 'span 4' }
              }}
              gridTemplateColumns='repeat(4,minmax(0,1fr))'
            >
              <TextField
                fullWidth
                name='name'
                value={values.name}
                variant='filled'
                type='text'
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.name && errors.name}
                label="Name"
                helperText={touched.name && errors.name}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                fullWidth
                name='email'
                value={values.email}
                variant='filled'
                type='email'
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.email && errors.email}
                label="Email"
                helperText={touched.email && errors.email}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                fullWidth
                name='password'
                value={values.password}
                variant='filled'
                type='password'
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.password && errors.password}
                label="Password"
                helperText={touched.password && errors.password}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                name='password_confirmation'
                value={values.password_confirmation}
                variant='filled'
                type='password'
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.password_confirmation && errors.password_confirmation}
                label="Confirm Password"
                helperText={touched.password_confirmation && errors.password_confirmation}
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
            <Box display='flex' justifyContent='end' mt='15px'>
              <Button type='submit' variant='contained' color='secondary'>Sign Up</Button>
            </Box>
          </form>
        )}
      </Formik>
      <Box display='flex' gap='5px'>
        <Typography>Already have an account? </Typography>
        <Link to='/sign-in' style={{ color: colors.redAccent[500] }}>Sign In</Link>
      </Box>
      <Box display='flex' alignItems='center' justifyContent='center' >
        {loading &&
          (
            <CircularProgress color='secondary' />
          )
        }
      </Box>
    </Box>
  )
}

export default SignUp;
