import {
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiCpu,
  FiFileText,
  FiFolder,
  FiLogOut,
  FiMail,
  FiTool,
  FiUser,
} from "react-icons/fi";

import {
  useNavigate,
} from "react-router-dom";

import {
  auth,
} from "../firebase";

import ProjectManager from "../components/ProjectManager";
import CertificateManager from "../components/CertificateManager";
import SkillManager from "../components/SkillManager";
import ExperienceManager from "../components/ExperienceManager";
import EducationManager from "../components/EducationManager";
import ResumeManager from "../components/ResumeManager";
import PersonalInfoManager from "../components/PersonalInfoManager";
import ContactManager from "../components/ContactManager";
import AITwinSettings from "../components/AITwinSettings";

const ADMIN_EMAIL =
  "salehaimtiaz55@gmail.com";

const NAVIGATION_ITEMS = [
  {
    id: "projects",
    label: "Projects",
    icon: FiFolder,
  },

  {
    id: "certificates",
    label: "Certificates",
    icon: FiAward,
  },

  {
    id: "skills",
    label: "Skills",
    icon: FiTool,
  },

  {
    id: "experience",
    label: "Experience",
    icon: FiBriefcase,
  },

  {
    id: "education",
    label: "Education",
    icon: FiBookOpen,
  },

  {
    id: "resume",
    label: "Resume",
    icon: FiFileText,
  },

  {
    id: "messages",
    label: "Messages",
    icon: FiMail,
  },

  {
    id: "personal",
    label: "Personal Info",
    icon: FiUser,
  },

  {
    id: "ai-twin",
    label: "AI Twin",
    icon: FiCpu,
  },
];

function Dashboard() {
  const navigate =
    useNavigate();

  const [
    checking,
    setChecking,
  ] =
    useState(true);

  const [
    user,
    setUser,
  ] =
    useState(null);

  const [
    activeSection,
    setActiveSection,
  ] =
    useState("projects");

  /* =======================================================
     AUTHENTICATION
  ======================================================= */

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (
          currentUser
        ) => {
          const isAuthorized =
            currentUser?.email
              ?.toLowerCase() ===
            ADMIN_EMAIL.toLowerCase();

          if (
            !currentUser ||
            !isAuthorized
          ) {
            navigate(
              "/admin",
              {
                replace:
                  true,
              }
            );

            setChecking(
              false
            );

            return;
          }

          setUser(
            currentUser
          );

          setChecking(
            false
          );
        }
      );

    return () =>
      unsubscribe();
  }, [navigate]);

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout =
    async () => {
      try {
        await signOut(
          auth
        );

        navigate(
          "/admin",
          {
            replace:
              true,
          }
        );
      } catch (
        error
      ) {
        console.error(
          "Logout failed:",
          error
        );
      }
    };

  /* =======================================================
     AUTH CHECK
  ======================================================= */

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />

          <p className="text-sm text-slate-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER ACTIVE SECTION
  ======================================================= */

  const renderSection =
    () => {
      switch (
        activeSection
      ) {
        case "projects":
          return (
            <ProjectManager />
          );

        case "certificates":
          return (
            <CertificateManager />
          );

        case "skills":
          return (
            <SkillManager />
          );

        case "experience":
          return (
            <ExperienceManager />
          );

        case "education":
          return (
            <EducationManager />
          );

        case "resume":
          return (
            <ResumeManager />
          );

        case "messages":
          return (
            <ContactManager />
          );

        case "personal":
          return (
            <PersonalInfoManager />
          );

        case "ai-twin":
          return (
            <AITwinSettings />
          );

        default:
          return (
            <ProjectManager />
          );
      }
    };

  const activeLabel =
    NAVIGATION_ITEMS.find(
      (item) =>
        item.id ===
        activeSection
    )?.label ||
    "Dashboard";

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          {/* TITLE */}

          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-widest text-indigo-400 sm:text-xs">
              SALEHA'S PORTFOLIO
            </p>

            <h1 className="mt-1 text-lg font-bold sm:text-2xl">
              Admin Dashboard
            </h1>

            <p className="mt-1 w-44 truncate text-xs text-slate-400 sm:w-auto sm:text-sm">
              {user?.email}
            </p>
          </div>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={
              handleLogout
            }
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-white/10
              px-3
              py-2
              text-sm
              font-medium
              text-slate-300
              transition
              hover:bg-white/5
              hover:text-white
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500/50
              sm:px-4
            "
          >
            <FiLogOut
              size={16}
              aria-hidden="true"
            />

            <span className="hidden sm:inline">
              Logout
            </span>
          </button>
        </div>
      </header>

      {/* ===================================================
          NAVIGATION
      =================================================== */}

      <nav
        className="border-b border-white/10 bg-slate-950/95 backdrop-blur"
        aria-label="Admin dashboard navigation"
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-4 pt-3">
            {NAVIGATION_ITEMS.map(
              (item) => {
                const active =
                  activeSection ===
                  item.id;

                const Icon =
                  item.icon;

                return (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        item.id
                      )
                    }
                    aria-current={
                      active
                        ? "page"
                        : undefined
                    }
                    className={`
                      flex
                      shrink-0
                      items-center
                      gap-2
                      rounded-xl
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      transition
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500/50
                      sm:px-4

                      ${
                        active
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      size={16}
                      aria-hidden="true"
                    />

                    <span>
                      {
                        item.label
                      }
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </nav>

      {/* ===================================================
          CURRENT SECTION
      =================================================== */}

      <div className="border-b border-white/5 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-xs text-slate-500">
            Managing{" "}

            <span className="font-medium text-slate-300">
              {activeLabel}
            </span>
          </p>
        </div>
      </div>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {renderSection()}
      </main>
    </div>
  );
}

export default Dashboard;