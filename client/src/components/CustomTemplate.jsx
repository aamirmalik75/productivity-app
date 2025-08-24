import React, { useEffect, useState } from 'react';
import { ThemeProvider, useTheme, Card, CardContent, Typography, IconButton, Box, Button, Accordion, AccordionSummary, AccordionDetails, useMediaQuery, MenuItem } from '@mui/material';
import { DeleteSharp, EditNoteSharp, ExpandMoreSharp } from '@mui/icons-material';
import { tokens } from '../theme';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadingComplete, setAlert, setLoading } from '../redux/userReducers.js';
import axios from 'axios';
import MenuListComp from './MenuListComp.jsx';

const Template = ({ template }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [data, setData] = useState([]);
  const { token } = useSelector(state => state.user);
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');

  useEffect(() => {
    const sch = JSON.parse(template.template);
    setSchedules(sch);
    Object.entries(sch).map(([key, value]) => {
      setData(prev => [...prev, { title: value, start: key.split('-')[0], end: key.split('-')[1] }])
    })
    data.shift();
    return () => {
      setData([]);
    }
  }, []);

  const handleDelete = async () => {
    if (window.confirm(`Are you really want to delete this "${template.name}" template?`)) {
      dispatch(setLoading());
      try {
        const response = await axios.delete(import.meta.env.VITE_SERVER_URL + `/api/template/${template.id}/delete`,
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
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
        const payload = {
          type: 'error',
          message: error.response?.data?.status === 401 ? "You can delete your own schedule template" : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }
    }
  }

  const handleUpdate = () => {
    navigate(`/schedule/template/${template.id}/update`);
  }

  const handleScheduleSubmit = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(today.getDate()).padStart(2, '0'); // Add leading zero if needed
    const formattedDate = `${year}-${month}-${day}`;

    dispatch(setLoading());
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_URL + `/api/schedule/create`, {
        schedules: data,
        template_id: template.id,
        date: formattedDate,
      },
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
        navigate('/schedule');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
      const payload = {
        type: 'error',
        message: error.response?.data?.status === 401 ? "You can create schedule with your account" : errorMessage,
      }
      dispatch(setAlert(payload));
    } finally {
      dispatch(loadingComplete());
    }
  }

  return (
    <ThemeProvider theme={theme} >
      <Card sx={{ borderRadius: '5px', p: '5px', width: '100%', maxWidth: '100%', background: theme.palette.mode === 'dark' ? colors.darkTopColor : '#e9fce9', color: colors.primary[500] }}>
        <Accordion sx={{ width: '100%', color: '#fff', }}>
          <AccordionSummary
            expandIcon={<ExpandMoreSharp sx={{ color: '#fff' }} />}
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{ width: '100%', color: '#fff', background: theme.palette.mode === 'dark' ? colors.darkTopColor : '#e9fce9' }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', color: colors.text, width: '90%', background: theme.palette.mode === 'dark' ? colors.darkTopColor : '#e9fce9' }} >
              <Typography variant={isNonMobileScreen ? 'h3' : 'body1'} sx={{ mr: '0.5rem' }}>{template.name}</Typography>
              {
                isNonMobileScreen ?
                  <Box width='100%' >
                    <Button variant='contained' sx={{ background: theme.palette.mode === 'dark' ? colors.primary[500] : '#e9fce9' }} onClick={handleScheduleSubmit} >Add this Schedule</Button>
                    <IconButton onClick={handleUpdate} >
                      <EditNoteSharp sx={{ fontSize: '28px', color: theme.palette.mode === 'dark' ? colors.primary[500] : colors.text }} />
                    </IconButton>
                    <IconButton onClick={handleDelete} >
                      <DeleteSharp sx={{ fontSize: '28px', color: theme.palette.mode === 'dark' ? colors.primary[500] : colors.text }} />
                    </IconButton>
                  </Box>
                  :
                  <Box>
                    <MenuListComp>
                      <MenuItem variant='contained' onClick={handleScheduleSubmit} >Add this Schedule</MenuItem>
                      <IconButton onClick={handleUpdate} >
                        <EditNoteSharp sx={{ fontSize: '28px', color: colors.primary[500] }} />
                      </IconButton>
                      <IconButton onClick={handleDelete} >
                        <DeleteSharp sx={{ fontSize: '28px', color: colors.primary[500] }} />
                      </IconButton>
                    </MenuListComp>
                  </Box>
              }
            </CardContent>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ background: theme.palette.mode === 'dark' ? colors.darkTopColor : '#e9fce9', display: 'grid', gridTemplateColumns: isNonMobileScreen ? 'repeat(4,1fr)' : 'repeat(2,1fr)', gap: '10px' }}>
              {Object.entries(schedules).map(([key, value]) => (
                <Card key={key} sx={{ p: '10px' }}>
                  <Typography variant='h5'>{key}</Typography>
                  <Typography variant='h6'>{value}</Typography>
                </Card>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Card>
    </ThemeProvider >
  );
}

export default Template;
