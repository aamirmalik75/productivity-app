import React, { useEffect, useState } from 'react';
import { Menu, MenuItem, Sidebar, SubMenu, sidebarClasses } from 'react-pro-sidebar';
import { Box, Button, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import SidebarItem from '../../components/SidebarItem';
import { AddSharp, ArrowRightAlt, CalendarMonthTwoTone, CancelTwoTone, DeveloperBoardTwoTone, FlagCircleTwoTone, InsertChartTwoTone, MoreVertSharp, OtherHousesTwoTone, QueryStatsTwoTone, SpaceDashboardTwoTone, TipsAndUpdatesTwoTone } from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import MenuListComp from '../../components/MenuListComp';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { setAlert } from '../../redux/userReducers';
import CustomMenu from '../../components/CustomMenu';

const SidebarComp = ({ isCollapsed, setIsCollapsed, width, active, setActive, projects, setProjects }) => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');
  const { user, token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { project_id } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingProjectName, setEditingProjectName] = useState('');
  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const sideBarItemsArray = [
    { title: 'Home', children: null, to: `/home/${user && user.id}`, icon: OtherHousesTwoTone },
    {
      title: 'Dashboard', children: [
        { title: 'Goals Panel', to: '/dashboard/goals', icon: InsertChartTwoTone },
        { title: 'Schedules Panel', to: '/dashboard/schedules', icon: QueryStatsTwoTone },
      ], to: null, icon: SpaceDashboardTwoTone
    },
    { title: 'Schedules', children: null, to: '/schedule', icon: CalendarMonthTwoTone },
    { title: 'Goals', children: null, to: '/goals', icon: FlagCircleTwoTone },
    { title: "Idea's", children: null, to: '/ideas', icon: TipsAndUpdatesTwoTone },
  ];

  useEffect(() => {
    if (!user)
      navigate('/sign-up');
    else
      activeProjects();
  }, [user, navigate, isNonMediumScreen]);

  const handleAddProject = async () => {
    const r = await axios.post(import.meta.env.VITE_SERVER_URL + `/api/project/create`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    );
    if (r.data.success) {
      setProjects(prev => [...prev, r.data.project]);
      navigate(`/project/${r.data.project.id}`)
    }
  }

  const activeProjects = async () => {
    const r = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/project/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    );
    if (r.data.success) {
      setProjects(r.data.projects);
    }
  }

  const handleRenameClick = (e, project) => {
    setEditingProjectId(project.id);
    setEditingProjectName(project.name);
  }

  const handleRenameChange = (e) => {
    setEditingProjectName(e.target.value);
  };

  const handleRenameBlur = async (project) => {
    if (editingProjectName !== project) {
      const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/project/${project.id}/rename`, {
        name: editingProjectName,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProjects((prev) => prev.map((p) => p.id === project.id ? { ...p, name: editingProjectName } : p));
      if (!response.data.success) {
        dispatch(setAlert({ type: 'error', message: "Something went Wrong try again!" }));
      }
      else {
        dispatch(setAlert({ type: 'success', message: "Project rename Successfully!" }));
      }
    }
    setEditingProjectId(null);
  }

  const handleRenameKeyPress = (e, project) => {
    if (e.key === 'Enter') {
      handleRenameBlur(project);
    }
  };

  const handleMoveToTrash = async (e, project) => {
    const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/project/${project.id}/moveToTrash`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    if (!response.data.success) {
      dispatch(setAlert({ type: 'error', message: "Something went Wrong try again!" }));
    }
    else {
      if (project.id === active) {
        navigate(`/home/${user.id}`)
      }
      dispatch(setAlert({ type: 'success', message: response.data.message }));
    }
  }

  return (
    <Box width={isNonMediumScreen ? width : '250px'} height={'100vh'} display={isCollapsed ? 'none' : 'block'} sx={{ pt: '3rem', borderRight: theme.palette.mode === 'dark' ? '1px dotted white' : '1px solid silver', backgroundColor: colors.sideColor, position: !isNonMediumScreen ? 'fixed' : null, zIndex: 90 }}  >

      {!isNonMediumScreen &&
        <Box sx={{ display: 'flex', mb: '0.5rem', justifyContent: 'space-between' }}>
          <Box></Box>
          <CancelTwoTone sx={{ alignSelf: 'end' }} onClick={() => setIsCollapsed(true)} />
        </Box>
      }
      {
        sideBarItemsArray.map((item, i) => (
          <SidebarItem
            title={item.title}
            to={item.to}
            active={active}
            children={item.children}
            Icon={item.icon}
            key={i}
          />
        ))
      }
      <Typography variant='h5' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 500, color: colors.primary[500], m: '.5rem' }} >
        Projects
        <AddSharp titleAccess='Add New Project' sx={{ cursor: 'pointer', borderRadius: '0.2rem', "&:hover": { backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : colors.grey[100] } }} onClick={handleAddProject} />
      </Typography>
      <Box sx={{ p: '0 0.5rem', position: 'relative' }} >
        {
          projects && projects.map((project, i) => (
            <Box key={project.id} className={`${project.id} ${project.name}`} sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '7px',
              color: colors.grey[900],
              borderRadius: '0.5rem',
              backgroundColor: active === project.id ? hexToRgba(colors.primary[500], theme.palette.mode === 'dark' ? 0.2 : 0.4) : colors.sideColor,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2a2e34' : '#eaeaea',
                color: colors.grey[100],
                "& .more": {
                  display: editingProjectId ? 'none' : 'block'
                },
              },

            }}
            >
              {editingProjectId === project.id ? (
                <Box key={project.id} sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={editingProjectName}
                    onChange={handleRenameChange}
                    onKeyPress={(e) => handleRenameKeyPress(e, project)}
                    autoFocus
                    style={{
                      fontSize: '1rem',
                      padding: '4px',
                      width: '100%',
                      borderRadius: '4px',
                      border: `1px solid ${colors.grey[400]}`,
                    }}
                  />
                  <ArrowRightAlt sx={{
                    borderRadius: '.3rem',
                    "&:hover": {
                      backgroundColor: theme.palette.mode === 'light' ? '#2a2e34' : '#eaeaea',
                    }
                  }}
                    onClick={() => handleRenameBlur(project)}
                  />
                </Box>
              ) : (
                <Link to={`/project/${project.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: colors.grey[900], flex: 1, }}>
                  <DeveloperBoardTwoTone />
                  <Typography>{project.name}</Typography>
                </Link>
              )}
              <CustomMenu
                menuItems={[
                  { id: 1, label: 'Rename', onClick: (e) => handleRenameClick(e, project) },
                  { id: 2, label: 'Move To Trash', onClick: (e) => handleMoveToTrash(e, project) },
                  {
                    id: 3, label: 'Copy Link', onClick: (e) => {
                      const origin = window.location.origin;
                      const url = origin + project.url;
                      navigator.clipboard.writeText(url);
                      dispatch(setAlert({ type: 'info', message: `"${url}"     Copied!` }))
                    }
                  },
                ]}
              />
            </Box>
          ))
        }
      </Box>
    </Box >
  )
}


export default SidebarComp
