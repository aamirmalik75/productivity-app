import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Modal, Typography, useTheme, useMediaQuery, MenuItem } from '@mui/material';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loadingComplete, setAlert, setLoading } from '../../redux/userReducers';
import { tokens } from '../../theme';
import Calendar from '../../components/Calendar';
import MenuListComp from '../../components/MenuListComp';
import { last_opened } from '../../utils/Last_Opened'
import { MoreVertTwoTone } from '@mui/icons-material';

const Schedule = ({ setActive }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { token, loading } = useSelector(state => state.user);
  const [events, setEvents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [ID, setID] = useState(-1);
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');

  useEffect(() => {
    document.title = "ProFectivity - Schedules";
    setActive("Schedules")
    last_opened("Schedules", token);
    fetch();
  }, [theme])

  const fetch = async () => {
    dispatch(setLoading());
    try {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/schedule/show', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setEvents(response.data.schedules);
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
        message: error.response?.data?.status === 401 ? "You can retrieve schedules with only your account" : errorMessage,
      }
      dispatch(setAlert(payload));
    } finally {
      dispatch(loadingComplete());
    }
  };

  const handleComplete = async () => {
    if (selectedIds.length === 0) {
      dispatch(setAlert({ type: 'info', message: 'You not Selected any schedule' }));
      return;
    }
    dispatch(setLoading());
    try {
      const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/schedule/status`, {
        ids: selectedIds,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        const payload = {
          type: 'success',
          message: response.data.message
        }
        dispatch(setAlert(payload));
        selectedIds.forEach((i) => {
          setEvents(prev => {
            const updatedEvents = prev.map((e) => {
              console.log(e.id)
              if (e.id == i) {
                return { ...e, status: 'complete' };
              }
              return e;
            });
            return updatedEvents;
          });
        });
        setSelectedIds([]);
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
        message: error.response?.data?.status === 401 ? "You can update status of your schedules with only your account" : errorMessage,
      }
      dispatch(setAlert(payload));
    } finally {
      dispatch(loadingComplete());
    }
  }

  const handleUpdate = async () => {
    const title = prompt('Enter the title of this event');
    if (!title) {
      return;
    }

    dispatch(setLoading());
    try {
      const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/schedule/${ID}/update`, { title }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        const payload = {
          type: 'success',
          message: response.data.message
        }
        dispatch(setAlert(payload));
        setEvents([]);
        setSelectedIds([]);
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
        message: error.response?.data?.status === 401 ? "You can update your schedules with only your account" : errorMessage,
      }
      dispatch(setAlert(payload));
    } finally {
      dispatch(loadingComplete());
    }
  }

  const handleUpdateAll = async () => {
    if (selectedIds.length === 0) {
      dispatch(setAlert({ type: 'info', message: 'You not Selected any schedule' }));
      return;
    }

    const title = prompt('Enter the title for all this events');
    if (!title) {
      return;
    }

    dispatch(setLoading());
    try {
      const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/schedule/update`, { ids: selectedIds, title }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        const payload = {
          type: 'success',
          message: response.data.message
        }
        dispatch(setAlert(payload));
        selectedIds.forEach((i) => {
          setEvents(prev => {
            const updatedEvents = prev.map((e) => {
              console.log(e.id)
              if (e.id == i) {
                return { ...e, title: title };
              }
              return e;
            });
            return updatedEvents;
          });
        });
        setSelectedIds([]);
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
        message: error.response?.data?.status === 401 ? "You can update your schedules with only your account" : errorMessage,
      }
      dispatch(setAlert(payload));
    } finally {
      dispatch(loadingComplete());
    }
  }

  const handleVerified = async () => {
    if (selectedIds.length === 0) {
      dispatch(setAlert({ type: 'info', message: 'You not Selected any schedule' }));
      return;
    }
    dispatch(setLoading());
    try {
      const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/schedule/verify`, {
        ids: selectedIds,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        const payload = {
          type: 'success',
          message: response.data.message
        }
        dispatch(setAlert(payload));
        selectedIds.forEach((i) => {
          setEvents(prev => prev.map((e) => e.id == i ? { ...e, isVerified: "1" } : e))
        })
        setSelectedIds([]);
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
        message: error.response?.data?.status === 401 ? "You can create your schedules verified with only your account" : errorMessage,
      }
      dispatch(setAlert(payload));
    } finally {
      dispatch(loadingComplete());
    }
  }

  const handleCompleteVerified = async () => {
    if (selectedIds.length === 0) {
      dispatch(setAlert({ type: 'info', message: 'You not Selected any schedule' }));
      return;
    }
    dispatch(setLoading());
    try {
      const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/schedule/completeVerify`, {
        ids: selectedIds,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        const payload = {
          type: 'success',
          message: response.data.message
        }
        dispatch(setAlert(payload));
        selectedIds.forEach((i) => {
          setEvents(prev => prev.map((e) => e.id == i ? { ...e, status: 'complete', isVerified: "1" } : e))
        })
        setSelectedIds([]);
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
        message: error.response?.data?.status === 401 ? "You can complete and verified your schedules with only your account" : errorMessage,
      }
      dispatch(setAlert(payload));
    } finally {
      dispatch(loadingComplete());
    }
  }

  return (
    <Box m='15px' >
      <Header title='Schedules' subtitle='Your daily schedule reflects your deepest values.' />
      <Box display='flex' justifyContent='space-between' m='10px 0px' >
        {
          isNonMediumScreen ?
            <Box>
              <Button variant='contained' color='success' sx={{ mr: '0.3rem' }} onClick={handleComplete} >Complete</Button>
              <Button variant='contained' color='info' sx={{ mr: '0.3rem' }} onClick={handleVerified}>Verify Schedule</Button>
              <Button variant='contained' color='inherit' sx={{ mr: '0.3rem' }} onClick={handleCompleteVerified}>Complete And Verify</Button>
              <Button variant='contained' color='warning' sx={{ mr: '0.3rem' }} onClick={handleUpdateAll}>Update</Button>
            </Box>
            :
            <Box display='flex' alignItems='center' >
              <Typography variant='h5' >Menu</Typography>
              <MenuListComp
                parent={MoreVertTwoTone} menuColor={theme.palette.mode === 'dark' ? colors.darkTopColor : theme.palette.background.default} anchorEl={anchorEl} setAnchorEl={setAnchorEl}
              >
                <MenuItem variant='contained' color='success' sx={{ mr: '0.3rem' }} onClick={handleComplete} >Complete</MenuItem>
                <MenuItem variant='contained' color='info' sx={{ mr: '0.3rem' }} onClick={handleVerified}>Verify Schedule</MenuItem>
                <MenuItem variant='contained' color='inherit' sx={{ mr: '0.3rem' }} onClick={handleCompleteVerified}>Complete And Verify</MenuItem>
                <MenuItem variant='contained' color='warning' sx={{ mr: '0.3rem' }} onClick={handleUpdateAll}>Update</MenuItem>
                <MenuItem variant='contained' color='secondary' onClick={() => navigate('/schedule/template')} >Add Schedule</MenuItem>
              </MenuListComp>
            </Box>
        }
        {
          isNonMediumScreen && <Button variant='contained' color='secondary' onClick={() => navigate('/schedule/template')} >Add Schedule</Button>
        }
      </Box>
      <Box sx={{ width: '100%' }} >
        {events.length > 0 && <Calendar data={events} selectedIds={selectedIds} setSelectedIds={setSelectedIds} setID={setID} handleUpdate={handleUpdate} />}
      </Box>
      {!loading && events.length === 0 && <Typography variant='h2' sx={{ color: colors.redAccent[500], fontWeight: '600', textAlign: 'center' }} >Not any Schedule Found</Typography>}
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

export default Schedule

