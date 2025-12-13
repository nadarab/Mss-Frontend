import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// Suppress React DOM errors during navigation
const originalError = console.error;
console.error = (...args) => {
  const errorMessage = args[0]?.toString() || '';
  if (
    errorMessage.includes('removeChild') ||
    errorMessage.includes('NotFoundError') ||
    errorMessage.includes('Failed to execute')
  ) {
    // Silently suppress navigation-related DOM errors
    return;
  }
  originalError.apply(console, args);
};

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  if (
    event.message?.includes('removeChild') ||
    event.message?.includes('NotFoundError') ||
    event.error?.message?.includes('removeChild')
  ) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
});

// Global unhandled rejection handler
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message?.includes('removeChild') ||
    event.reason?.message?.includes('NotFoundError')
  ) {
    event.preventDefault();
    return false;
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <App />
  // Temporarily disabled StrictMode to fix IntersectionObserver conflicts
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);


