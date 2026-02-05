import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';

const TaskForm = ({ open, onClose, onSubmit, initialTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        due_date: initialTask.due_date || '',
        priority: initialTask.priority || 'medium',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
      });
    }
    setErrors({});
  }, [initialTask, open]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!validate()) {
      return;
    }

    const taskData = {
      ...formData,
      description: formData.description.trim() || null,
      due_date: formData.due_date || null,
    };

    onSubmit(taskData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      due_date: '',
      priority: 'medium',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={handleChange('title')}
              error={Boolean(errors.title)}
              helperText={errors.title}
              required
              fullWidth
              autoFocus
              inputProps={{ maxLength: 100 }}
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              error={Boolean(errors.description)}
              helperText={errors.description || `${formData.description.length}/500`}
              multiline
              rows={3}
              fullWidth
              inputProps={{ maxLength: 500 }}
            />

            <TextField
              label="Due Date"
              type="date"
              value={formData.due_date}
              onChange={handleChange('due_date')}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={handleChange('priority')}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialTask ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

TaskForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialTask: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    due_date: PropTypes.string,
    priority: PropTypes.string,
  }),
};

TaskForm.defaultProps = {
  initialTask: null,
};

export default TaskForm;
