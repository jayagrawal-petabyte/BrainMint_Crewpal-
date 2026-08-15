import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(
    error: Error
  ): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(
    error: Error,
    errorInfo: ErrorInfo
  ) {
    console.error(
      "Application Error:",
      error,
      errorInfo
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F3D7] flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#F5C8C8] flex items-center justify-center">
              <span className="text-2xl font-bold text-[#8B3030]">
                !
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#1B1B1B] mb-2">
              Something went wrong
            </h1>

            <p className="text-gray-500 mb-6">
              An unexpected error occurred while loading
              this page. Please try again.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="rounded-xl bg-[#355E3B] px-5 py-2.5 text-white font-medium hover:bg-[#2d4f31] transition-colors"
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="rounded-xl bg-gray-100 px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>

            {import.meta.env.DEV &&
              this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500">
                    Show error details
                  </summary>

                  <pre className="mt-3 p-3 rounded-lg bg-gray-100 text-xs text-red-700 overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;