function LoadingState({
  message = "Loading...",
}) {
  return (
    <div
      className="flex min-h-40 flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
      role="status"
      aria-live="polite"
    >
      <div
        className="loading-spinner"
        aria-hidden="true"
      />

      <p className="text-sm text-slate-400">
        {message}
      </p>

      <span className="sr-only">
        {message}
      </span>
    </div>
  );
}

export default LoadingState;