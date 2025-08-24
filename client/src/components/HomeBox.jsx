import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { tokens } from '../theme';
import { Link } from 'react-router-dom';
import moment from 'moment';

const HomeBox = ({ item, isFeature = false, index }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');

  const timeAgo = (date) => {
    return moment(date).fromNow();
  };

  return (
    <Link to={item.url} style={{ textDecoration: 'none', color: colors.text, width: isNonMobileScreen ? '11rem' : '100%', height: '11rem' }} >
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: isNonMobileScreen ? '11rem' : '100%', height: '11rem', backgroundColor: index === 0 ? colors.primary[500] : theme.palette.mode === 'dark' ? colors.darkTopColor : colors.grey[100], borderRadius: '0.5rem', p: '0.5rem' }} >
        <Typography variant='h4'>{item.name}</Typography>
        {!isFeature && <Typography>{timeAgo(item.last_opened)}</Typography>}
      </Box>
    </Link>
  );
};

export default HomeBox;
