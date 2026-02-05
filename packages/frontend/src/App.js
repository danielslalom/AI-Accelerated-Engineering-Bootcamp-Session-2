import React, { useState, useEffect, useCallback } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Fab,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import theme from './theme';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import ConfirmDialog from './components/ConfirmDialog';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    sortBy: 'created_at',
    sortOrder: 'DESC',
    search: '',
  });
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.status !== 'all') {
        params.status = filters.status;
      }
      if (filters.priority !== 'all') {
        params.priority = filters.priority;
      }
      if (filters.search) {
        params.search = filters.search;
      }
      params.sortBy = filters.sortBy;
      params.sortOrder = filters.sortOrder;
      
      const response = await axios.get('/api/tasks', { params });
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks: ' + err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create or update task
  const handleSubmitTask = async (taskData) => {
    try {
      if (editTask) {
        // Update existing task
        await axios.put(`/api/tasks/${editTask.id}`, taskData);
        showSnackbar('Task updated successfully', 'success');
      } else {
        // Create new task
        await axios.post('/api/tasks', taskData);
        showSnackbar('Task created successfully', 'success');
      }
      fetchTasks();
    } catch (err) {
      showSnackbar('Failed to save task: ' + err.message, 'error');
      console.error('Error saving task:', err);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (taskId) => {
    try {
      await axios.patch(`/api/tasks/${taskId}/complete`);
      fetchTasks();
    } catch (err) {
      showSnackbar('Failed to update task: ' + err.message, 'error');
      console.error('Error toggling task:', err);
    }
  };

  // Open edit dialog
  const handleEdit = (task) => {
    setEditTask(task);
    setFormOpen(true);
  };

  // Open delete confirmation
  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/tasks/${taskToDelete}`);
      showSnackbar('Task deleted successfully', 'success');
      fetchTasks();
    } catch (err) {
      showSnackbar('Failed to delete task: ' + err.message, 'error');
      console.error('Error deleting task:', err);
    } finally {
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Open create task dialog
  const handleOpenCreateDialog = () => {
    setEditTask(null);
    setFormOpen(true);
  };

  // Close task form dialog
  const handleCloseForm = () => {
    setFormOpen(false);
    setEditTask(null);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            TODO App
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Keep track of your tasks and stay organized
          </Typography>
        </Box>

        {/* Filters */}
        <TaskFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Task List */}
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        {/* Floating Action Button */}
        <Fab
          color="secondary"
          aria-label="Add task"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={handleOpenCreateDialog}
        >
          <AddIcon />
        </Fab>

        {/* Task Form Dialog */}
        <TaskForm
          open={formOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitTask}
          initialTask={editTask}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteDialogOpen(false)}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;
