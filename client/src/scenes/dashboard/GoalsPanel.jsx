import { Accordion, AccordionDetails, AccordionSummary, Box, FormControl, FormLabel, MenuItem, Select, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import PieChartComp from '../../components/PieChart'
import Header from '../../components/Header'
import axios from 'axios';
import { tokens } from '../../theme';
import { getColors, rangeOption } from '../../config/DashBoard';
import BarChart from '../../components/BarChart';
import { ExpandMoreSharp } from '@mui/icons-material';
import { last_opened } from '../../utils/Last_Opened'

const GoalsInfo = ({ setActive }) => {
  // data to visualize performance
  const [pie1, setPie1] = useState([]);
  const [bar1, setBar1] = useState([]);

  // metadata of data to visualize performance
  const [metaBar1, setMetaBar1] = useState({
    keys: [],
    indexBy: '',
    colorTheme: false,
    legends: {}
  });

  const [totalGoals, setTotalGoals] = useState(0);
  const [goalsWithFeedbacks, setGoalsWithFeedbacks] = useState([]);
  const [filterOption, setFilterOption] = useState('1_week');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonCollapseScreen = useMediaQuery('(min-width: 1100px)');
  const { token } = useSelector(state => state.user);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);

  useEffect(() => {
    document.title = "Goal Dashboard";
    setActive("Goals Panel")
    last_opened("Goals Panel", token);

    const fetch = async () => {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/dashBoard/goal?time=${filterOption}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response.data.success) {
        setPie1(response.data.pie1);
        setTotalGoals(response.data.totalGoals);
        setGoalsWithFeedbacks(response.data.goals);

        if (filterOption === '1_week') {
          setBar1(Object.values(response.data.bar1));
          const keys = bar1.map((d) => d.title)
          setMetaBar1({
            keys,
            indexBy: 'title',
            colorTheme: false,
            legends: {
              axisBottom: 'Title',
              axisLeft: 'Progress',
              dataFrom: 'indexes'
            }
          })
        } else if (filterOption === '1_month') {
          setBar1(Object.values(response.data.bar1).map((item) => {
            return {
              ...item,
              color: getColors(item.week, filterOption)
            }
          }));
          const keys = Object.values(response.data.bar1).map((d) => d.week)
          setMetaBar1({
            keys,
            indexBy: 'week',
            colorTheme: true,
            legends: {
              axisBottom: 'Weeks',
              axisLeft: 'Progress',
              dataFrom: 'indexes'
            }
          })
        } else {
          setBar1(Object.values(response.data.bar1).map((item) => {
            return {
              ...item,
              color: getColors(item.month, filterOption)
            }
          }));
          const keys = Object.values(response.data.bar1).map((d) => d.month)
          setMetaBar1({
            keys,
            indexBy: 'month',
            colorTheme: true,
            legends: {
              axisBottom: 'Months',
              axisLeft: 'Progress',
              dataFrom: 'indexes'
            }
          })
        }
      }
    }
    fetch();
  }, [totalGoals, filterOption]);

  return (
    <Box width='100%' p={isNonMobileScreen ? '.8rem' : '0.3rem'} >
      <Header title='Goals Dashboard' />
      <Box display='flex' justifyContent='space-between' flexDirection={isNonMobileScreen ? 'row' : 'column'} alignItems='center' width='100%' p='10px' >
        <Typography variant={isNonMobileScreen ? 'h3' : 'body2'}>{`This ${filterOption.split('_')[1].toLocaleUpperCase()} Performance`}</Typography>
        <Box width={isNonMobileScreen ? '30%' : '100%'}>
          <FormLabel sx={{ mr: '.1rem', fontSize: isNonMobileScreen ? '16px' : '10px', fontWeight: 'bold' }} >Filter By: </FormLabel>
          <FormControl variant={isNonMobileScreen ? 'filled' : 'standard'} sx={{ width: '100%' }} >
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              defaultValue='1_week'
              name='1_week'
              onChange={(e) => {
                setFilterOption(e.target.value);
              }}
            >
              {
                Object.entries(rangeOption).map(([label, value]) => (
                  <MenuItem key={label} value={value}>{label}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box
        display='grid'
        gridTemplateColumns='repeat(12,1fr)'
        gridAutoRows='140px'
        gap='10px'
        gridRow={'auto'}
        sx={{ background: theme.palette.background.default, p: '0px' }}
      >
        <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? colors.darkTopColor : colors.grey[100], gridColumn: 'span 12', gridRow: 'span 3', borderRadius: '3px' }} >
          <Box p='5px 6px' mt='.5rem' ml='1rem' >
            <Typography variant={isNonMediumScreen ? 'h4' : 'h6'} color={colors.primary[500]} fontWeight='600' >{`${filterOption.split('_')[1].toLocaleUpperCase()}LY Progress`}</Typography>
          </Box>
          <Box height='95%' mt='-30px' >
            <BarChart data={bar1} metaData={metaBar1} isNonMediumScreen={isNonMediumScreen} isNonMobileScreen={isNonMobileScreen} />
          </Box>
        </Box>
        <Box sx={{ width: '100%', height: '100%', backgroundColor: theme.palette.mode === 'dark' ? colors.darkTopColor : colors.grey[100], gridColumn: isNonMediumScreen ? 'span 5' : 'span 12', gridRow: 'span 2', borderRadius: '3px' }} >
          <Box p='5px 6px' mt='.5rem' ml='1rem' >
            <Typography variant={isNonMediumScreen ? 'h4' : 'h6'} color={colors.primary[500]} fontWeight='600' >Number of Total Goals {totalGoals}</Typography>
          </Box>
          <Box display='flex' position='relative' width='100%' height='85%' alignItems='start'  >
            <PieChartComp data={pie1} cx={90} cy={80} />
          </Box>
        </Box>
        <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? colors.darkTopColor : colors.grey[100], overflow: 'auto', gridColumn: isNonMediumScreen ? 'span 7' : 'span 12', gridRow: 'span 2', borderRadius: '3px' }} >
          <Box p='5px 6px' mt='.5rem'>
            <Typography variant={isNonMediumScreen ? 'h4' : 'h6'} ml='1rem' m='0.5rem' color={colors.primary[500]} fontWeight='600' >Feedbacks About Goals</Typography>
            {
              goalsWithFeedbacks.map((goal) => (
                <Accordion key={goal.id} sx={{ m: '0.5rem 0' }} >
                  <AccordionSummary
                    expandIcon={<ExpandMoreSharp />}
                    aria-controls="panel1-content"

                  >
                    {goal.title}
                  </AccordionSummary>
                  {
                    goal.feedback.map((feed) => (
                      <AccordionDetails key={feed.id} sx={{ m: '0.4rem 0', backgroundColor: colors.grey[500], borderRadius: '3px' }}>
                        <Typography variant='subtitle1' >{feed.title}</Typography>
                        <Typography variant='subtitle2' >{feed.description}</Typography>
                      </AccordionDetails>
                    ))}
                </Accordion>
              ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default GoalsInfo
