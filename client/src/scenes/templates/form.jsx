import { Box, Button, CircularProgress, TextField, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Formik } from 'formik';
import * as yup from 'yup';
import { loadingComplete, setAlert, setLoading } from '../../redux/userReducers';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const TemplateForm = ({setActive}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams()
  const { token, loading } = useSelector(state => state.user);
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');

  const [data, setData] = useState({
    "name": '',
    "00:00:00-00:30:00": '',
    "00:30:00-01:00:00": '',
    "01:00:00-01:30:00": '',
    "01:30:00-02:00:00": '',
    "02:00:00-02:30:00": '',
    "02:30:00-03:00:00": '',
    "03:00:00-03:30:00": '',
    "03:30:00-04:00:00": '',
    "04:00:00-04:30:00": '',
    "04:30:00-05:00:00": '',
    "05:00:00-05:30:00": '',
    "05:30:00-06:00:00": '',
    "06:00:00-06:30:00": '',
    "06:30:00-07:00:00": '',
    "07:00:00-07:30:00": '',
    "07:30:00-08:00:00": '',
    "08:00:00-08:30:00": '',
    "08:30:00-09:00:00": '',
    "09:00:00-09:30:00": '',
    "09:30:00-10:00:00": '',
    "10:00:00-10:30:00": '',
    "10:30:00-11:00:00": '',
    "11:00:00-11:30:00": '',
    "11:30:00-12:00:00": '',
    "12:00:00-12:30:00": '',
    "12:30:00-13:00:00": '',
    "13:00:00-13:30:00": '',
    "13:30:00-14:00:00": '',
    "14:00:00-14:30:00": '',
    "14:30:00-15:00:00": '',
    "15:00:00-15:30:00": '',
    "15:30:00-16:00:00": '',
    "16:00:00-16:30:00": '',
    "16:30:00-17:00:00": '',
    "17:00:00-17:30:00": '',
    "17:30:00-18:00:00": '',
    "18:00:00-18:30:00": '',
    "18:30:00-19:00:00": '',
    "19:00:00-19:30:00": '',
    "19:30:00-20:00:00": '',
    "20:00:00-20:30:00": '',
    "20:30:00-21:00:00": '',
    "21:00:00-21:30:00": '',
    "21:30:00-22:00:00": '',
    "22:00:00-22:30:00": '',
    "22:30:00-23:00:00": '',
    "23:00:00-23:30:00": '',
    "23:30:00-24:00:00": ''
  });

  useEffect(() => {
    document.title = `ProFectivity - Schedules`;
    setActive("Schedules")
    if (params.id) {
      const fetch = async () => {
        dispatch(setLoading());
        try {
          const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/template/${params.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          if (response.data.success) {
            setData({ name: response.data.template.name, ...JSON.parse(response.data.template.template) })
          }
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
          const payload = {
            type: 'error',
            message: error.response?.data?.status === 401 ? "You can fetch your own schedule template" : errorMessage,
          }
          dispatch(setAlert(payload));
        } finally {
          dispatch(loadingComplete());
        }
      }
      fetch()
    }
  }, [params.id])

  const handleSubmit = async () => {
    console.log('sub')
    const name = data.name;
    let newData = data;
    delete newData.name;
    const dataString = JSON.stringify(newData);
    let requestedData = {
      template: dataString,
      name: name,
    };
    dispatch(setLoading());
    if (!params.id) {
      try {
        const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/template/create', requestedData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        if (response.data.success) {
          const payload = {
            type: 'success',
            message: response.data.message,
          }
          dispatch(setAlert(payload));
          dispatch(loadingComplete());
          navigate('/schedule/template');
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
          message: error.response?.data?.status === 401 ? "You can create schedule template with only your account" : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }
    } else {
      try {
        const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/template/${params.id}/update`, requestedData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        if (response.data.success) {
          const payload = {
            type: 'success',
            message: response.data.message,
          }
          dispatch(setAlert(payload));
          dispatch(loadingComplete());
          navigate('/schedule/template');
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
          message: error.response?.data?.status === 401 ? "You can update your own schedule template" : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }
    }
  }

  return (
    <Box m='15px' >
      <Header title={!params.id ? 'Create New Template' : 'Update Template'} />
      <Formik
        initialValues={data}
        onSubmit={handleSubmit}
        validationSchema={yup.object().shape({
          name: yup.string().required()
        })}
      >
        {({ values, errors, touched, handleSubmit, handleBlur, handleChange }) => (
          <form onSubmit={handleSubmit} >
            <Box
              display='grid'
              gap='10px'
              gridTemplateColumns='repeat(4,minmax(0,1fr))'
            >
              <TextField
                fullWidth
                name='name'
                value={data.name || values.name}
                variant='filled'
                type='text'
                label='Name of Schedule'
                onBlur={handleBlur}
                error={touched.name && errors.name}
                helperText={touched.name && errors.name}
                onChange={(e) => {
                  setData({ ...data, name: e.target.value });
                  handleChange(e);
                }}
                sx={{ gridColumn: 'span 4', mb: '10px' }}
              />
              {Object.entries(data).map(([key, value]) => {
                if (key !== 'name') {
                  return (
                    <TextField
                      fullWidth
                      name={key}
                      value={value}
                      variant='filled'
                      type='text'
                      label={`Schedule: ${key}`}
                      onChange={(e) => {
                        setData({ ...data, [key]: e.target.value })
                      }}
                      sx={{ gridColumn:isNonMobileScreen ? 'span 1':'span 2', mb: '10px' }}
                    />
                  )
                }
              })}
            </Box>
            <Button type='submit' variant='contained' color='secondary' onClick={handleSubmit} >{!params.id ? "Submit" : "Update"}</Button>
          </form>
        )}
      </Formik>
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

export default TemplateForm
