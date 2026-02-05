import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

const TaskFilters = ({ filters, onFilterChange }) => {
  const handleStatusChange = (status) => {
    onFilterChange({ ...filters, status });
  };

  const handlePriorityChange = (event) => {
    onFilterChange({ ...filters, priority: event.target.value });
  };

  const handleSortChange = (event) => {
    onFilterChange({ ...filters, sortBy: event.target.value });
  };

  const handleSearchChange = (event) => {
    onFilterChange({ ...filters, search: event.target.value });
  };

  const handleClearSearch = () => {
    onFilterChange({ ...filters, search: '' });
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search tasks..."
        value={filters.search || ''}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: filters.search && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Status Filter Chips */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label="All"
          onClick={() => handleStatusChange('all')}
          color={filters.status === 'all' ? 'primary' : 'default'}
          variant={filters.status === 'all' ? 'filled' : 'outlined'}
        />
        <Chip
          label="Active"
          onClick={() => handleStatusChange('active')}
          color={filters.status === 'active' ? 'primary' : 'default'}
          variant={filters.status === 'active' ? 'filled' : 'outlined'}
        />
        <Chip
          label="Completed"
          onClick={() => handleStatusChange('completed')}
          color={filters.status === 'completed' ? 'primary' : 'default'}
          variant={filters.status === 'completed' ? 'filled' : 'outlined'}
        />
      </Box>

      {/* Priority and Sort Filters */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 150, flex: 1 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority || 'all'}
            onChange={handlePriorityChange}
            label="Priority"
          >
            <MenuItem value="all">All Priorities</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150, flex: 1 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy || 'created_at'}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="created_at">Created Date</MenuItem>
            <MenuItem value="due_date">Due Date</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="title">Title</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

TaskFilters.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string,
    priority: PropTypes.string,
    sortBy: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default TaskFilters;
