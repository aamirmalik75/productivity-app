import { Accordion, AccordionDetails, AccordionSummary, Box, FormControl, FormLabel, MenuItem, Pagination, Select, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PieChartComp from '../../components/PieChart'
import LineBarComp from '../../components/LineBarChart.jsx'
import Header from '../../components/Header'
import axios from 'axios';
import { tokens } from '../../theme';
import { dayColors, getColors, rangeOption, timeIntervalFields1, timeIntervalFields2, timeIntervalFields3, timeIntervalFields4 } from '../../config/DashBoard';
import BarChart from '../../components/BarChart';
import { loadingComplete, setLoading } from '../../redux/userReducers.js';
import { last_opened } from '../../utils/Last_Opened'

const GoalsInfo = ({ setActive }) => {
  // data to visualize performance
  const [bar1, setBar1] = useState([]);
  const [pie1, setPie1] = useState([]);
  const [pie2, setPie2] = useState([]);
  const [bar2_1, setBar2_1] = useState([]);
  const [bar2_2, setBar2_2] = useState([]);
  const [bar2_3, setBar2_3] = useState([]);
  const [bar2_4, setBar2_4] = useState([]);
  const [line1, setLine1] = useState([]);
  const [line2, setLine2] = useState([]);
  const [line3, setLine3] = useState([]);
  const [line4, setLine4] = useState([]);

  // metadata of data to visualize performance
  const [metaBar1, setMetaBar1] = useState({
    keys: [],
    indexBy: '',
    colorTheme: false,
    colors: [],
    legends: {}
  });
  const [metaBar2_1, setMetaBar2_1] = useState({
    keys: [],
    indexBy: '',
    colorTheme: false,
    colors: [],
    legends: {}
  });
  const [metaBar2_2, setMetaBar2_2] = useState({
    keys: [],
    indexBy: '',
    colorTheme: false,
    colors: [],
    legends: {}
  });
  const [metaBar2_3, setMetaBar2_3] = useState({
    keys: [],
    indexBy: '',
    colorTheme: false,
    colors: [],
    legends: {}
  });
  const [metaBar2_4, setMetaBar2_4] = useState({
    keys: [],
    indexBy: '',
    colorTheme: false,
    colors: [],
    legends: {}
  });

  const [filterOption, setFilterOption] = useState('1_week');
  const [totalSchedules, setTotalSchedules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const { token, loading } = useSelector(state => state.user);
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Schedule Dashboard";
    setActive("Schedules Panel")
    last_opened("Schedules Panel", token);
    const fetch = async () => {
      dispatch(setLoading());
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/dashBoard/schedule?time=${filterOption}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response.data.success) {
        setTotalSchedules(response.data.total);
        setPie1(Object.values(response.data.pie1));
        setPie2(Object.values(response.data.pie2).map((item) => {
          return {
            ...item,
            color: dayColors(item.id)
          }
        }));

        setLine1(response.data.line1);
        setLine2(response.data.line2);
        setLine3(response.data.line3);
        setLine4(response.data.line4);
        const bar2Data = await response.data.bar2;

        if (filterOption === '1_week') {
          setBar2_1(bar2Data.bar_2_1);
          setBar2_2(bar2Data.bar_2_2);
          setBar2_3(bar2Data.bar_2_3);
          setBar2_4(bar2Data.bar_2_4);

          setBar1(Object.values(response.data.bar1).map((item) => {
            return {
              ...item,
              color: getColors(item.day, filterOption)
            }
          }));
          const keys = bar1.map((d) => d.day)
          setMetaBar1({
            keys,
            indexBy: 'day',
            colorTheme: true,
            colors: bar1.map((d) => d.color),
            legends: {
              axisBottom: 'Day',
              axisLeft: 'Performance',
              dataFrom: 'indexes'
            }
          })

          setMetaBar2_1({
            keys: timeIntervalFields1,
            indexBy: 'week',
            colorTheme: true,
            colors: Object.keys(bar2Data.bar_2_1[0]).filter(key => key.endsWith('Color')).map(colorKey => bar2Data.bar_2_1[0][colorKey]),
            legends: {
              axisBottom: 'Week',
              axisLeft: 'Performance',
              dataFrom: 'keys'
            }
          });

          setMetaBar2_2({
            keys: timeIntervalFields2,
            indexBy: 'week',
            colorTheme: true,
            colors: Object.keys(bar2Data.bar_2_2[0]).filter(key => key.endsWith('Color')).map(colorKey => bar2Data.bar_2_2[0][colorKey]),
            legends: {
              axisBottom: 'Week',
              axisLeft: 'Performance',
              dataFrom: 'keys'
            }
          });

          setMetaBar2_3({
            keys: timeIntervalFields3,
            indexBy: 'week',
            colorTheme: true,
            colors: Object.keys(bar2Data.bar_2_3[0]).filter(key => key.endsWith('Color')).map(colorKey => bar2Data.bar_2_3[0][colorKey]),
            legends: {
              axisBottom: 'Week',
              axisLeft: 'Performance',
              dataFrom: 'keys'
            }
          });

          setMetaBar2_4({
            keys: timeIntervalFields4,
            indexBy: 'week',
            colorTheme: true,
            colors: Object.keys(bar2Data.bar_2_4[0]).filter(key => key.endsWith('Color')).map(colorKey => bar2Data.bar_2_4[0][colorKey]),
            legends: {
              axisBottom: 'Week',
              axisLeft: 'Performance',
              dataFrom: 'keys'
            }
          });
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
            colors: bar1.map((d) => d.color),
            legends: {
              axisBottom: 'Weeks',
              axisLeft: 'Performance',
              dataFrom: 'indexes'
            }
          })

          setBar2_1(Object.values(bar2Data.bar_2_1));
          setBar2_2(Object.values(bar2Data.bar_2_2));
          setBar2_3(Object.values(bar2Data.bar_2_3));
          setBar2_4(Object.values(bar2Data.bar_2_4));

          setMetaBar2_1({
            keys: timeIntervalFields1,
            indexBy: 'week',
            colorTheme: true,
            colors: Object.keys(bar2_1[0]).filter(key => key.endsWith('Color')).map(colorKey => bar2_1[0][colorKey]),
            legends: {
              axisBottom: 'Week',
              axisLeft: 'Performance',
              dataFrom: 'keys'
            }
          });

          setMetaBar2_2({
            keys: timeIntervalFields2,
            indexBy: 'week',
            colorTheme: true,
            colors: Object.keys(bar2_2[0]).filter(key => key.endsWith('Color')).map(colorKey => bar2_2[0][colorKey]),
            legends: {
              axisBottom: 'Week',
              axisLeft: 'Performance',
              dataFrom: 'keys'
            }
          });

          setMetaBar2_3({
            keys: timeIntervalFields3,
            indexBy: 'week',
            colorTheme: true,
            colors: Object.keys(bar2_3[0]).filter(key => key.endsWith('Color')).map(colorKey => bar2_3[0][colorKey]),
            legends: {
              axisBottom: 'Week',
              axisLeft: 'Performance',
              dataFrom: 'keys'
            }
          });

          setMetaBar2_4({
            keys: timeIntervalFields4,
            indexBy: 'week',
            colorTheme: true,
            colors: Object.keys(bar2_4[0]).filter(key => key.endsWith('Color')).map(colorKey => bar2_4[0][colorKey]),
            legends: {
              axisBottom: 'Week',
              axisLeft: 'Performance',
              dataFrom: 'keys'
            }
          });
        } else if (filterOption === '1_year') {

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
            colors: bar1.map((d) => d.color),
            legends: {
              axisBottom: 'Months',
              axisLeft: 'Performance',
              dataFrom: 'indexes'
            }
          })


          setBar2_1(Object.values(bar2Data.bar_2_1));
          setBar2_2(Object.values(bar2Data.bar_2_2));
          setBar2_3(Object.values(bar2Data.bar_2_3));
          setBar2_4(Object.values(bar2Data.bar_2_4));

          setMetaBar2_1({
            keys: timeIntervalFields1,
            indexBy: 'month',
            colorTheme: true,
            colors: Object.keys(bar2_1[0]).filter(key => key.endsWith('Color')).map(colorKey => bar2_1[0][colorKey]),
            legends: {
              axisBottom: 'Month',
              axisLeft: 'Performance',
              dataFrom: 'keys'
            }
          });

          setMetaBar2_2({
            keys: timeIntervalFields2,
            indexBy: 'month',
            colorTheme: true,
            colors: Object.keys(bar2_2[0]).filter(key => key.endsWith('Color')).map(colorKey => bar2_2[0][colorKey]),
            legends: {
              axisBottom: 'Month',
              axisLeft: 'Performance',
              dataFrom: 'keys'
            }
          });

          setMetaBar2_3({
            keys: timeIntervalFields3,
            indexBy: 'month',
            colorTheme: true,
            colors: Object.keys(bar2_3[0]).filter(key => key.endsWith('Color')).map(colorKey => bar2_3[0][colorKey]),
            legends: {
              axisBottom: 'Month',
              axisLeft: 'Performance',
              dataFrom: 'keys'
            }
          });

          setMetaBar2_4({
            keys: timeIntervalFields4,
            indexBy: 'month',
            colorTheme: true,
            colors: Object.keys(bar2_4[0]).filter(key => key.endsWith('Color')).map(colorKey => bar2_4[0][colorKey]),
            legends: {
              axisBottom: 'Month',
              axisLeft: 'Performance',
              dataFrom: 'keys'
            }
          });
        }
      }
      dispatch(loadingComplete());
    }
    fetch();
  }, [filterOption, totalSchedules]);

  return (
    <Box width='100%' p={isNonMobileScreen ? '.8rem' : '0.3rem'} >
      <Header title='Schedules Dashboard' />
      <Box display='flex' justifyContent='space-between' flexDirection={isNonMobileScreen ? 'row' : 'column'} alignItems='center' width='100%' p='10px' >
        <Typography variant={isNonMobileScreen ? 'h3' : 'body2'}   >{`This ${filterOption.split('_')[1].toLocaleUpperCase()} Performance`}</Typography>
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
      >
        <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? colors.darkTopColor : colors.grey[100], gridColumn: 'span 12', gridRow: 'span 2', borderRadius: '3px' }} >
          <Box p='5px 6px' mt='.5rem' ml='1rem' >
            <Typography variant={isNonMediumScreen ? 'h4' : 'h6'} color={colors.primary[500]} fontWeight='600' >{`${filterOption.split('_')[1].toLocaleUpperCase()}LY Progress of Schedules via verifications`}</Typography>
          </Box>
          <Box height='100%' mt='-40px' >
            <BarChart data={bar1} metaData={metaBar1} isNonMediumScreen={isNonMediumScreen} isNonMobileScreen={isNonMobileScreen} />
          </Box>
        </Box>
        <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? colors.darkTopColor : colors.grey[100], gridColumn: isNonMobileScreen ? 'span 6' : 'span 12', gridRow: 'span 2', borderRadius: '3px' }} >
          <Box p='5px 6px' mt='.5rem' ml='1rem' >
            <Typography variant={isNonMediumScreen ? 'h4' : 'h6'} color={colors.primary[500]} fontWeight='600' >Templates Performance via verifications</Typography>
          </Box>
          <Box display='flex' position='relative' width='100%' height='85%' alignItems='start'>
            <PieChartComp data={pie1} isPercentage={true} cx={120} cy={100} />
          </Box>
        </Box>
        <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? colors.darkTopColor : colors.grey[100], gridColumn: isNonMobileScreen ? 'span 6' : 'span 12', gridRow: 'span 2', borderRadius: '3px' }} >
          <Box p='5px 6px' mt='.5rem' ml='1rem' >
            <Typography variant={isNonMediumScreen ? 'h4' : 'h6'} color={colors.primary[500]} fontWeight='600' >Performance via Days</Typography>
          </Box>
          <Box display='flex' position='relative' width='100%' height='85%' alignItems='start'>
            <PieChartComp data={pie2} isPercentage={true} cx={120} cy={100} />
          </Box>
        </Box>
        <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? colors.darkTopColor : colors.grey[100], gridColumn: 'span 12', gridRow: isNonMediumScreen ? 'span 3' : 'span 6', borderRadius: '3px' }} >
          <Box display='flex' flexDirection={isNonMediumScreen ? 'row' : 'column'} alignItems={isNonMediumScreen ? 'center' : ''} justifyContent='space-between' p='5px 6px' mt='.5rem' ml='1rem' >
            <Typography variant={isNonMediumScreen ? 'h4' : 'h6'} color={colors.primary[500]} fontWeight='600' >{`${filterOption.split('_')[1].toLocaleUpperCase()} Performance via Time`}</Typography>
            {
              !loading &&
              <Stack spacing={2} sx={{ zIndex: 10 }}>
                <Pagination size={isNonMobileScreen ? 'medium' : 'small'} count={4} page={currentPage} onChange={(e, v) => setCurrentPage(v)} color='secondary' />
              </Stack>
            }
          </Box>
          <Box height='95%' width='100%' mt='-20px' ml='-10px' >
            {currentPage === 1 && <LineBarComp data={line1} isNonMediumScreen={isNonMediumScreen} isNonMobileScreen={isNonMobileScreen} />}
            {currentPage === 2 && <LineBarComp data={line2} isNonMediumScreen={isNonMediumScreen} isNonMobileScreen={isNonMobileScreen} />}
            {currentPage === 3 && <LineBarComp data={line3} isNonMediumScreen={isNonMediumScreen} isNonMobileScreen={isNonMobileScreen} />}
            {currentPage === 4 && <LineBarComp data={line4} isNonMediumScreen={isNonMediumScreen} isNonMobileScreen={isNonMobileScreen} />}
          </Box>
        </Box>

        <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? colors.darkTopColor : colors.grey[100], gridColumn: 'span 12', gridRow: 'span 3', borderRadius: '3px' }} >
          <Box p='5px 6px' mt='.5rem' ml='1rem' display='flex' flexDirection={isNonMediumScreen ? 'row' : 'column'} alignItems={isNonMediumScreen ? 'center' : ''} justifyContent='space-between' >
            <Typography variant={isNonMediumScreen ? 'h4' : 'h6'} color={colors.primary[500]} fontWeight='600' >{`${filterOption.split('_')[1].toLocaleUpperCase()}LY Progress of Schedules via verifications`}</Typography>
            {
              !loading &&
              <Stack spacing={2} sx={{ zIndex: 10 }}>
                <Pagination size={isNonMobileScreen ? 'medium' : 'small'} count={4} page={currentPage2} onChange={(e, v) => setCurrentPage2(v)} color='secondary' />
              </Stack>
            }
          </Box>
          <Box height='90%' mt='-20px' >
            {currentPage2 === 1 && <BarChart data={bar2_1} metaData={metaBar2_1} isNonMediumScreen={isNonMediumScreen} isNonMobileScreen={isNonMobileScreen} />}
            {currentPage2 === 2 && <BarChart data={bar2_2} metaData={metaBar2_2} isNonMediumScreen={isNonMediumScreen} isNonMobileScreen={isNonMobileScreen} />}
            {currentPage2 === 3 && <BarChart data={bar2_3} metaData={metaBar2_3} isNonMediumScreen={isNonMediumScreen} isNonMobileScreen={isNonMobileScreen} />}
            {currentPage2 === 4 && <BarChart data={bar2_4} metaData={metaBar2_4} isNonMediumScreen={isNonMediumScreen} isNonMobileScreen={isNonMobileScreen} />}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default GoalsInfo
