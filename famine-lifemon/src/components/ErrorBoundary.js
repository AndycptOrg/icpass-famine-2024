import React from 'react';

// Enhanced Error Boundary that displays the caught error prominently and
// gives the user actions (reload, copy details).
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: !!props.initialError,
      error: props.initialError || null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Save stack info for display and potential reporting
    this.setState({ errorInfo });
    if (typeof window !== 'undefined' && window.console) {
      console.error('Uncaught error:', error, errorInfo);
    }
  }

  reload = () => {
    if (typeof window !== 'undefined') window.location.reload();
  };

  copyDetails = () => {
    const { error, errorInfo } = this.state;
    const details = [
      error ? String(error) : '',
      errorInfo && errorInfo.componentStack ? errorInfo.componentStack : '',
    ].join('\n\n');
    try {
      navigator.clipboard && navigator.clipboard.writeText
        ? navigator.clipboard.writeText(details)
        : window.clipboardData && window.clipboardData.setData('Text', details);
      // Optional user feedback could be added here
    } catch (e) {
      // ignore copy failures
    }
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    if (hasError) {
      const shortMessage = error ? String(error).split('\n')[0] : 'An unexpected error occurred.';
      const stack = errorInfo && errorInfo.componentStack ? errorInfo.componentStack : '';
      return (
        <div style={{ padding: 20, fontFamily: 'sans-serif', color: '#222' }}>
          <h1 style={{ color: '#b00020' }}>Something went wrong</h1>
          <p style={{ fontSize: 16 }}>{shortMessage}</p>

          <div style={{ marginTop: 16 }}>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary style={{ cursor: 'pointer' }}>Show technical details</summary>
              <div style={{ marginTop: 8 }}>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error || '')}</pre>
                {stack && <pre style={{ whiteSpace: 'pre-wrap', color: '#666' }}>{stack}</pre>}
              </div>
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
