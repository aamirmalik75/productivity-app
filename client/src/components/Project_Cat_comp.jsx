import { Box, Typography } from '@mui/material'
import React from 'react'

const Project_Cat_comp = ({ name, color }) => {
  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <Box sx={{ width: '8rem', p: '0.3rem 0.7rem', backgroundColor: hexToRgba(color, 0.4), display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.8rem' }}>
      <Box sx={{ width: '.6rem', height: '.6rem', backgroundColor: color,borderRadius: '0.3rem' }} ></Box>
      <Typography>{name}</Typography>
    </Box>
  )
}

export default Project_Cat_comp

