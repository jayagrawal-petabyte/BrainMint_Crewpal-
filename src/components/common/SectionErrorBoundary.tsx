import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface SectionErrorBoundaryProps {
  title?: string;
  children: ReactNode;
  fallbackMessage?: string;
  onRetry?: () => void;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  state: SectionErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): SectionErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `[SectionErrorBoundary] Render error in "${this.props.title || 'Section'}":`,
      error,
      errorInfo
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#fdf8e8] rounded-2xl border border-rose-200 p-4 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-forest-900">
              {this.props.title || 'Section Unavailable'}
            </h3>
            <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
              <AlertCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xs text-rose-800/80">
            {this.props.fallbackMessage ||
              'An isolated error occurred while rendering this section.'}
          </p>
          <div className="pt-1">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-900 hover:bg-rose-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry section</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;
