import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Material Blue
    },
    secondary: {
      main: '#00897b', // Material Teal
    },
    success: {
      main: '#2e7d32', // Green for completed tasks
    },
    warning: {
      main: '#ed6c02', // Orange for tasks approaching due date
    },
    error: {
      main: '#d32f2f', // Red for overdue tasks
    },
    info: {
      main: '#0288d1', // Light Blue for informational messages
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    button: {
      fontWeight: 700, // Bold buttons as per UI guidelines
      textTransform: 'none', // Sentence case for button labels
    },
  },
  shape: {
    borderRadius: 8, // Default rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Bold rounded corners for buttons (2 * 8px)
          fontWeight: 700, // Ensure all buttons are bold
          padding: '8px 24px', // Comfortable padding
        },
        contained: {
          boxShadow: 'none', // Flat design  
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)', // Subtle shadow on hover
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Rounded corners for cards
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // Elevation on hover
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // Subtle rounded corners for inputs
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          fontWeight: 700, // Bold text for FAB
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600, // Semi-bold for chips
        },
      },
    },
  },
});

export default theme;
