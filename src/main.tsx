import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Viewer Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ marginBottom: '16px', color: '#ff6b6b' }}>
            3D Viewer Error
          </h1>
          <p style={{ marginBottom: '16px', color: '#cccccc' }}>
            Something went wrong while loading the 3D viewer.
          </p>
          <details style={{ 
            backgroundColor: '#2a2a2a', 
            padding: '16px', 
            borderRadius: '8px',
            maxWidth: '600px',
            textAlign: 'left'
          }}>
            <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
              Error Details
            </summary>
            <pre style={{ 
              fontSize: '12px', 
              color: '#ff9999',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: '#4a9eff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Check for WebGL support
const checkWebGLSupport = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
};

// WebGL not supported fallback
const WebGLNotSupported: React.FC = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    padding: '20px',
    textAlign: 'center'
  }}>
    <h1 style={{ marginBottom: '16px', color: '#ff6b6b' }}>
      WebGL Not Supported
    </h1>
    <p style={{ marginBottom: '16px', color: '#cccccc', maxWidth: '500px' }}>
      Your browser doesn't support WebGL, which is required for the 3D viewer to work.
      Please try using a modern browser like Chrome, Firefox, Safari, or Edge.
    </p>
    <p style={{ color: '#888888', fontSize: '14px' }}>
      If you're using a supported browser, try enabling hardware acceleration in your browser settings.
    </p>
  </div>
);

// Main render function
const renderApp = () => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  if (!checkWebGLSupport()) {
    root.render(<WebGLNotSupported />);
    return;
  }

  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// Initialize the app
renderApp();

// Hot module replacement for development
if (import.meta.hot) {
  import.meta.hot.accept('./App', () => {
    renderApp();
  });
}