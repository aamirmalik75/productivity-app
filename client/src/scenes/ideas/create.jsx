import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import { Formik } from 'formik';
import * as yup from 'yup';
import { tokens } from '../../theme';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setLoading, loadingComplete } from '../../redux/userReducers';
import { useNavigate } from 'react-router-dom';

const Form = ({ idea = null, setActive }) => {
  const isNonMobileScreen = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const { token, user, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // dispatch(loadingComplete())

  useEffect(() => {
    document.title = "ProFectivity - Idea's";
    setActive("Idea's");
  }, [])

  const [formData, setFormData] = useState(!idea ? {
    title: '',
    description: '',
    category: 'Personal',
  } : {
    title: idea.title,
    description: idea.description,
    category: idea.category,
  });

  const handleSubmit = async (data) => {

    dispatch(setLoading);

    if (!idea) {
      try {
        const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/idea/create', formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data.success);
        if (response.data.success) {
          const payload = {
            type: 'success',
            message: 'Idea created Successfully'
          }
          dispatch(setAlert(payload));
          dispatch(loadingComplete());
          navigate('/ideas');
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
          message: error.response?.data?.status === 401 ? "You can create idea with only your account" : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }
    }
    else {
      try {
        const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/idea/${idea.id}/update`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data.success);
        if (response.data.success) {
          const payload = {
            type: 'success',
            message: 'Idea updated Successfully'
          }
          dispatch(setAlert(payload));
          dispatch(loadingComplete());
          navigate('/ideas');
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
          message: error.response?.data?.status === 401 ? "You can update idea with only your account" : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }
    }
  }

  const ideaSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    category: yup.string().required("Category is required"),
  })

  return (
    <Box width='100%'>
      <Box m='15px'>
        <Header title={!idea ? 'Create new Idea' : 'Update Idea'} subtitle={!idea ? `"Everything begins with an idea"` : `"New information makes new and fresh ideas possible."`} />
        <Formik
          onSubmit={handleSubmit}
          initialValues={formData}
          validationSchema={ideaSchema}
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
                <Box gridColumn='span 4'>
                  <TextField
                    fullWidth
                    name='title'
                    value={values.title}
                    variant='filled'
                    type='text'
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setFormData({ ...formData, title: e.target.value })
                    }}
                    error={touched.title && errors.title}
                    label="Title"
                    helperText={touched.title && errors.title}
                    sx={{ gridColumn: 'span 2', mb: '10px' }}
                  />
                  <TextField
                    fullWidth
                    name='description'
                    value={values.description}
                    variant='filled'
                    type='text'
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e)
                      setFormData({ ...formData, description: e.target.value });
                    }}
                    error={touched.description && errors.description}
                    label="Description"
                    helperText={touched.description && errors.description}
                    sx={{ gridColumn: 'span 2' }}
                  />
                </Box>
                <Box gridColumn='span 2'>
                  <FormControl fullWidth variant='filled' >
                    <InputLabel>Idea Category</InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={formData.category}
                      onChange={(e) => {
                        setFormData({ ...formData, category: e.target.value })
                        handleChange(e);
                      }}
                      name='category'
                    >
                      <MenuItem value='Personal'>
                        Personal
                      </MenuItem>
                      <MenuItem value='Professional'>
                        Professional
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box display='flex' justifyContent='end' mt='15px'>
                <Button type='submit' variant='contained' color='secondary'>{!idea ? 'Create' : 'update'}</Button>
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

