import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  /** Label used in the "Something went wrong rendering <label>." message. */
  label?: string;
  /** Optional fallback to render instead of the default message. */
  fallback?: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Last-resort safety net for risky subtrees (markdown/katex rendering,
 * third-party widgets). Catches render-phase errors so one bad message in
 * the chat doesn't blank the entire panel, then logs to the console with
 * enough context for a triage from the devtools.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(`[ErrorBoundary:${this.props.label ?? 'unknown'}]`, error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;
    return (
      <div className="px-3 py-2 rounded-lg bg-warning/10 border border-warning/30 text-xs text-warning font-mono">
        Couldn't render {this.props.label ?? 'this section'}.{' '}
        <button
          type="button"
          onClick={this.reset}
          className="underline underline-offset-2 hover:text-text"
        >
          Try again
        </button>
      </div>
    );
  }
}