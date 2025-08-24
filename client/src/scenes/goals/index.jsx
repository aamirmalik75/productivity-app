import { Box, Button, CircularProgress, FormControl, FormLabel, IconButton, MenuItem, Modal, Select, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { DeleteSharp, EditSharp, FeedbackSharp } from '@mui/icons-material';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadingComplete, setAlert, setLoading, setGoal, setFeedback } from '../../redux/userReducers';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuListComp from '../../components/MenuListComp';
import { statusOptions } from '../../config/Goal';
import { last_opened } from '../../utils/Last_Opened'

const Goals = ({ setActive }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const isNonMobileScreen = useMediaQuery('(min-width: 600px');
  const isNonMediumScreen = useMediaQuery('(min-width: 800px');

  const navigate = useNavigate();
  const { token, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [filterOption, setFilterOption] = useState('Incomplete');
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState([]);
  const [open, setOpen] = useState(false);
  const [goalID, setGoalID] = useState(-1);
  const [feedbacks, setFeedbacks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    document.title = "ProFectivity - Goals";
    setActive("Goals")
    last_opened("Goals", token);
    dispatch(setLoading());
    const fetch = async () => {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/goal/all?status=${filterOption}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGoals(response.data.goals);
      dispatch(loadingComplete());
    }
    fetch();
  }, [filterOption])

  const handleDelete = async () => {
    setAnchorEl(null);
    if (selectedGoal.length === 0) {
      dispatch(setAlert({ type: 'info', message: 'You not selected any Goal' }));
      return;
    }
    dispatch(setLoading());
    try {
      const response = await axios.put(import.meta.env.VITE_SERVER_URL + '/api/goal/delete', {
        selected_goal_ids: selectedGoal
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response.data.success) {
        dispatch(setAlert({ type: 'success', message: response.data.message }))
        dispatch(loadingComplete());

        selectedGoal.forEach((sg) => {
          setGoals(goals.filter((g) => g.id !== sg))
        })

        response.data.updatedParents.forEach((up) => {
          setGoals(prev => prev.map((g) => g.id === up.id ? { ...g, progress: up.progress } : g))
        });

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
        message: error.response?.status === 401 ? "You can delete only your goals" : errorMessage,
      }
      dispatch(setAlert(payload));
    } finally {
      dispatch(loadingComplete());
    }
  }

  const handleCompleteGoal = async () => {
    setAnchorEl(null);
    if (selectedGoal.length === 0) {
      dispatch(setAlert({ type: 'info', message: 'You not selected any Goal' }));
      return;
    }

    dispatch(setLoading());
    try {
      const response = await axios.put(import.meta.env.VITE_SERVER_URL + '/api/goal/completed', {
        selected_goal_ids: selectedGoal
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response.data.success) {
        dispatch(setAlert({ type: 'success', message: response.data.message }))
        dispatch(loadingComplete());

        selectedGoal.forEach((sg) => {
          setGoals(goals.filter((g) => g.id !== sg))
        })

        response.data.updatedParents.forEach((up) => {
          setGoals(prev => prev.map((g) => g.id === up.id ? { ...g, progress: up.progress } : g))
        });

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
        message: error.response?.data?.status === 401 ? "You can complete only your goals" : errorMessage,
      }
      dispatch(setAlert(payload));
    } finally {
      dispatch(loadingComplete());
    }
  }

  const handleFeedbackClick = async (id) => {
    setGoalID(id);
    setOpen(true);
    try {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/feedback/${id}/show`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        const payload = {
          type: response.data.feedbacks.length > 0 ? 'success' : 'info',
          message: response.data.feedbacks.length > 0 ? 'Feedbacks Loaded Successfully' : 'No Feedback Exist',
        }
        dispatch(setAlert(payload));
        dispatch(loadingComplete());
        setFeedbacks(response.data.feedbacks);
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

  const handleDeleteFeedback = async (id) => {
    try {
      const response = await axios.delete(import.meta.env.VITE_SERVER_URL + `/api/feedback/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        const payload = {
          type: 'success',
          message: 'Feedbacks Deleted Successfully',
        }
        dispatch(setAlert(payload));
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
        message: error.response?.data?.status === 401 ? "You can delete feedback of your own goal with only your account" : errorMessage,
      }
      dispatch(setAlert(payload));
    } finally {
      setOpen(false);
      dispatch(loadingComplete());
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: isNonMobileScreen ? 120 : 80, headerAlign: 'left' },
    { field: 'title', headerName: 'Title', width: 120, headerAlign: 'left' },
    { field: 'description', headerName: 'Description', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'progress', headerName: 'Progress', renderCell: (params) => { return `${Math.round(params.row.progress)} %` }, width: isNonMobileScreen ? 120 : 90 },
    {
      field: 'deadline', headerName: 'Deadline', renderCell: (params) => {
        const deadline = params.row.deadline;
        return deadline ? deadline : 'NO Deadline';
      }, width: 120
    },
    {
      headerName: 'Action', headerAlign: 'center', renderCell: (params) => (
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }} >
          <IconButton onClick={() => { console.log(params.row); dispatch(setGoal(params.row)); navigate(`/goal/${params.row.id}/edit`) }} sx={{ alignSelf: 'center' }}>
            <EditSharp />
          </IconButton>
          <IconButton sx={{ alignSelf: 'center' }} onClick={() => handleFeedbackClick(params.row.id)}>
            <FeedbackSharp />
          </IconButton>
        </Box>
      )
    }
  ];

  const SelectComp = () => {
    return (
      <Box sx={{ m: '1rem 0' }} width={isNonMobileScreen ? '30%' : '100%'}>
        <FormLabel sx={{ mr: '.1rem', fontSize: isNonMobileScreen ? '16px' : '10px', fontWeight: 'bold' }} >Filter By: </FormLabel>
        <FormControl variant={isNonMobileScreen ? 'filled' : 'standard'} sx={{ width: '100%' }} >
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            defaultValue='Incomplete'
            name='filter_status'
            value={filterOption}
            onChange={(e) => {
              setFilterOption(e.target.value);
            }}
          >
            {
              Object.entries(statusOptions).map(([label, value]) => (
                <MenuItem key={label} value={value}>{label}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Box>
    )
  }

  return (
    <>
      <Box m='15px'>
        <Header title='GOALS' subtitle='"If you want to live a happy life, tie it to a Goal, Not to people or things"' />
        {
          isNonMobileScreen ?
            <Box mb='5px'>
              <Button onClick={handleDelete} variant='contained' color='error' sx={{ mr: '5px' }} >Delete</Button>
              <Button variant='contained' sx={{ mr: '5px' }} color='success' onClick={handleCompleteGoal}  >Complete</Button>
              <Button variant='contained' onClick={() => navigate('/goal/create')} sx={{ backgroundColor: colors.grey[500], float: 'right' }}  >Create new Goal</Button>
            </Box>
            :
            <Box display='flex' alignItems='center'>
              <Typography variant='h5' >Menu</Typography>
              <MenuListComp parent={MoreVertIcon} menuColor={theme.palette.mode === 'dark' ? colors.darkTopColor : theme.palette.background.default} anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
                <MenuItem onClick={handleDelete} variant='contained' color='error' sx={{ m: '5px', width: "100%" }} >Delete</MenuItem>
                <MenuItem variant='contained' sx={{ m: '5px', width: '100%' }} color='success' onClick={handleCompleteGoal}  >Complete</MenuItem>
                <MenuItem variant='contained' onClick={() => { setAnchorEl(null); navigate('/goal/create') }} sx={{ m: '5px', width: '100%' }}  >Create new Goal</MenuItem>
              </MenuListComp>
            </Box>
        }
        <SelectComp />
        <Box
          sx={{
            width: '100%',
            "& .name-cell": {
              color: colors.primary[500],
            },
            "& .MuiDataGrid-cell": {
              border: 'none',
            },
            "& .MuiDataGrid-columnHeaders": {
              background: theme.palette.mode === 'dark' ? colors.darkTopColor : colors.grey[300]
            },
            "& .MuiDataGrid-footerContainer": {
              background: theme.palette.mode === 'dark' ? colors.darkTopColor : colors.grey[300]
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`
            },
            "& .MuiCheckbox-root": {
              color: `${colors.primary[500]} !important`,
            },
            "& .css-1od5bei-MuiDataGrid-root .MuiDataGrid-withBorderColor": {
              border: 'none',
            }
          }}
        >
          <DataGrid checkboxSelection rows={goals} columns={columns} onRowSelectionModelChange={(newSelection) => { setSelectedGoal(newSelection) }} />
        </Box>
        <Box display='flex' alignItems='center' justifyContent='center' >
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
            top: '20%', borderRadius: '5px',
            left: '50%', width: isNonMediumScreen ? '50%' : '90%', backgroundColor: colors.grey[500], transform: 'translate(-50%, -50%)',
          }} >
            <Typography variant='h4' color='secondary' >Feedback About Goal</Typography>
            <Box width='100%'>
              <Button variant='contained' fullWidth sx={{ m: '5px 0px' }} onClick={() => navigate(`/feedback/${goalID}/create`)} >Add Feedback</Button>
              {feedbacks?.map((feedback) => (
                <Box sx={{ background: '#000', color: '#fff', p: '5px', borderRadius: '4px', m: '5px' }} >
                  <Box display='flex' alignItems='center' justifyContent='space-between'>
                    <Typography variant='h4' >{feedback.title}</Typography>
                    <Box>
                      <IconButton onClick={() => { dispatch(setFeedback(feedback)); navigate(`/${feedback.id}/feedback/${goalID}/update`) }} >
                        <EditSharp />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteFeedback(feedback.id)}>
                        <DeleteSharp />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography>{feedback.description}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Modal >
      </Box >
    </>
  )
}

export default Goals
