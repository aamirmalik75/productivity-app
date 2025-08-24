import { Box, Button, CircularProgress, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import Template from '../../components/CustomTemplate';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { loadingComplete, setAlert, setLoading } from '../../redux/userReducers';

const Templates = ({ setActive }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, loading } = useSelector(state => state.user);
  const [templates, setTemplates] = useState([]);
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');

  useEffect(() => {
    document.title = `ProFectivity - Schedules`;
    setActive("Schedules")
    fetch();
  }, []);
  const fetch = async () => {
    dispatch(setLoading());
    try {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/template/show',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      if (response.data.success) {
        setTemplates(response.data.templates);
        dispatch(loadingComplete());
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
        message: error.response?.data?.status === 401 ? "You can access your own schedule templates" : errorMessage,
      }
      dispatch(setAlert(payload));
    } finally {
      dispatch(loadingComplete());
    }
  }

  return (
    <Box m='15px' >
      <Header title='Schedule Templates' />
      <Box>
        <Button variant='contained' color='success' onClick={() => navigate('/schedule/template/create')} >Create new Template</Button>
      </Box>
      {!loading && <Box display='grid' gridTemplateColumns='repeat(1,1fr)' gap='20px' m='10px 0px'>
        {
          templates.map((template) => (
            <Template template={template} key={template.id} />
          ))
        }
      </Box>
      }
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

export default Templates
