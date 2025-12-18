/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error, { extra: errorInfo });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: '#F8FAFC' }}>
          <div className="bg-white rounded-4 shadow-lg p-4 p-md-5 border border-secondary" style={{ maxWidth: '28rem' }}>
            <div className="d-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle mx-auto mb-4"
                 style={{ width: '4rem', height: '4rem' }}>
              <svg
                style={{ width: '2rem', height: '2rem' }}
                className="text-danger"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="h4 fw-bold text-center text-dark mb-2">
              Something went wrong
            </h2>
            <p className="text-secondary text-center mb-4">
              We apologize for the inconvenience. The application encountered an unexpected error.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 p-3 bg-light rounded-3 border border-secondary">
                <summary className="fw-semibold text-secondary mb-2" style={{ cursor: 'pointer', fontSize: '0.875rem' }}>
                  Error Details (Development Only)
                </summary>
                <div className="font-monospace small text-secondary" style={{ wordBreak: 'break-all' }}>
                  <p className="fw-bold text-danger mb-2">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className="overflow-auto" style={{ maxHeight: '12rem', whiteSpace: 'pre-wrap' }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="d-flex gap-2">
              <button
                onClick={this.handleReset}
                className="btn btn-dark flex-fill py-2 fw-bold"
                style={{ fontSize: '0.875rem' }}
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-light flex-fill py-2 fw-bold"
                style={{ fontSize: '0.875rem' }}
              >
                Reload Page
              </button>
            </div>

            <p className="text-center text-secondary mt-3" style={{ fontSize: '0.75rem' }}>
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
