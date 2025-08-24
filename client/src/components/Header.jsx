import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { tokens } from '../theme';

const Header = ({ title, subtitle, hero = false, HeroFirst = null }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const isNonMobileScreen = useMediaQuery('(min-width: 600px');
  return (
    <Box mb='15px'>
      {
        hero ?
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HeroFirst sx={{ fontSize: isNonMobileScreen ? '2rem' : '1.5rem', mb: '0.5rem' }} />
            <Typography sx={{ fontSize: isNonMobileScreen ? '2rem' : '1.5rem' }} color={colors.text} fontWeight='500' mb='5px'>{title}</Typography>
          </Box>
          :
          <>
            <Typography variant={isNonMobileScreen ? 'h2' : 'h4'} color={colors.text} fontWeight='500' mb='5px'>{title}</Typography>
            <Typography variant={isNonMobileScreen ? 'h4' : 'caption'} color={colors.primary[500]}>{subtitle}</Typography>
          </>
      }
    </Box >
  );
}

export default Header
