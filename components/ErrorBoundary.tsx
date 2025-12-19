/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../services/loggerService';

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
    // Log error using the logger service
    logger.error('ErrorBoundary caught an error', error, {
      componentStack: errorInfo.componentStack,
      digest: errorInfo.digest
    });

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
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: '#ffffff' }}>
          <div className="bg-white p-4 p-md-5 border border-dark" style={{ maxWidth: '28rem', borderWidth: '2px' }}>
            {/* Logo */}
            <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
              <div className="bg-dark d-flex align-items-center justify-content-center"
                   style={{ width: '48px', height: '48px' }}>
                <span className="fw-black text-white" style={{ fontSize: '24px' }}>P</span>
              </div>
              <span className="fw-bold text-dark" style={{ fontSize: '20px', letterSpacing: '0.1em' }}>PDFSLIDER</span>
            </div>

            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-dark mx-auto mb-3"
                   style={{ width: '64px', height: '64px' }}>
                <svg
                  style={{ width: '32px', height: '32px' }}
                  className="text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="fw-bold text-center text-dark mb-3 text-uppercase" style={{ letterSpacing: '0.1em', fontSize: '1.5rem' }}>
              ERROR
            </h2>
            <p className="text-dark text-center mb-4" style={{ opacity: 0.7, letterSpacing: '0.05em' }}>
              We apologize for the inconvenience. The application encountered an unexpected error.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 p-3 border border-dark" style={{ backgroundColor: '#f5f5f5' }}>
                <summary className="fw-bold text-dark mb-2 text-uppercase" style={{ cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                  Error Details (Dev Mode)
                </summary>
                <div className="font-monospace small text-dark" style={{ wordBreak: 'break-all', fontSize: '0.75rem' }}>
                  <p className="fw-bold mb-2">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className="overflow-auto" style={{ maxHeight: '12rem', whiteSpace: 'pre-wrap', fontSize: '0.7rem' }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="d-flex flex-column gap-2">
              <button
                onClick={this.handleReset}
                className="btn bg-dark text-white fw-bold text-uppercase w-100"
                style={{ fontSize: '0.875rem', letterSpacing: '0.1em', padding: '0.75rem', borderRadius: 0 }}
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn border border-dark text-dark fw-bold text-uppercase w-100"
                style={{ fontSize: '0.875rem', letterSpacing: '0.1em', padding: '0.75rem', backgroundColor: 'transparent', borderRadius: 0 }}
              >
                Reload Page
              </button>
            </div>

            <p className="text-center text-dark mt-4" style={{ fontSize: '0.75rem', opacity: 0.6, letterSpacing: '0.05em' }}>
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
