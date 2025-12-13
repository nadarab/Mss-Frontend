import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if it's a DOM manipulation error during navigation
    if (error.message && (
      error.message.includes('removeChild') ||
      error.message.includes('NotFoundError')
    )) {
      // Silently handle - don't set error state
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Suppress React DOM errors during navigation
    if (error.message && (
      error.message.includes('removeChild') ||
      error.message.includes('NotFoundError') ||
      error.message.includes('Failed to execute')
    )) {
      // Silently ignore navigation-related DOM errors
      console.log('Navigation DOM error suppressed:', error.message);
      this.setState({ hasError: false, error: null });
      return;
    }
    // Log other errors
    console.error('Error caught by boundary:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    // Reset on route change
    if (this.props.location?.pathname !== prevProps.location?.pathname) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    // Always render children - error boundary just suppresses errors
    return this.props.children;
  }
}

export default ErrorBoundary;

