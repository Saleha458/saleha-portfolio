import {
  lazy,
  Suspense,
  useEffect,
} from "react";

import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

/*
 * Home stays eager because it is the primary route.
 */
import Home from "./pages/Home";

/*
 * Secondary routes are lazy-loaded.
 * Visitors opening the public portfolio do not
 * need Admin + Resume code in the initial bundle.
 */

const Login = lazy(
  () =>
    import(
      "./pages/Login"
    )
);

const Dashboard = lazy(
  () =>
    import(
      "./pages/Dashboard"
    )
);

const Resume = lazy(
  () =>
    import(
      "./pages/Resume"
    )
);

/* =========================================================
   SCROLL TO TOP
========================================================= */

function ScrollToTop() {
  const {
    pathname,
  } = useLocation();

  useEffect(() => {
    window.scrollTo(
      0,
      0
    );
  }, [pathname]);

  return null;
}

/* =========================================================
   ROUTE FALLBACK
========================================================= */

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />

        <p className="mt-4 text-sm text-slate-500">
          Loading...
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   NOT FOUND
========================================================= */

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
          404
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-slate-400">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Back to Home
          </Link>

          <Link
            to="/resume"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            View Resume
          </Link>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <div className="app-shell">
        <Suspense
          fallback={
            <RouteFallback />
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <Home />
              }
            />

            <Route
              path="/resume"
              element={
                <Resume />
              }
            />

            <Route
              path="/admin"
              element={
                <Login />
              }
            />

            <Route
              path="/dashboard"
              element={
                <Dashboard />
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <Dashboard />
              }
            />

            <Route
              path="*"
              element={
                <NotFound />
              }
            />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;