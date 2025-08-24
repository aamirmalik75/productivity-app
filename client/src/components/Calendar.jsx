import React, { useEffect, useState } from 'react'
import { CloseSharp, DoneSharp, NewReleasesSharp, VerifiedSharp } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Box, Checkbox, Typography, useMediaQuery, useTheme } from '@mui/material';
import "../styles/calendar.css";
import { tokens } from '../theme';
import styled from "@emotion/styled";
const Calendar = ({ data, selectedIds, setSelectedIds, setID, handleUpdate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor)
  const [schedules, setSchedules] = useState([]);
  useEffect(() => {
    const fetchEvents = data.map((schedule) => ({
      id: schedule.id,
      title: schedule.title,
      start: schedule.date + 'T' + schedule.start,
      end: schedule.date + 'T' + schedule.end,
      extendedProps: { status: schedule.status, verified: schedule.isVerified },
      key: schedule.id,
      selected: false,
      color: colors.primary[500]
    }));
    setSchedules(fetchEvents)
  }, [data, theme]);

  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');

  let right = '';
  if (isNonMediumScreen && isNonMobileScreen) {
    right = 'dayGridMonth,timeGridDay,timeGridWeek,listMonth';
  } else if (isNonMobileScreen && !isNonMediumScreen) {
    right = 'timeGridDay,listMonth'
  } else {
    right = 'title'
  }

  const handleDateClick = (selected) => {
    const day = selected.start.toLocaleDateString(undefined, { weekday: 'long' });
    const startTime = selected.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h24' });
    const endTime = selected.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h24' });
    const date = selected.start.toISOString().split('T')[0];
  };

  const handleEventClick = (selected) => {
    setID(selected.event.id);
    handleUpdate();
  }

  const handleCheckboxChange = (e, id) => {
    e.stopPropagation();
    const isChecked = e.target.checked;
    setSelectedIds(prev => {
      if (isChecked)
        return [...prev, id];
      else
        return prev.filter(prevId => prevId !== id);
    })
  }

  const customEvent = (eventInfo) => {
    return (
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '0', backgroundColor: theme.palette.primary[500] }}>
        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: theme.palette.primary[500] }}  >
          <Checkbox checked={Array.isArray(selectedIds) && selectedIds.includes(eventInfo.event.id)}
            onChange={(e) => handleCheckboxChange(e, eventInfo.event.id)}
            sx={{
              '& .MuiSvgIcon-root': {
                width: '14px', // Adjust the width of the checkbox icon
                height: '14px',
                color: theme.palette.background.default, // Change the color when checkbox is checked
              },
              '&.Mui-checked': {
                color: theme.palette.background.default, // Change the color when checkbox is checked
              },
            }}
          />
          <Typography variant='caption' >{eventInfo.event.title} </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between', fontSize: '15px' }}>
          {eventInfo.event.extendedProps.status === 'incomplete' ?
            <CloseSharp sx={{ alignSelf: 'center', fontSize: '15px' }} /> :
            <DoneSharp sx={{ fontSize: '15px' }} />
          }
          {eventInfo.event.extendedProps.verified !== null && eventInfo.event.extendedProps.verified === "1" ?
            <VerifiedSharp sx={{ fontSize: '15px' }} /> :
            <NewReleasesSharp sx={{ alignSelf: 'center', fontSize: '15px' }} />
          }
        </Box>
      </Box>
    )
  }

  return (
    <Box

    >
      <FullCalendar
        height='80vh'
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          interactionPlugin,
        ]}
        headerToolbar={{
          left: 'prev,next today',
          center: isNonMobileScreen ? "title" : 'timeGridDay,listMonth',
          right: right,
        }}
        initialView={isNonMediumScreen ? 'timeGridWeek' : 'timeGridDay'}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        select={handleDateClick}
        eventClick={handleEventClick}
        events={schedules}
        eventContent={customEvent}
      />
    </Box>
  )
}

export default Calendar
