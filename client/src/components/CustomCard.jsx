import { DeleteSharp, DoneAllSharp, EditSharp, PendingActionsSharp, TipsAndUpdatesSharp } from '@mui/icons-material'
import { Box, Card, CardActions, CardContent, IconButton, Typography, colors, useTheme } from '@mui/material'
import React from 'react'
import { tokens } from '../theme';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIdea } from '../redux/userReducers';

const CustomCard = ({ idea, setOpen, setDeletingIdeaId, setFullfilledIdeaId }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const cardTheme = {
    background: idea.category === 'Professional' ? '#121212' : '#ffffff',
    color: idea.category === 'Professional' ? '#ffffff' : '#121212',
    descColor: idea.category === 'Professional' ? colors.grey[200] : colors.grey[900]
  };

  return (
    <Card sx={{ maxWidth: 'auto', p: '3px', background: cardTheme.background, color: cardTheme.color }}>
      <CardActions sx={{ display: 'flex', p: 0, justifyContent: 'space-between' }}>
        <div>
          <IconButton sx={{ color: cardTheme.color }}>
            <TipsAndUpdatesSharp />
          </IconButton>
        </div>
        <div>
          {idea.status === 'Pending' && (
            <IconButton sx={{ color: cardTheme.color }} onClick={() => { setFullfilledIdeaId(idea.id); setOpen(true) }} >
              <PendingActionsSharp />
            </IconButton>
          )}
          {idea.status === 'Fullfilled' && (
            <IconButton sx={{ color: cardTheme.color }}>
              <DoneAllSharp />
            </IconButton>
          )}
          <IconButton sx={{ color: cardTheme.color }} onClick={() => { dispatch(setIdea(idea)); navigate(`/idea/${idea.id}/edit`) }} >
            <EditSharp />
          </IconButton>
          <IconButton sx={{ color: cardTheme.color }} onClick={() => { setDeletingIdeaId(idea.id); setOpen(true) }} >
            <DeleteSharp />
          </IconButton>
        </div>
      </CardActions>
      <CardContent sx={{ p: '5px' }}>
        <Typography gutterBottom variant="h4" component="div">
          {idea.title}
        </Typography>
        <Typography variant="h5" color={cardTheme.descColor}>
          {idea.description}
        </Typography>
      </CardContent>
    </Card >
  )
}

export default CustomCard
