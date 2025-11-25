import React, { Component, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorState from './ErrorState';
import { categorizeError, ErrorInfo } from '@/lib/utils';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: any;
  errorInfo?: ErrorInfo;
}

class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): State {
    const errorInfo = categorizeError(error);
    return { 
      hasError: true, 
      error,
      errorInfo
    };
  }

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
    console.error('Global Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    const { errorInfo } = this.state;
    
    if (errorInfo?.retryAction) {
      errorInfo.retryAction();
    } else if (errorInfo?.type === 'not-found' || errorInfo?.type === 'forbidden') {
      // Navigate to home for navigation errors
      window.location.href = '/';
    } else {
      // Default: reload page
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError && this.state.errorInfo) {
      const { errorInfo } = this.state;

      return (
        <ErrorState
          type={errorInfo.type}
          title={errorInfo.title}
          message={errorInfo.message}
          onRetry={errorInfo.showRetry ? this.handleRetry : undefined}
          showRetry={errorInfo.showRetry}
          fullPage={true}
        />
      );
    }

    return this.props.children;
  }
}

// Hook for easier usage in functional components
export const useSmartErrorHandler = () => {
  const navigate = useNavigate();
  
  const handleError = (error: any) => {
    const errorInfo = categorizeError(error);
    console.error('Handling error:', errorInfo);
    
    if (errorInfo.retryAction) {
      errorInfo.retryAction();
    } else if (errorInfo.type === 'not-found' || errorInfo.type === 'forbidden') {
      navigate('/');
    }
    
    return errorInfo;
  };

  return { handleError };
};

export default GlobalErrorBoundary;