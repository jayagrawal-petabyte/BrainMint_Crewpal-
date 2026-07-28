import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          backgroundColor: 'var(--bg-page)',
          color: 'var(--text-main)',
          padding: '24px'
        }}>
          <div style={{
            maxWidth: '480px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              display: 'inline-grid',
              placeItems: 'center',
              marginBottom: '16px'
            }}>
              <AlertTriangle size={28} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>
              Application Exception Caught
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
              The Global Error Boundary intercepted an unexpected runtime exception in the School ERP module.
            </p>
            <div style={{
              backgroundColor: 'var(--bg-page)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: 'var(--danger-text)',
              textAlign: 'left',
              marginBottom: '24px',
              maxHeight: '120px',
              overflow: 'auto'
            }}>
              {this.state.error && this.state.error.toString()}
            </div>
            <button className="btn btn-primary" onClick={this.handleReset} style={{ width: '100%' }}>
              <RefreshCw size={16} /> Reload Application Workspace
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
