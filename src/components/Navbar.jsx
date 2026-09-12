import {
  useEffect,
  useState,
} from "react";

import {
  Link as ScrollLink,
} from "react-scroll";

import {
  FiDownload,
  FiMenu,
  FiX,
} from "react-icons/fi";

import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const [isOpen, setIsOpen] =
    useState(false);

  const navItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Skills", id: "skills" },
    {
      name: "Experience",
      id: "experience",
    },
    {
      name: "Education",
      id: "education",
    },
    {
      name: "Projects",
      id: "projects",
    },
    {
      name: "Certificates",
      id: "certificates",
    },
    {
      name: "Contact",
      id: "contact",
    },
  ];

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  return (
    <nav
      className="
        fixed
        left-0
        right-0
        top-0
        z-50
        w-full

        border-b
        border-slate-200
        bg-white/95
        backdrop-blur-xl

        dark:border-slate-700
        dark:bg-slate-900/95
      "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-7xl
          items-center
          justify-end
          gap-3
          px-4
          py-3

          sm:px-6
          sm:py-3.5

          lg:px-8
        "
      >
        {/* Desktop */}
        <div
          className="
            hidden
            items-center
            gap-1

            lg:flex
          "
        >
          {navItems.map((item) => (
            <ScrollLink
              key={item.id}
              to={item.id}
              smooth
              duration={600}
              offset={-80}
              spy
              activeClass="!text-indigo-600 dark:!text-indigo-400"
              className="
                cursor-pointer
                whitespace-nowrap
                rounded-md
                px-2.5
                py-2

                text-xs
                font-medium
                text-slate-600

                transition
                duration-300

                hover:bg-slate-100
                hover:text-slate-950

                dark:text-slate-400
                dark:hover:bg-slate-800
                dark:hover:text-white

                xl:px-3
                xl:text-sm
              "
            >
              {item.name}
            </ScrollLink>
          ))}

          <div
            className="
              mx-2
              h-6
              w-px
              bg-slate-200

              dark:bg-slate-700
            "
          />

          <ThemeToggle />

          <a
            href="/resume"
            className="
              ml-2
              flex
              shrink-0
              items-center
              gap-2
              rounded-lg

              bg-indigo-600
              px-4
              py-2.5

              text-xs
              font-semibold
              text-white

              shadow-sm

              transition
              duration-300

              hover:-translate-y-0.5
              hover:bg-indigo-500

              xl:text-sm
            "
          >
            <FiDownload size={15} />
            Resume
          </a>
        </div>

        {/* Mobile */}
        <div
          className="
            flex
            items-center
            gap-2

            lg:hidden
          "
        >
          <ThemeToggle />

          <button
            type="button"
            onClick={() =>
              setIsOpen(
                (previous) =>
                  !previous
              )
            }
            aria-label={
              isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-lg
              border
              border-slate-200

              bg-white
              text-slate-700

              shadow-sm
              transition

              hover:border-indigo-300
              hover:text-indigo-600

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-300
              dark:hover:border-indigo-500/40
              dark:hover:text-white
            "
          >
            {isOpen ? (
              <FiX size={21} />
            ) : (
              <FiMenu size={21} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className="
            border-t
            border-slate-200

            bg-white
            px-4
            py-4

            shadow-xl

            dark:border-slate-700
            dark:bg-slate-900

            sm:px-6

            lg:hidden
          "
        >
          <div
            className="
              mx-auto
              flex
              w-full
              max-w-xl
              flex-col
              gap-1
            "
          >
            {navItems.map((item) => (
              <ScrollLink
                key={item.id}
                to={item.id}
                smooth
                duration={600}
                offset={-72}
                spy
                onClick={closeMenu}
                activeClass="!bg-indigo-50 !text-indigo-600 dark:!bg-indigo-500/10 dark:!text-indigo-400"
                className="
                  w-full
                  cursor-pointer
                  rounded-lg
                  px-4
                  py-3

                  text-sm
                  font-medium
                  text-slate-700

                  transition

                  hover:bg-slate-100
                  hover:text-slate-950

                  dark:text-slate-300
                  dark:hover:bg-slate-800
                  dark:hover:text-white
                "
              >
                {item.name}
              </ScrollLink>
            ))}

            <a
              href="/resume"
              onClick={closeMenu}
              className="
                mt-3
                flex
                items-center
                justify-center
                gap-2

                rounded-lg
                bg-indigo-600

                px-4
                py-3

                text-sm
                font-semibold
                text-white

                transition

                hover:bg-indigo-500
              "
            >
              <FiDownload size={16} />
              View Resume
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;