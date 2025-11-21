import React, { Component, ReactNode } from 'react';
import ErrorState from './ErrorState';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Global Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          type="generic"
          title="Terjadi Kesalahan Aplikasi"
          message="Aplikasi mengalami kesalahan. Silakan muat ulang halaman atau coba lagi nanti."
          onRetry={() => window.location.reload()}
          fullPage={true}
        />
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;