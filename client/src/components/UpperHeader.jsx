import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { tokens } from '../theme';

const UpperHeader = ({ Icon, isCollapsed, setIsCollapsed, layOutWidth, setLayOutWidth }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const isNonMobileScreen = useMediaQuery('(min-width: 600px');

  const handleClick = (e) => {
    if (isNonMobileScreen) {
      console.log('isN')
      if (isCollapsed) {
        setLayOutWidth({ sidebar: '13%', main: '87%' })
      } else {
        setLayOutWidth({ sidebar: '0%', main: '100%' })
      }
      setIsCollapsed(!isCollapsed);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  }

  return (
    <Box mt='4rem' ml={'1rem'}>
      {Icon && <Icon sx={{ cursor: 'pointer', backgroundColor: theme.palette.mode === 'dark' ? colors.darkTopColor : colors.primary[400], color: theme.palette.mode === 'dark' ? '#fff' : '#000', borderRadius: '0.2rem' }} onClick={handleClick} />}
    </Box >
  );
}

export default UpperHeader
