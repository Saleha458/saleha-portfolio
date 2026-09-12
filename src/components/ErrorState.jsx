function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
}) {
  return (
    <div
      className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center"
      role="alert"
    >
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-xl text-red-400"
        aria-hidden="true"
      >
        !
      </div>

      <h3 className="mt-4 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;