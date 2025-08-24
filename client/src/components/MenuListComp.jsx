import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';

const ITEM_HEIGHT = 48;

const MenuListComp = ({ parent: ParentComponent, children, menuColor, setShowThemes = null, showThemes = null, anchorEl, setAnchorEl }) => {
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    if (setShowThemes) {
      setShowThemes(false);
    }
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ "&:hover": { background: 'none' }, p: 0 }}
      >
        <ParentComponent />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 5,
            minHeight: showThemes ? "8cm" : children && children.length * 5,
            width: showThemes ? '50ch' : '20ch',
            display: 'grid',
            gap: '5px',
            backgroundColor: menuColor,
          },
        }}
      >
        {React.Children && React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            onClick: (e) => {
              handleClose();
              if (child.props.onClick) {
                child.props.onClick(e);
              }
            },
          })
        }
        )}
      </Menu>
    </div>
  );
}

export default MenuListComp;
