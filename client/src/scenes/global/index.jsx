import React, { useContext, useEffect, useRef, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSelector } from 'react-redux';
import SignIn from '../signIn';
import Goals from '../goals';
import CreateGoal from '../goals/create.jsx';
import Ideas from '../ideas/index.jsx';
import CreateIdea from '../ideas/create.jsx';
import Form from '../feedback/form.jsx';
import Notifications from '../notifications/index.jsx';
import Schedule from '../schedule/index.jsx';
import Templates from '../templates/index.jsx';
import TemplateForm from '../templates/form.jsx';
import GoalsPanel from '../dashboard/GoalsPanel.jsx';
import SchedulesPanel from '../dashboard/SchedulesPanel.jsx';
import UpperHeader from '../../components/UpperHeader.jsx';
import { KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft, MenuTwoTone } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import Home from '../home/index.jsx';
import Project from '../project/index.jsx';
import { ColorModeContext } from '../../theme.js';

const Main = () => {
  const navigate = useNavigate();
  const colorMode = useContext(ColorModeContext);
  const { user, goal, idea, feedback } = useSelector(state => state.user);
  const isNonMediumScreen = useMediaQuery('(min-width: 900px');
  const [isCollapsed, setIsCollapsed] = useState(isNonMediumScreen ? false : true);
  const [active, setActive] = useState("Home");
  const [projects, setProjects] = useState([]);
  const [layOutWidth, setLayOutWidth] = useState({
    sidebar: isNonMediumScreen ? '13%' : '0%',
    main: isNonMediumScreen ? '87%' : '100%',
  });

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
    setLayOutWidth({
      sidebar: isNonMediumScreen ? '13%' : '0%',
      main: isNonMediumScreen ? '87%' : '100%',
    })
    setIsCollapsed(isNonMediumScreen ? false : true)

  }, [isNonMediumScreen])

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl + B is pressed
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'b') {
        event.preventDefault(); // Prevent the default browser behavior
        // Toggle the sidebar collapse state
        setIsCollapsed((prev) => !prev);
        // Adjust the layout width accordingly
        setLayOutWidth((prev) => ({
          sidebar: prev.sidebar === '0%' ? '13%' : '0%',
          main: prev.main === '100%' ? '87%' : '100%',
        }));
      }

      if(event.ctrlKey && event.key.toLowerCase() === 'm'){
        event.preventDefault(); // Prevent the default browser behavior
        colorMode.toggleColorMode()
      }
    };

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className='app'>
      <Topbar projects={projects} setProjects={setProjects} />
      <main className="content" style={{ width: '100%', height: '100vh', overflow: 'auto' }} >
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} width={layOutWidth.sidebar} active={active} setActive={setActive} projects={projects} setProjects={setProjects} />
        <div style={{ width: layOutWidth.main, overflow: 'auto' }}>
          <UpperHeader Icon={!isNonMediumScreen ? MenuTwoTone : isCollapsed ? KeyboardDoubleArrowRight : KeyboardDoubleArrowLeft} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}
            layOutWidth={layOutWidth} setLayOutWidth={setLayOutWidth}
          />
          <Routes>
            {!user
              ?
              (
                <Route path='*' element={<SignIn />} />
              )
              :
              <>
                <Route path='/home/:id' element={<Home setActive={setActive} />} />
                <Route path='/dashboard/goals' element={<GoalsPanel setActive={setActive} />} />
                <Route path='/dashboard/schedules' element={<SchedulesPanel setActive={setActive} />} />
                <Route path='/goals' element={<Goals setActive={setActive} />} />
                <Route path='/goal/create' element={<CreateGoal setActive={setActive} />} />
                <Route path='/goal/:id/edit' element={<CreateGoal goal={goal} setActive={setActive} />} />
                <Route path='/ideas' element={<Ideas setActive={setActive} />} />
                <Route path='/idea/create' element={<CreateIdea setActive={setActive} />} />
                <Route path='/idea/:id/edit' element={<CreateIdea idea={idea} setActive={setActive} />} />
                <Route path='/feedback/:id/create' element={<Form setActive={setActive} />} />
                <Route path='/:feedbackId/feedback/:id/update' element={<Form feedback={feedback} setActive={setActive} />} />
                <Route path='/notifications' element={<Notifications />} />
                <Route path='/schedule' element={<Schedule setActive={setActive} />} />
                <Route path='/schedule/template' element={<Templates setActive={setActive} />} />
                <Route path='/schedule/template/create' element={<TemplateForm setActive={setActive} />} />
                <Route path='/schedule/template/:id/update' element={<TemplateForm setActive={setActive} />} />
                <Route path='/project/:project_id' element={<Project setActive={setActive} projects={projects} setProjects={setProjects} />} />
              </>
            }
          </Routes>
        </div>
      </main>
    </div >
  )
}

export default Main
