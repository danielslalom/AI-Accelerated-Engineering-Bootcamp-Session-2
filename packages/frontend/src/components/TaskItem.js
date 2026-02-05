import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Checkbox,
  IconButton,
  Chip,
  Box,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Flag as FlagIcon,
  Event as EventIcon,
} from '@mui/icons-material';

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const priorityColors = {
    high: 'error',
    medium: 'warning',
    low: 'success',
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !task.completed;
  };

  return (
    <Card
      sx={{
        mb: 2,
        opacity: task.completed ? 0.7 : 1,
        borderLeft: `4px solid`,
        borderLeftColor: priorityColors[task.priority] ? `${priorityColors[task.priority]}.main` : 'grey.300',
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Checkbox
            checked={Boolean(task.completed)}
            onChange={() => onToggleComplete(task.id)}
            color="primary"
            sx={{ mt: -1 }}
            aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body1"
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
                fontWeight: 500,
                mb: 0.5,
              }}
            >
              {task.title}
            </Typography>
            
            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {task.description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip
                icon={<FlagIcon />}
                label={task.priority}
                size="small"
                color={priorityColors[task.priority]}
                sx={{ textTransform: 'capitalize' }}
              />
              
              {task.due_date && (
                <Chip
                  icon={<EventIcon />}
                  label={formatDate(task.due_date)}
                  size="small"
                  color={isOverdue(task.due_date) ? 'error' : 'default'}
                  variant={isOverdue(task.due_date) ? 'filled' : 'outlined'}
                />
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 1 }}>
        <IconButton
          size="small"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.title}`}
          color="primary"
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    due_date: PropTypes.string,
    priority: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
    completed: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
  }).isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TaskItem;
