import { Box, Button, CircularProgress, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup';
import Header from '../../components/Header';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadingComplete, setAlert, setLoading, storeUserData } from '../../redux/userReducers';
import { tokens } from '../../theme';

const SignIn = () => {
  const navigate = useNavigate();
  const isNonMobileScreen = useMediaQuery("(min-width: 600px)");
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const { user, loading } = useSelector(state => state.user);

  useEffect(() => {
    document.title = `ProFectivity - Authentication`;
    if (user)
      navigate('/');
  })

  const handleSubmit = async (data) => {
    dispatch(setLoading());
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/auth/login', data);
      if (response.data.success) {
        dispatch(storeUserData(response.data));
        const payload = {
          type: 'success',
          message: 'Logged in Successfully'
        }
        dispatch(setAlert(payload));
        dispatch(loadingComplete());
        setTimeout(() => {
          navigate(`/home/${response.data.user.id}`);
        }, 100);
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
        message: error.response?.data?.status === 401 ? "You can create goal with only your account" : errorMessage,
      }
      dispatch(setAlert(payload));
    } finally {
      dispatch(loadingComplete());
    }
  };

  const initialValues = {
    email: '',
    password: '',
  };

  const userSchema = yup.object().shape({
    email: yup.string().email('This email is invalid').required('required'),
    password: yup.string().required('required').min(6, 'Password must be at least 6 characters'),
  });

  return (
    <Box m={isNonMobileScreen ? '8rem auto' : '7rem auto'} width={isNonMobileScreen ? '50%' : '100%'}>
      <Header title='Sign In' />
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
                sx={{ gridColumn: 'span 4' }}
                autoComplete='off'
              />
            </Box>
            <Box display='flex' justifyContent='end' mt='15px'>
              <Button type='submit' variant='contained' color='secondary'>Sign In</Button>
            </Box>
          </form>
        )}
      </Formik>
      <Box display='flex' gap='5px'>
        <Typography>Want to make new account?</Typography>
        <Link to='/sign-up' style={{ color: colors.redAccent[500] }} >Sign Up</Link>
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

export default SignIn;
