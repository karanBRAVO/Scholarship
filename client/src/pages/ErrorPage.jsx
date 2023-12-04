const ErrorPage = () => {
  const containerStyle = {
    fontFamily: "sans-serif",
    backgroundColor: "#f7fafc",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const contentStyle = {
    textAlign: "center",
    padding: "2rem",
    maxWidth: "400px",
    backgroundColor: "#ffffff",
    borderRadius: "0.375rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
  };

  const errorCodeStyle = {
    fontSize: "4rem",
    fontWeight: "bold",
    color: "#e53e3e",
  };

  const errorMessageStyle = {
    fontSize: "1.25rem",
    color: "#4a5568",
    marginTop: "1rem",
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={errorCodeStyle}>404</div>
        <div style={errorMessageStyle}>Oops! Something went wrong.</div>
      </div>
    </div>
  );
};

export default ErrorPage;
