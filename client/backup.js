import { Box, useTheme } from '@mui/material'
import React from 'react'
import { useParams } from 'react-router-dom'
import { tokens } from '../../theme';
import Project_Cat_comp from '../../components/Project_Cat_comp';

const Project = ({ setActive }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);

  const { project_id } = useParams();

  return (
    <Box m='15px 90px'>
      <input placeholder={project_id} style={{ border: 'none', backgroundColor: theme.palette.background.default, outline: 'none', color: theme.palette.mode === 'dark' ? "#fff" : '#000', fontSize: '2rem', borderBottom: `1px solid ${colors.grey[600]}`, width: '100%', padding: '0.5rem' }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', p: '0.5rem' }}>
        <Box>
          <Box>
            <Project_Cat_comp name={'To-Do'} color={colors.grey[500]} />
          </Box>
        </Box>
        <Box>
          <Box>
            <Project_Cat_comp name={'In-Progress'} color={'#28456c'} />
          </Box>
        </Box>
        <Box>
          <Box>
            <Project_Cat_comp name={'Done'} color={'#2b593f'} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Project
