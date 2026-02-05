import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, CircularProgress } from '@mui/material';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, loading, error, onToggleComplete, onEdit, onDelete }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No tasks found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first task to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onToggleComplete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

TaskList.defaultProps = {
  loading: false,
  error: null,
};

export default TaskList;
