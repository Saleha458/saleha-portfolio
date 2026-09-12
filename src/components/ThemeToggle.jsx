import {
  FiMoon,
  FiSun,
} from "react-icons/fi";

import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const {
    isDark,
    toggleTheme,
  } = useTheme();

  const label = isDark
    ? "Switch to light mode"
    : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="
        inline-flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        border-white/10
        bg-white/5
        text-slate-300
        shadow-sm
        transition
        duration-300
        hover:bg-white/10
        hover:text-white
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
        focus:ring-offset-2
        focus:ring-offset-slate-950
      "
    >
      {isDark ? (
        <FiSun
          size={18}
          aria-hidden="true"
        />
      ) : (
        <FiMoon
          size={18}
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export default ThemeToggle;