import React from "react";
import ErrorPage from "../pages/ErrorPage";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Keep console logging for now; swap with telemetry when available.
    console.error("App render error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          title="Something went wrong"
          message="An unexpected error occurred while loading this page."
          actionLabel="Go back home"
          onAction={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
