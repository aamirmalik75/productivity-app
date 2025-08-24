import React, { useContext, useState } from 'react'
import { tokens, ColorModeContext } from '../../theme';
import { Badge, Box, Button, Chip, Dialog, DialogContent, IconButton, MenuItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import { CircleNotificationsSharp, DarkModeSharp, DeleteSweepTwoTone, DeveloperBoardTwoTone, LightModeSharp, LogoutSharp, UTurnLeftTwoTone } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUnRead, logOut, setAlert } from '../../redux/userReducers';
import { useEffect } from 'react';
import axios from 'axios';
import MenuListComp from '../../components/MenuListComp';
import ModeToggle from '../../components/ModeToggle';
import ColorBox from '../../components/ColorChip';
import CustomMenu from '../../components/CustomMenu';

const Topbar = ({ projects, setProjects }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const colorMode = useContext(ColorModeContext);
  const isNonMobileScreen = useMediaQuery("(min-width: 600px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, unRead } = useSelector(state => state.user);
  const [trashItems, setTrashItems] = useState([]);
  const [showThemes, setShowThemes] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (!user) {
      console.log("user: ", user);
      navigate('/sign-in');
    }
    else {
      const fetch = async () => {
        const res = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/notification/unreadNotifications', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data.success) {
          if (res.data.unReadNotifications.length > 0)
            dispatch(setUnRead(res.data.unReadNotifications.length));
          else
            dispatch(setUnRead(undefined));
        }
      }
      fetch();
    }
  }, []);

  const handleLogOut = async () => {
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.data.success) {
        dispatch(setAlert({ type: 'success', message: 'Logged Out Successfully!' }));
        dispatch(logOut());
        navigate('/sign-in');
      }
      else {
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
        message: errorMessage,
      }
      dispatch(setAlert(payload));
    }
  }

  const profileIcon = () => {
    return <Typography sx={{ width: '2rem', height: '2rem', backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', m: '0.2rem 1rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }} >
      {user && user.name[0]}
    </Typography>
  }

  const fetchTrashItems = async () => {
    const response = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/project/trash', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success) {
      setTrashItems(response.data.projects); // Populate trash items
    } else {
      dispatch(setAlert({ type: 'error', message: 'Failed to load trash items!' }));
    }
  };

  const handleTrashOpen = () => {
    setShowTrash(true);
    fetchTrashItems(); // Fetch trash items when the popup opens
  };

  const handleRemoveToTrash = async (id) => {
    const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/project/${id}/removeToTrash`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.data.success) {
      dispatch(setAlert({ type: 'error', message: "Something went Wrong try again!" }));
    }
    else {
      const restoredProject = trashItems.find(item => item.id === id);
      setProjects(prev => [...prev, restoredProject]);
      setTrashItems(prev => prev.filter(item => item.id !== id));

      dispatch(setAlert({ type: 'success', message: response.data.message }));
    }
  }

  const handleDeleteProject = async (id) => {
    const response = await axios.delete(import.meta.env.VITE_SERVER_URL + `/api/project/${id}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.data.success) {
      dispatch(setAlert({ type: 'error', message: "Something went Wrong try again!" }));
    }
    else {
      setTrashItems(prev => prev.filter(item => item.id !== id));

      dispatch(setAlert({ type: 'success', message: response.data.message }));
    }
  }

  return (
    <div >
      <Box position={'fixed'} zIndex={100} width={'100%'} display='flex' justifyContent='space-between' alignItems='center' p={.1} backgroundColor={theme.palette.mode === 'dark' ? colors.darkTopColor : colors.primary[300]} >
        <Link to={`/${user && user.id}`} style={{ textDecoration: 'none', margin: '0.2rem 1rem' }} >
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 500, color: theme.palette.mode === 'dark' ? '#fff' : '#000' }} >
            ProFectivity
          </Typography>
        </Link>
        <Box>

          <MenuListComp parent={profileIcon} menuColor={theme.palette.mode === 'dark' ? colors.darkTopColor : theme.palette.background.default} setShowThemes={setShowThemes} showThemes={showThemes} anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
            {
              showThemes ? (
                <>
                  <Box sx={{ p: '0.7rem' }}>
                    <Box>
                      <Typography variant='h3' sx={{ color: theme.palette.mode === 'dark' ? "#fff" : colors.darkTopColor }} >Themes</Typography>
                      <Typography variant='body1' mt={'0.5rem'} sx={{ color: theme.palette.mode === 'dark' ? '#87909e' : colors.grey[500] }} >Customize your Workspace by changing the appearance and theme color.</Typography>
                    </Box>
                    <Box>
                      <ModeToggle toggleMode={colorMode.toggleColorMode} />
                    </Box>
                    <Box>
                      <Typography variant='body2' sx={{ color: theme.palette.mode === 'dark' ? '#87909e' : colors.grey[500], mb: '0.5rem' }} >ProFectivity theme</Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }} >
                        {
                          Object.entries(colors.themeColors).map((color, i) => (
                            <ColorBox name={color[0]} color={color[1][theme.palette.mode].primary[500]} key={i} />
                          ))
                        }
                      </Box>
                    </Box>
                  </Box>
                </>
              ) :
                (
                  <>
                    <MenuItem variant='contained' sx={{ m: '5px', width: '100%' }} color='success' onClick={() => setShowThemes(true)} >Theme</MenuItem>
                    <MenuItem variant='contained' sx={{ m: '5px', width: '100%' }} onClick={() => { setAnchorEl(null); handleTrashOpen(); }} >Trash</MenuItem>
                    <MenuItem variant='contained' sx={{ m: '5px', width: '100%' }} onClick={() => { navigate('/notifications'); setAnchorEl(null) }} >
                      <Badge badgeContent={unRead} color='primary'>
                        Notifications
                      </Badge>
                    </MenuItem>
                    <MenuItem variant='contained' sx={{ m: '5px', width: '100%', display: 'block' }} onClick={() => { setAnchorEl(null); handleLogOut() }} >
                      Logout
                      <Typography>@{user && user.email.split('@')[0]}</Typography>
                    </MenuItem>
                  </>
                )
            }
          </MenuListComp>
        </Box >
      </Box>
      {/* Trash Popup */}
      <Dialog open={showTrash} onClose={() => setShowTrash(false)} maxWidth={isNonMobileScreen ? "sm" : "xl"} fullWidth>
        <DialogContent sx={{ p: isNonMobileScreen ? '1.5rem' : '0.7rem', backgroundColor: theme.palette.background.default }}>
          <Typography variant="h4" sx={{ mb: '1rem', fontWeight: 'bold' }}>Trash Items</Typography>
          {trashItems && trashItems.length > 0 ? (
            <Box>
              {trashItems.map((item, index) => (
                <Box key={index} sx={{
                  display: 'flex', justifyContent: 'space-between', mb: '1rem', alignItems: 'center', p: '.5rem', borderRadius: '0.5rem', "&:hover": {
                    backgroundColor: theme.palette.mode === 'dark' ? colors.darkTopColor : colors.grey[100]
                  }
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', }} >
                    <DeveloperBoardTwoTone sx={{ fontSize: '1.4rem', mt: '0.3rem' }} />
                    <Box>
                      <Typography variant='h5' >{item.name}</Typography>
                      <Typography variant='subtitle2' >{item.url}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                    <UTurnLeftTwoTone onClick={() => handleRemoveToTrash(item.id)} sx={{ rotate: '90deg', cursor: 'pointer' }} titleAccess='Remove From Trash' />
                    <DeleteSweepTwoTone onClick={() => handleDeleteProject(item.id)} sx={{ cursor: 'pointer' }} titleAccess='Delete' />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography>No items in the trash.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </div >
  )
}

export default Topbar
