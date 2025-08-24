import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import { Formik } from 'formik';
import * as yup from 'yup';
import { tokens } from '../../theme';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { setAlert, setLoading, loadingComplete } from '../../redux/userReducers';
import { useNavigate } from 'react-router-dom';

const Form = ({ goal = null, setActive }) => {
  const isNonMobileScreen = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const { token, user, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [goals, setGoals] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    parent_id: -1,
    user_id: -1,
  });

  useEffect(() => {
    document.title = "ProFectivity - Goals";
    setActive("Goals")
    const fetch = async () => {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/goal/incompleted', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGoals(response.data.goals);
    }
    fetch();
    flatpickr("#deadline", {
      enableTime: true,
      dateFormat: "Y-m-d",
      onChange: function (date) {
        const todyDate = new Date(date);

        const year = todyDate.getFullYear();
        const month = String(todyDate.getMonth() + 1).padStart(2, '0'); // Month starts from 0
        const day = String(todyDate.getDate()).padStart(2, '0');
        const hours = String(todyDate.getHours()).padStart(2, '0');
        const minutes = String(todyDate.getMinutes()).padStart(2, '0');
        const seconds = String(todyDate.getSeconds()).padStart(2, '0');
        setFormData({ ...formData, deadline: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` });
      }
    });
  }, [])

  const handleSubmit = async (data, { setSubmitting }) => {

    if (!data.title || !data.description) {
      setSubmitting(false);
      return;
    }

    dispatch(setLoading());
    formData.user_id = user.id;
    if (formData.parent_id === -1)
      delete formData.parent_id;
    formData.title = data.title;
    formData.description = data.description;
    if (!goal) {
      try {
        const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/goal/create', formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data.success);
        if (response.data.success) {
          const payload = {
            type: 'success',
            message: 'Goal created Successfully'
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
          message: error.response?.data?.status === 401 ? "You can create goal with only your account" : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }
    }
    else {
      if (formData.deadline === '')
        formData.deadline = goal.deadline;
      try {
        const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/goal/${goal.id}/update`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data.success);
        if (response.data.success) {
          const payload = {
            type: 'success',
            message: 'Goal updated Successfully'
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
          message: error.response?.data?.status === 401 ? "You can update goal with only your account" : errorMessage,
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
    deadline: '',
    parent_id: -1
  }

  const goalSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
  })

  return (
    <Box width='100%'>
      <Box m='15px'>
        <Header title={!goal ? 'Create new Goal' : 'Update Goal'} subtitle={!goal ? `"If your Goals don't scare you they aren't Big enough"` : `"Discipline is the bridge between goals and accomplishment."`} />
        <Formik
          onSubmit={handleSubmit}
          initialValues={!goal ? initialValues : goal}
          validationSchema={goalSchema}
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
                <Box gridColumn='span 2'>
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
                  <TextField
                    fullWidth
                    name='deadline'
                    value={formData.deadline ? new Date(formData.deadline).toLocaleString() : '' || values.deadline}
                    variant='filled'
                    type='text'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched.deadline && errors.deadline}
                    label="Deadline"
                    id='deadline'
                    helperText={touched.deadline && errors.deadline}
                    sx={{ gridColumn: 'span 2', mb: '10px' }}
                  />
                  <FormControl fullWidth variant='filled' >
                    <InputLabel>Parent Goal</InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={formData.parent_id}
                      onChange={(e) => {
                        setFormData({ ...formData, parent_id: e.target.value })
                        handleChange(e);
                      }}
                      name='parent_id'
                    >
                      <MenuItem value={-1}>
                        It has no parent Goal
                      </MenuItem>
                      {goals.length > 0 && goals.map((goal) => (
                        <MenuItem key={goal.id} value={goal.id} >{goal.title}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box display='flex' justifyContent='end' mt='15px'>
                <Button type='submit' variant='contained' color='secondary'>{!goal ? 'Create' : 'update'}</Button>
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

