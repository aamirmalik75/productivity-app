import { Box, Typography, useTheme } from '@mui/material'
import React, { useContext } from 'react'
import { ColorModeContext, tokens } from '../theme';

const ColorBox = ({ color, name }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const colorMode = useContext(ColorModeContext);

  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

  const handleChange = (e) => {
    colorMode.setVariantColor(name)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: '0.5rem', border: name === theme.palette.variantColor ? `1px solid ${color}` : null, p: '0.5rem', borderRadius: '0.2rem', cursor: 'pointer' }}
      onClick={handleChange}
    >
      <Typography sx={{ backgroundColor: color, width: '1rem', height: '1rem', borderRadius: '0.2rem' }} ></Typography>
      <Typography>{capitalizedName}</Typography>
    </Box>
  )
}

export default ColorBox

