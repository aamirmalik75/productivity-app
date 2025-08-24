import React, { useEffect, useState } from 'react'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import Header from '../../components/Header'
import HomeBox from '../../components/HomeBox'
import axios from 'axios'
import { loadingComplete, setLoading } from '../../redux/userReducers'
import { useDispatch, useSelector } from 'react-redux'
import { FeaturedPlayListTwoTone, RecentActorsTwoTone, TimelapseTwoTone, WatchLaterTwoTone, WatchOffTwoTone, WatchTwoTone } from '@mui/icons-material'
import { tokens } from '../../theme'

const Home = ({ setActive }) => {

  const { token, loading, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const [recentUsed, setRecentUsed] = useState([]);
  const [features, setFeatures] = useState([
    {
      "name": "Goals",
      "url": "\/goals",
    },
    {
      "name": "Schedules",
      "url": "\/schedule",
    },
    {
      "name": "Idea's",
      "url": "\/ideas",
    },
    {
      "name": "Goals Panel",
      "url": "\/dashboard\/goals",
    },
    {
      "name": "Schedules Panel",
      "url": "\/dashboard\/schedules",
    },
  ]);

  const getGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning!";
    else if (hour < 18) return "Good Afternoon!";
    else return "Good Evening!";
  }


  useEffect(() => {
    document.title = `Profectivity - ${user.name}`
    setActive("Home")
    const fetch = async () => {
      dispatch(setLoading());
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/recentUsed/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setRecentUsed(response.data.recentUsed);
        console.log(response.data.recentUsed)
      }
      dispatch(loadingComplete());
    }
    fetch();
  }, [])

  return (
    <Box m={isNonMediumScreen ? "2rem 8rem" : "1.5rem"} >
      <Typography variant='h1' fontWeight='500' mb={'3rem'} sx={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }} >
        {getGreetingMessage()}
        <Typography variant='h1' fontWeight='500' sx={{ color: colors.primary[500], fontFamily: 'cursive' }}>{user.name}</Typography>
      </Typography>
      <Header title={'Recently Used'} hero={true} HeroFirst={WatchLaterTwoTone} />
      <Box mb="1.5rem" sx={{ display: 'grid', gridTemplateColumns: `repeat(${isNonMediumScreen ? 4 : isNonMobileScreen ? 3 : 2},1fr)`, gap: '1rem' }} >
        {
          recentUsed && recentUsed?.map((item, i) => (
            <HomeBox key={i} index={i} item={item} />
          ))
        }
      </Box>
      <Header title={'Features'} hero={true} HeroFirst={FeaturedPlayListTwoTone} />
      <Box mb="5rem" sx={{ display: 'grid', gridTemplateColumns: `repeat(${isNonMediumScreen ? 4 : isNonMobileScreen ? 3 : 2},1fr)`, gap: '1rem' }} >
        {
          features && features?.map((item, i) => (
            <HomeBox key={i} item={item} isFeature={true} />
          ))
        }
      </Box>
    </Box>
  )
}

export default Home
