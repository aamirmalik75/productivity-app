import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import { Formik } from 'formik';
import * as yup from 'yup';
import { tokens } from '../../theme';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import 'flatpickr/dist/flatpickr.min.css';
import { setAlert, setLoading, loadingComplete } from '../../redux/userReducers';
import { useNavigate, useParams } from 'react-router-dom';

const Form = ({ feedback = null, setActive }) => {
  const isNonMobileScreen = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const { token, user, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  // dispatch(loadingComplete())

  useEffect(() => {
    document.title = "ProFectivity - Goals";
    setActive("Goals");
  }, [])

  const handleSubmit = async (data) => {
    dispatch(setLoading());
    if (!feedback) {
      try {
        const response = await axios.post(import.meta.env.VITE_SERVER_URL + `/api/feedback/${params.id}/create`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          const payload = {
            type: 'success',
            message: 'Feedback created Successfully'
          }
          dispatch(setAlert(payload));
          dispatch(loadingComplete());
          navigate('/goals');
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
          message: error.response?.data?.status === 401 ? "You can create feedback on your own goal with only your account" : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }
    }
    else {
      try {
        const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/feedback/${params.id}/goal/${params.feedbackId}/update`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          const payload = {
            type: 'success',
            message: 'Feedback updated Successfully'
          }
          dispatch(setAlert(payload));
          dispatch(loadingComplete());
          navigate('/goals');
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
          message: error.response?.data?.status === 401 ? "You can update feedback of your own goal with only your account" : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }
    }
  }

  const initialValues = {
    title: '',
    description: '',
  }

  const feedbackSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
  })

  return (
    <Box width='100%'>
      <Box m='15px'>
        <Header title={!feedback ? 'Add new Feedback' : 'Update Feedback'} subtitle={!feedback ? `"We all need people who will give us feedback. That's how we improve."` : `"Discipline is the bridge between goals and accomplishment."`} />
        <Formik
          onSubmit={handleSubmit}
          initialValues={!feedback ? initialValues : feedback}
          validationSchema={feedbackSchema}
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
                  name='title'
                  value={values.title}
                  variant='filled'
                  type='text'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.title && errors.title}
                  label="Title"
                  helperText={touched.title && errors.title}
                  sx={{ gridColumn: 'span 4', mb: '10px' }}
                />
                <TextField
                  fullWidth
                  name='description'
                  value={values.description}
                  variant='filled'
                  type='text'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.description && errors.description}
                  label="Description"
                  helperText={touched.description && errors.description}
                  sx={{ gridColumn: 'span 4' }}
                />
              </Box>
              <Box display='flex' justifyContent='end' mt='15px'>
                <Button type='submit' variant='contained' color='secondary'>{!feedback ? 'Create' : 'update'}</Button>
              </Box>
            </form>
          )}
        </Formik>
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

export default Form

