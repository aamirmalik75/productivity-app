import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, IconButton, Modal, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { loadingComplete, setAlert, setLoading } from '../../redux/userReducers';
import axios from 'axios';
import Header from '../../components/Header';
import CustomCard from '../../components/CustomCard';
import { Formik } from 'formik';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import { last_opened } from '../../utils/Last_Opened'

const Ideas = ({ setActive }) => {
  const [ideas, setIdeas] = useState(null);
  const [order, setOrder] = useState('Both');
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const isNonMobileScreen = useMediaQuery("(min-width: 600px)");
  const isNonMediumScreen = useMediaQuery("(min-width: 1000px)");
  const navigate = useNavigate();
  const [deletingIdeaId, setDeletingIdeaId] = useState(-1);
  const [fullfilledIdeaId, setFullfilledIdeaId] = useState(-1);

  const customStyle = isNonMobileScreen ?
    { m: '0.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: colors.primary[500], p: '5px', mb: '15px' }
    : {
      m: '0.3rem', display: 'grid', alignItems: 'center', gap: '5px', gridTemplateColumns: 'repeat(2,1fr)', background: colors.primary[500], p: '0.3rem'
    }

  const customBorder = {
    border: `3px solid red`
  }

  const { token, loading } = useSelector(state => state.user);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = "ProFectivity - Idea's";
    setActive("Idea's")
    last_opened("Idea's", token);
    dispatch(setLoading());
    if (order === 'Both') {
      const fetch = async () => {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/idea/userIdeas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIdeas(response.data.ideas);
        dispatch(loadingComplete());
      }
      fetch();
    }
    if (order === 'Professional') {
      const fetch = async () => {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/idea/userIdeas/professional', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIdeas(response.data.ideas);
        dispatch(loadingComplete());
      }
      fetch();
    }
    if (order === 'Personal') {
      const fetch = async () => {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/idea/userIdeas/personal', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIdeas(response.data.ideas);
        dispatch(loadingComplete());
      }
      fetch();
    }

  }, [order]);

  const confirmationAction = async () => {
    dispatch(setLoading());

    if (deletingIdeaId !== -1) {
      try {
        const response = await axios.delete(import.meta.env.VITE_SERVER_URL + `/api/idea/${deletingIdeaId}/delete`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (response.data.success) {
          dispatch(setAlert({ type: 'success', message: response.data.message }))
          dispatch(loadingComplete());
          window.location.reload();
        } else {
          const payload = {
            type: 'error',
            message: response.data.error || 'Something went wrong please try later!'
          };
          dispatch(setAlert(payload));
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
        const payload = {
          type: 'error',
          message: error.response?.status === 401 ? "You can delete only your ideas" : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
        setDeletingIdeaId(-1);
      }
    }
    else {
      try {
        const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/idea/${fullfilledIdeaId}/fullfilled`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (response.data.success) {
          dispatch(setAlert({ type: 'success', message: response.data.message }))
          dispatch(loadingComplete());
          window.location.reload();
        } else {
          const payload = {
            type: 'error',
            message: response.data.error || 'Something went wrong please try later!'
          };
          dispatch(setAlert(payload));
          console.log(response.data.authorizedId);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
        const payload = {
          type: 'error',
          message: error.response?.status === 401 ? "You can Fullfilled only your ideas" : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
        setFullfilledIdeaId(-1);
      }
    }
  }

  return (
    <Box m='15px'>
      <Header title="IDEA' S" subtitle={`"Small minds discuss people, Average minds discuss events, Great minds discuss IDEAS"`} />
      <Box sx={customStyle} >
        <Box display={isNonMobileScreen ? 'flex' : ''} gridColumn={isNonMobileScreen ? undefined : 'span 2'} alignItems='center'>
          <Box sx={{ border: order === 'Both' ? customBorder.border : null, background: 'linear-gradient(to right, #121212 50%, #ffffff 50%)', width: isNonMobileScreen && isNonMediumScreen ? '30px' : '15px', height: isNonMobileScreen && isNonMediumScreen ? '30px' : '15px', borderRadius: '50%', mr: '5px', cursor: 'pointer' }} onClick={() => setOrder("Both")} ></Box>
          <Typography sx={{ color: 'red', mr: '10px', fontWeight: '600' }} variant='h6'  >Both</Typography>
          <Box sx={{ border: order === 'Professional' ? customBorder.border : null, background: '#121212', width: isNonMobileScreen && isNonMediumScreen ? '30px' : '15px', height: isNonMobileScreen && isNonMediumScreen ? '30px' : '15px', borderRadius: '50%', mr: '5px', cursor: 'pointer' }} onClick={() => setOrder("Professional")}></Box>
          <Typography sx={{ color: 'red', mr: '10px', fontWeight: '600' }} variant='h6' >Professional</Typography>
          <Box sx={{ border: order === 'Personal' ? customBorder.border : null, background: '#ffffff', width: isNonMobileScreen && isNonMediumScreen ? '30px' : '15px', height: isNonMobileScreen && isNonMediumScreen ? '30px' : '15px', borderRadius: '50%', mr: '5px', cursor: 'pointer' }} onClick={() => setOrder("Personal")}></Box>
          <Typography sx={{ color: 'red', mr: '10px', fontWeight: '600' }} variant='h6' >Personal</Typography>
        </Box >
        <Button sx={{ gridColumn: isNonMobileScreen ? undefined : 'span 2' }} variant='contained' onClick={() => navigate('/idea/create')} >Create New Idea</Button>
      </Box >
      <Box display='grid' gridTemplateColumns={(!isNonMobileScreen && !isNonMediumScreen ? 'repeat(1,1fr)' : '') || (isNonMediumScreen && isNonMobileScreen ? 'repeat(3,1fr)' : 'repeat(2,1fr)')} gap='10px' >
        {ideas?.map((idea) => (
          <CustomCard key={idea.id} idea={idea} setOpen={setOpen} setDeletingIdeaId={setDeletingIdeaId} setFullfilledIdeaId={setFullfilledIdeaId} />
        ))}
      </Box>
      {
        ideas?.length === 0 && (
          <Typography textAlign='center' variant='h2' >No Ideas </Typography>
        )
      }
      <Box display='flex' alignItems='center' justifyContent='center' mt='5px' >
        {loading &&
          (
            <CircularProgress color='secondary' />
          )
        }
      </Box>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
          p: '5px',
          position: 'absolute',
          top: '30%', borderRadius: '5px',
          left: '50%', width: isNonMediumScreen ? '50%' : '90%', backgroundColor: colors.grey[500], transform: 'translate(-50%, -50%)',
        }}>
          <Typography sx={{ color: colors.primary[500] }} variant='h4' >Are you really want to {deletingIdeaId === -1 ? 'fullfilled this ' : 'delete this'}  idea?</Typography>
          <Box display='flex'>
            <Button variant='contained' sx={{ mr: '5px' }} onClick={() => { setOpen(false); confirmationAction() }}>Yes</Button>
            <Button variant='contained' onClick={() => { setDeletingIdeaId(-1); setFullfilledIdeaId(-1); setOpen(false) }} >No</Button>
          </Box>
        </Box>
      </Modal >

    </Box >
  )
}

export default Ideas;

