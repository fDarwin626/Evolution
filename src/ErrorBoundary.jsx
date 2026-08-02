import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-10">
          <div className="max-w-2xl text-center">
            <h1 className="text-5xl font-light mb-6">Oops! Something went wrong</h1>
            <p className="text-xl mb-8 text-white/70">
              The page encountered an error. This might be due to:
            </p>
            <ul className="text-left text-lg mb-8 space-y-2 text-white/60">
              <li>• Low device memory</li>
              <li>• Slow internet connection</li>
              <li>• Browser compatibility issue</li>
            </ul>
            <button 
              onClick={() => window.location.reload()} 
              className="px-8 py-4 bg-white text-black rounded-lg text-lg font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Refresh Page
            </button>
            {this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-white/50 hover:text-white/70">
                  Technical Details
                </summary>
                <pre className="mt-4 p-4 bg-white/10 rounded text-sm overflow-auto text-white/60">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary