import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tokens } from '../../theme';
import Project_Cat_comp from '../../components/Project_Cat_comp';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../redux/userReducers';
import { BorderColorTwoTone, DeleteOutlineTwoTone } from '@mui/icons-material';
import { last_opened } from '../../utils/Last_Opened'

const Project = ({ setActive, projects, setProjects }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode, theme.palette.variantColor);
  const { project_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector(state => state.user);
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');

  const [editingColumn, setEditingColumn] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [hoveredTask, setHoveredTask] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskName, setEditingTaskName] = useState('');

  const currentProject = projects.find((project) => project.id === project_id);

  // State for the columns
  const [columns, setColumns] = useState({
    'toDo': {
      name: 'To-Do',
      color: colors.grey[500],
      items: []
    },
    'inProgress': {
      name: 'In-Progress',
      color: '#28456c',
      items: []
    },
    'done': {
      name: 'Done',
      color: '#2b593f',
      items: []
    }
  });

  // Fetch tasks and columns when the component mounts
  useEffect(() => {
    last_opened(`${project_id}`, token, "project");
    document.title = `ProFectivity - Projects`;
    setActive(project_id);
    const fetchTasks = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/project/${project_id}/show`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data.success) {
          setColumns({
            toDo: { ...columns.toDo, items: res.data.project.fields['To-Do'] || [] },
            inProgress: { ...columns.inProgress, items: res.data.project.fields['In-Progress'] || [] },
            done: { ...columns.done, items: res.data.project.fields['Done'] || [] },
          });
          document.title = `${res.data.project.name}`;
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [project_id, currentProject]);

  // Handle the drag end event
  const handleOnDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.draggableId === source.draggableId && destination.index === source.index) {
      return;
    }

    const taskId = draggableId;

    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    const destinationName = columns[destination.droppableId].name;
    const [movedTask] = sourceColumn.items.splice(source.index, 1);
    destinationColumn.items.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destinationColumn,
    });

    // Update task in backend
    try {
      const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/task/${taskId}/${project_id}/updateField`, {
        field: destinationName
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        dispatch(setAlert({ type: 'success', message: response.data.message }));
      }
    } catch (error) {
      dispatch(setAlert({ type: 'error', message: error.message }));
    }
  };

  const handleAddTaskClick = (columnId) => {
    setEditingColumn(columnId);
    setNewTaskTitle('');
  };

  const handleTaskSubmit = async (columnId, columnName) => {
    if (newTaskTitle.trim() === '') return;

    try {
      const res = await axios.post(import.meta.env.VITE_SERVER_URL + `/api/task/${project_id}/create`, {
        title: newTaskTitle,
        field: columnName,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {

        const newTask = res.data.task;

        setColumns((prevColumns) => ({
          ...prevColumns,
          [columnId]: {
            ...prevColumns[columnId],
            items: [...prevColumns[columnId].items, newTask],
          },
        }));

      }
      // Reset the input state
      setEditingColumn(null);
      setNewTaskTitle('');
    } catch (error) {
      dispatch(setAlert({ type: 'error', message: 'Something wrong' }));
    }
  };

  const handleNameChange = async (e) => {
    const updatedName = e.target.value;

    // Optimistically update the UI
    setProjects((prev) =>
      prev.map((p) => (p.id === project_id ? { ...p, name: updatedName } : p))
    );

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/project/${project_id}/rename`,
        { name: updatedName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        // Revert the project name in the state
        setProjects((prev) =>
          prev.map((p) => (p.id === project_id ? { ...p, name: currentProject.name } : p))
        );
      }
    } catch (error) {
      // Revert the project name in the state
      setProjects((prev) =>
        prev.map((p) => (p.id === project_id ? { ...p, name: currentProject.name } : p))
      );
    }
  };

  const handleEditTask = (id, name) => {
    setEditingTaskId(id);
    setEditingTaskName(name);
  }

  const handleEditTaskSubmit = async (taskId, columnName, columnId) => {
    try {
      const res = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/task/${taskId}/${project_id}/update`,
        {
          title: editingTaskName,
          field: columnName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setColumns((prevCols) => ({
          ...prevCols,
          [columnId]: {
            ...prevCols[columnId],
            items: prevCols[columnId].items.map((task) =>
              task.id === taskId ? { ...task, title: editingTaskName } : task
            ),
          },
        }));
        dispatch(setAlert({ type: 'success', message: res.data.message }));
      }
      setEditingTaskId(null); // Exit edit mode
    } catch (error) {
      dispatch(setAlert({ type: 'error', message: 'Failed to update task.' }));
    }
  }

  const handleDeleteTask = async (taskId, columnId) => {
    try {
      const res = await axios.delete(import.meta.env.VITE_SERVER_URL + `/api/task/${taskId}/${project_id}/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setColumns((prevCols) => ({
          ...prevCols,
          [columnId]: {
            ...prevCols[columnId],
            items: prevCols[columnId].items.filter((task) => task.id !== taskId)
          },
        }));
        dispatch(setAlert({ type: 'success', message: res.data.message }));
      }
      setEditingTaskId(null); // Exit edit mode
    } catch (error) {
      dispatch(setAlert({ type: 'error', message: 'Failed to update task.' }));
    }
  }

  return (
    <Box m={isNonMediumScreen ? '15px 90px' : '1.5rem .5rem'}>
      <input
        value={currentProject ? currentProject.name : ''}
        onChange={handleNameChange}
        style={{
          border: 'none',
          backgroundColor: theme.palette.background.default,
          outline: 'none',
          color: theme.palette.mode === 'dark' ? '#fff' : '#000',
          fontSize: '2rem',
          borderBottom: `1px solid ${colors.grey[600]}`,
          width: '100%',
          padding: isNonMediumScreen ? '0.1rem' : '0.5rem',
        }}
      />

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', p: '0.5rem' }}>
          {Object.entries(columns).map(([columnId, column], index) => (
            <Droppable droppableId={columnId} key={columnId}>
              {(provided, snapshot) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    p: '0.5rem',
                    borderRadius: '5px',
                    minHeight: '300px',
                    width: isNonMobileScreen ? null : '17rem'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Project_Cat_comp name={column.name} color={column.color} />
                    <Typography variant='body2' sx={{ color: colors.text }}>{column.items.length}</Typography>
                  </Box>
                  {column.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            mb: 2,
                            mt: 1,
                            p: 2,
                            backgroundColor: snapshot.isDragging ? colors.grey[300] : colors.grey[100],
                            borderRadius: '5px',
                            boxShadow: snapshot.isDragging
                              ? '0px 4px 12px rgba(0, 0, 0, 0.15)'
                              : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer !important',
                          }}
                          onMouseEnter={() => setHoveredTask(item.id)} // Set the hovered task
                          onMouseLeave={() => setHoveredTask(null)}
                        >
                          {
                            editingTaskId === item.id ?
                              <TextField
                                value={editingTaskName}
                                onChange={(e) => setEditingTaskName(e.target.value)}
                                onBlur={() => handleEditTaskSubmit(item.id, column.name, columnId)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEditTaskSubmit(item.id, column.name, columnId)
                                  }
                                }}
                                autoFocus
                                fullWidth
                              />
                              :
                              <Typography variant='h5' onDoubleClick={() => handleEditTask(item.id, item.title)}>{item.title}</Typography>
                          }
                          <Box className="action-icons"
                            sx={{
                              display: editingTaskId !== item.id ? 'flex' : 'none',
                              gap: '0.5rem',
                              opacity: hoveredTask === item.id ? 1 : 0, // Show icons only when hovering
                              transition: 'opacity 0.3s ease-in-out',
                            }}>
                            <BorderColorTwoTone titleAccess='Edit Task' onClick={() => handleEditTask(item.id, item.title)} />
                            <DeleteOutlineTwoTone titleAccess='Delete Task' onClick={() => handleDeleteTask(item.id, columnId)} />
                          </Box>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {editingColumn === columnId ? (
                    <TextField
                      variant="standard"
                      fullWidth
                      placeholder="Enter task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onBlur={() => setEditingColumn(null)} // Cancel editing if input loses focus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleTaskSubmit(columnId, column.name);
                        }
                      }}
                      autoFocus
                      sx={{
                        mt: 1,
                        backgroundColor: theme.palette.background.default,
                        outline: 'none',
                      }}
                    />
                  ) : (
                    <Typography
                      onClick={() => handleAddTaskClick(columnId)}
                      sx={{
                        mt: 1,
                        p: 2,
                        borderRadius: '0.3rem',
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                        width: '100%',
                        cursor: 'pointer',
                        "&:hover": {
                          backgroundColor: colors.grey[100]
                        }
                      }}
                    >
                      + New
                    </Typography>
                  )}

                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default Project;
