# UI Guidelines

## Overview
This document defines the user interface standards and design principles for the TODO application. Following these guidelines ensures a consistent, accessible, and polished user experience.

## Design System

### Material Design
- **Framework**: All UI components must use Material Design (Material-UI/MUI for React)
- **Version**: Use Material-UI v5 or later
- **Rationale**: Material Design provides a comprehensive, battle-tested component library with built-in accessibility and responsive behavior

### Component Library
- Import components from `@mui/material`
- Use Material icons from `@mui/icons-material`
- Leverage Material's theming system for consistent styling

## Button Design

### Button Styling
- **Weight**: All buttons must use **bold text** (font-weight: 700 or `fontWeight: 'bold'`)
- **Corners**: All buttons must have **rounded corners**
  - Use `borderRadius: 2` (16px) for primary actions
  - Use `borderRadius: 1.5` (12px) for secondary actions
- **Variants**:
  - Primary actions: `variant="contained"` with bold text
  - Secondary actions: `variant="outlined"` with bold text
  - Tertiary actions: `variant="text"` with bold text

### Button Examples
```jsx
// Primary action button
<Button 
  variant="contained" 
  sx={{ 
    fontWeight: 'bold',
    borderRadius: 2
  }}
>
  Add Task
</Button>

// Secondary action button
<Button 
  variant="outlined"
  sx={{ 
    fontWeight: 'bold',
    borderRadius: 2
  }}
>
  Cancel
</Button>
```

## Color Palette

### Primary Colors
- **Primary**: Material Blue (#1976d2)
  - Use for primary actions and key UI elements
  - App bar, primary buttons, selected states
- **Secondary**: Material Teal (#00897b)
  - Use for secondary actions and accents
  - FABs, checkboxes, toggle states

### Status Colors
- **Success**: Green (#2e7d32)
  - Completed tasks, success messages
- **Warning**: Orange (#ed6c02)
  - Tasks approaching due date
- **Error**: Red (#d32f2f)
  - Overdue tasks, error messages, delete actions
- **Info**: Light Blue (#0288d1)
  - Informational messages and hints

### Neutral Colors
- **Background**: #fafafa (light mode), #121212 (dark mode)
- **Surface**: #ffffff (light mode), #1e1e1e (dark mode)
- **Text Primary**: rgba(0, 0, 0, 0.87) (light mode), rgba(255, 255, 255, 0.87) (dark mode)
- **Text Secondary**: rgba(0, 0, 0, 0.6) (light mode), rgba(255, 255, 255, 0.6) (dark mode)

## Typography

### Font Family
- **Primary**: Roboto (Material Design default)
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif

### Text Hierarchy
- **Page Title**: `variant="h4"` (34px, bold)
- **Section Headers**: `variant="h6"` (20px, semi-bold)
- **Task Title**: `variant="body1"` (16px, regular)
- **Task Description**: `variant="body2"` (14px, regular)
- **Metadata/Labels**: `variant="caption"` (12px, regular)

### Button Text
- All button text must be **bold** (font-weight: 700)
- Use sentence case for button labels (e.g., "Add task" not "ADD TASK")

## Layout & Spacing

### Container
- **Max Width**: 1200px for desktop
- **Padding**: 24px on desktop, 16px on mobile
- **Center-aligned**: Main content should be centered on large screens

### Spacing Scale
Follow Material's 8px spacing scale:
- **xs**: 4px (0.5 spacing units)
- **sm**: 8px (1 spacing unit)
- **md**: 16px (2 spacing units)
- **lg**: 24px (3 spacing units)
- **xl**: 32px (4 spacing units)

### Grid System
- Use Material's Grid component for responsive layouts
- 12-column grid system
- Breakpoints:
  - xs: 0px (mobile)
  - sm: 600px (tablet)
  - md: 900px (small laptop)
  - lg: 1200px (desktop)
  - xl: 1536px (large desktop)

## Component Guidelines

### Task Cards
- Use `Card` component with elevation={1} for individual tasks
- Include `CardContent` for task details
- Add `CardActions` for task action buttons
- Hover state: elevation={3}
- **Corners**: Apply rounded corners (`borderRadius: 2`)

### Forms
- Use `TextField` with `variant="outlined"`
- Apply `fullWidth` for better mobile experience
- Include helper text for validation guidance
- Labels should be clear and concise
- **Input fields**: Subtle rounded corners (`borderRadius: 1`)

### Dialogs/Modals
- Use Material `Dialog` component
- Include `DialogTitle`, `DialogContent`, and `DialogActions`
- Always provide a close button
- Keep modals focused on a single task or action
- **Dialog corners**: Apply rounded corners to the dialog container

### Lists
- Use `List` and `ListItem` components for task lists
- Include `ListItemIcon` for checkboxes and priority indicators
- Use `ListItemText` with primary and secondary text
- Include `Divider` between list items for clarity

### App Bar
- Use `AppBar` with `position="static"` or `position="sticky"`
- Include app title and key actions
- Keep it minimal and uncluttered
- Primary color background

### Floating Action Button (FAB)
- Use for primary action (Add Task)
- Position: bottom-right corner
- Secondary color
- Include icon (`AddIcon`) from Material icons
- **Already rounded** by default in Material design

## Interactive States

### Hover States
- Cards: Increase elevation on hover
- Buttons: Subtle background color change (handled by Material)
- List items: Light background highlight

### Focus States
- Clear focus outline for keyboard navigation
- Use Material's default focus indicators
- Ensure sufficient color contrast (WCAG AA minimum)

### Loading States
- Use `CircularProgress` for loading indicators
- Skeleton screens for content loading (`Skeleton` component)
- Disable buttons during async operations

### Empty States
- Clear messaging when no tasks exist
- Include call-to-action button
- Use friendly, encouraging copy

## Icons

### Icon Library
- Use Material Icons (`@mui/icons-material`)
- Maintain consistent icon sizing (24px default)

### Common Icons
- Add: `AddIcon`
- Delete: `DeleteIcon`
- Edit: `EditIcon`
- Check/Complete: `CheckCircleIcon`
- Priority: `FlagIcon`
- Calendar/Due Date: `EventIcon`
- Search: `SearchIcon`
- Filter: `FilterListIcon`
- Sort: `SortIcon`

## Accessibility

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order
- Enter/Space to activate buttons
- Escape to close dialogs

### ARIA Labels
- Include `aria-label` for icon-only buttons
- Use `aria-describedby` for form field help text
- Proper heading hierarchy (h1 → h2 → h3)

### Color Contrast
- Minimum 4.5:1 contrast ratio for text
- Minimum 3:1 contrast ratio for UI components
- Don't rely on color alone to convey information

### Screen Reader Support
- Semantic HTML elements
- Announce dynamic content changes
- Descriptive link and button text

## Responsive Design

### Mobile (xs, sm)
- Single column layout
- Bottom sheet for actions/filters
- Larger touch targets (minimum 48x48px)
- FAB for primary action
- Simplified navigation

### Tablet (md)
- Two-column layout where appropriate
- Side panel for filters/details
- Maintain comfortable touch targets

### Desktop (lg, xl)
- Multi-column layout
- Sidebar navigation if needed
- Keyboard shortcuts
- Hover states and tooltips

## Animation & Transitions

### Transition Duration
- **Fast**: 200ms (small UI changes)
- **Standard**: 300ms (most transitions)
- **Slow**: 400ms (major layout changes)

### Animation Types
- Use Material's `Fade`, `Slide`, and `Grow` transitions
- Smooth page transitions
- Subtle micro-interactions
- Avoid excessive or distracting animations

### Loading Animations
- Use `CircularProgress` or `LinearProgress`
- Skeleton screens for content
- Smooth fade-in when content loads

## Error Handling & Feedback

### Success Messages
- Use `Snackbar` with success color
- Auto-dismiss after 3-4 seconds
- Position: bottom-center or bottom-left

### Error Messages
- Use `Alert` component with severity="error"
- Clear, actionable error messages
- Keep messages visible until user acknowledges

### Validation Feedback
- Inline validation for forms
- Error state on TextField with helper text
- Red color for error indication

## Theme Configuration

### Material-UI Theme Override
```jsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#00897b',
    },
  },
  typography: {
    button: {
      fontWeight: 700, // Bold buttons
      textTransform: 'none', // Sentence case
    },
  },
  shape: {
    borderRadius: 8, // Rounded corners default
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Bold rounded corners for buttons
          fontWeight: 700, // Ensure bold text
        },
      },
    },
  },
});
```

## Best Practices

1. **Consistency**: Use the same patterns throughout the app
2. **Simplicity**: Keep the UI clean and uncluttered
3. **Feedback**: Provide immediate feedback for all user actions
4. **Performance**: Optimize for fast load times and smooth interactions
5. **Accessibility**: Design for all users, including those with disabilities
6. **Mobile-First**: Design for mobile first, then enhance for larger screens
7. **Material Components**: Always prefer Material-UI components over custom implementations
8. **Bold Buttons**: Ensure all buttons use bold text with rounded corners as specified

## Resources

- [Material-UI Documentation](https://mui.com/)
- [Material Design Guidelines](https://material.io/design)
- [Material Icons](https://mui.com/material-ui/material-icons/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
