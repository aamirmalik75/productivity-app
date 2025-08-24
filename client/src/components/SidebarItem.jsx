import React, { useState } from 'react';
import { Box, MenuItem, Typography, useTheme } from '@mui/material';
import { ExpandLess, ExpandMore, MoreVertSharp } from '@mui/icons-material';
import { tokens } from '../theme';
import { Link } from 'react-router-dom';
import MenuListComp from './MenuListComp';

const SidebarItem = ({ title, to, children, active, isProject = false, Icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const InnerContent = () => (
    <Box
      onClick={handleToggle}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        padding: '7px',
        color: colors.grey[900],
        borderRadius: '0.5rem',
        backgroundColor: active === title ? hexToRgba(colors.primary[500], theme.palette.mode === 'dark' ? 0.2 : 0.4) : colors.sideColor,
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2a2e34' : '#eaeaea',
          color: colors.grey[100],
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <Icon sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#2a2a34' }} />
        <Typography sx={{ mt: '0.3rem', color: colors.grey[900], alignSelf: 'center' }} variant="h6">{title}</Typography>
      </Box>
      {children && (open ? <ExpandLess sx={{ color: colors.grey[900] }} /> : <ExpandMore sx={{ color: colors.grey[900] }} />)}
    </Box>
  )

  return (
    <Box sx={{ mb: '3px' }}>

      {to && !isProject ? <Link to={to} style={{ textDecoration: 'none', color: colors.grey[900] }}>
        <InnerContent />
      </Link>
        :
        <InnerContent />
      }

      {open && children && (
        <Box
          sx={{
            pl: '1rem',
            pt: '5px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          {children.map((child, index) => (
            <Link key={index} to={child.to} style={{ textDecoration: 'none', }}>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '5px',
                  borderRadius: '0.5rem',
                  color: colors.grey[800],
                  backgroundColor: active === child.title ? hexToRgba(colors.primary[500], 0.2) : colors.sideColor,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#2a2e34' : '#eaeaea',
                  },
                }}
              >
                <child.icon />
                {child.title}
              </Typography>
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SidebarItem;
