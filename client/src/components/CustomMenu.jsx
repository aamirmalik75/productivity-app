import React, { useState, useRef } from 'react';
import { Box, Typography, ClickAwayListener, useTheme } from '@mui/material';
import { MoreVertSharp } from '@mui/icons-material';
import { tokens } from '../theme';

const CustomMenu = ({ children, menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box ref={menuRef} sx={{ position: 'relative', display: 'inline-block' }}>
        <Typography
          onClick={handleToggle}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {!children && <MoreVertSharp className='more' sx={{ display: 'none', color: theme.palette.mode === 'dark' ? '#fff' : '#000', "&:hover": { color: theme.palette.mode === 'dark' ? '#fff' : '#000' } }} />}
        </Typography>
        {isOpen && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              mt: 1,
              width: '200px',
              backgroundColor: theme.palette.background.default,
              boxShadow: 3,
              borderRadius: '8px',
              zIndex: 10,
              padding: '10px',
              color: theme.palette.mode === 'dark' ? '#fff' : '#000',
              "&:hover": { background: theme.palette.background.default }
            }}
          >
            {menuItems.map((item, index) => (
              <Typography
                key={index}
                onClick={(e) => {
                  handleClose();
                  item.onClick();
                }}
                sx={{
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default CustomMenu;
