import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "salehaimtiaz55@gmail.com";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const loggedInUser = userCredential.user;

      /*
        Only the configured admin email
        is allowed to access the dashboard.
      */

      if (
        !loggedInUser.email ||
        loggedInUser.email.toLowerCase() !==
          ADMIN_EMAIL.toLowerCase()
      ) {
        await signOut(auth);

        setError(
          "This account is not authorized to access the admin dashboard."
        );

        return;
      }

      /*
        Correct dashboard route.
      */

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      if (
        error?.code ===
        "auth/invalid-credential"
      ) {
        setError(
          "Invalid email or password."
        );
      } else if (
        error?.code ===
        "auth/invalid-email"
      ) {
        setError(
          "Please enter a valid email address."
        );
      } else if (
        error?.code ===
        "auth/too-many-requests"
      ) {
        setError(
          "Too many login attempts. Please try again later."
        );
      } else if (
        error?.code ===
        "auth/user-disabled"
      ) {
        setError(
          "This account has been disabled."
        );
      } else {
        setError(
          "Unable to sign in. Please check your email and password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
      >

        {/* ================= HEADER ================= */}

        <div className="mb-8">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Saleha's Portfolio
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Private access only
          </p>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ================= EMAIL ================= */}

        <div className="mb-5">

          <label
            htmlFor="admin-email"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Email
          </label>

          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Admin email"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />

        </div>

        {/* ================= PASSWORD ================= */}

        <div className="mb-6">

          <label
            htmlFor="admin-password"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Password
          </label>

          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />

        </div>

        {/* ================= LOGIN BUTTON ================= */}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        {/* ================= BACK TO PORTFOLIO ================= */}

        <a
          href="/"
          className="mt-4 block text-center text-sm text-slate-500 transition hover:text-indigo-400"
        >
          ← Back to Portfolio
        </a>

      </form>

    </div>
  );
}

export default Login;