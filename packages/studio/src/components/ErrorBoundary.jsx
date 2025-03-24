import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Yakalanan hata:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded shadow-md">
          <h2 className="text-red-700 text-xl font-bold">
            Bir şeyler yanlış gitti
          </h2>
          <p className="text-red-600">
            {this.state.error?.message || "Beklenmeyen bir hata oluştu"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Tekrar Dene
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
