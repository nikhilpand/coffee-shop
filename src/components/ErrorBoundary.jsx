import React from 'react';
import { Coffee, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Café App Error Caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white rounded-3xl p-8 md:p-10 border border-border shadow-xl">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-5 text-espresso">
              <Coffee size={30} className="text-caramel animate-pulse" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-espresso mb-3">
              The kettle boiled over!
            </h1>
            <p className="text-sm text-warm-gray leading-relaxed mb-6">
              A momentary hiccup occurred while serving this page. Don&apos;t worry, your cart and table selections are safe.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cream hover:bg-sand/30 text-espresso rounded-full text-xs font-semibold border border-border transition-colors"
              >
                <RefreshCw size={14} /> Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-espresso hover:bg-coffee text-ivory rounded-full text-xs font-semibold transition-colors shadow-xs"
              >
                <Home size={14} /> Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
