import * as React from 'react';
import { styled } from '@mui/system';
import { Tabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { DarkModeSharp, LightModeSharp } from '@mui/icons-material';
import { buttonClasses } from '@mui/base/Button';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import { useTheme } from '@mui/material';
import { tokens } from '../theme';

const ModeToggle = ({ toggleMode }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);

  const handleModeChange = (event, newValue) => {
    if (newValue === 1 && theme.palette.mode !== 'dark') {
      toggleMode(); // Switch to dark mode
    } else if (newValue === 0 && theme.palette.mode !== 'light') {
      toggleMode(); // Switch to light mode
    }
  };

  return (
    <Tabs defaultValue={theme.palette.mode === 'dark' ? 1 : 0} onChange={handleModeChange} style={{ marginTop: '0.5rem' }} >
      <TabsList colors={colors}>
        <Tab value={0} colors={colors} onClick={() => console.log('light')}> <LightModeSharp sx={{ mr: '0.5rem' }} /> Light</Tab>
        <Tab value={1} colors={colors} onClick={() => toggleMode()}> <DarkModeSharp sx={{ mr: '0.5rem' }} /> Dark</Tab>
      </TabsList>
    </Tabs>
  );
}

const Tab = styled(BaseTab)(
  ({ theme, colors }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  color: ${theme.palette.mode === 'dark' ? '#87909e' : '#fff'};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: transparent;
  width: 100%;
  padding: 5px 12px;
  margin: 6px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    color: ${theme.palette.mode === 'dark' ? '#fff' : '#000'};
  }

  &.${tabClasses.selected} {
    background-color: ${colors.sideColor};
    color: ${theme.palette.mode === 'dark' ? '#fff' : '#000'};
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  } `
);

const TabsList = styled(BaseTabsList)(
  ({ theme, colors }) => `
  min-width: 50%;
  background-color: ${theme.palette.mode === 'dark' ? colors.darkTopColor : '#87909e'};
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? colors.grey[200] : colors.grey[200]};
  `,
);


export default ModeToggle
