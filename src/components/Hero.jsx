import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  FiArrowDown,
  FiArrowRight,
  FiGithub,
  FiLinkedin,
  FiMail,
} from "react-icons/fi";

import {
  getCachedPersonalInfo,
  getPersonalInfo,
} from "../services/personalService";

const DEFAULT_INFO = {
  fullName: "Saleha Imtiaz",

  professionalTitle:
    "Full Stack MERN Developer",

  tagline:
    "Building Modern, Scalable & User-Centric Web and Mobile Applications",

  githubUrl: "",
  linkedinUrl: "",
};

function Hero() {
  const [
    personalInfo,
    setPersonalInfo,
  ] = useState(() => {
    const cached =
      getCachedPersonalInfo();

    return {
      ...DEFAULT_INFO,
      ...(cached || {}),
    };
  });

  useEffect(() => {
    let active = true;

    const refreshPersonalInfo =
      async () => {
        try {
          const data =
            await getPersonalInfo({
              forceRefresh: true,
            });

          if (
            active &&
            data
          ) {
            setPersonalInfo({
              ...DEFAULT_INFO,
              ...data,
            });
          }
        } catch (error) {
          console.error(
            "Failed to refresh personal information:",
            error
          );
        }
      };

    refreshPersonalInfo();

    return () => {
      active = false;
    };
  }, []);

  const scrollToSection = (
    id
  ) => {
    const section =
      document.getElementById(
        id
      );

    if (!section) {
      return;
    }

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const name =
    personalInfo.fullName ||
    DEFAULT_INFO.fullName;

  const title =
    personalInfo.professionalTitle ||
    DEFAULT_INFO.professionalTitle;

  const tagline =
    personalInfo.tagline ||
    DEFAULT_INFO.tagline;

  const githubUrl =
    personalInfo.githubUrl || "";

  const linkedinUrl =
    personalInfo.linkedinUrl || "";

  return (
    <section
      id="home"
      className="
        relative
        w-full
        overflow-hidden

        bg-slate-50
        text-slate-950

        dark:bg-slate-900
        dark:text-white
      "
    >
      <div
        className="
          relative
          mx-auto
          flex
          w-full
          max-w-7xl
          flex-col
          items-center

          px-4
          pb-12
          pt-24

          sm:px-6
          sm:pb-16
          sm:pt-28

          md:px-8

          lg:grid
          lg:min-h-screen
          lg:grid-cols-2
          lg:items-center
          lg:gap-20
          lg:pb-24
          lg:pt-28
        "
      >
        {/* Content */}
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
          }}
          className="
            w-full
            max-w-2xl
            text-center

            lg:text-left
          "
        >
          <h1
            className="
              wrap-break-word

              text-4xl
              font-extrabold
              leading-none
              tracking-tight

              text-slate-950

              dark:text-white

              sm:text-5xl
              md:text-6xl
              lg:text-7xl
            "
          >
            {name}
          </h1>

          <h2
            className="
              mt-4
              wrap-break-word

              text-xl
              font-bold
              leading-tight

              text-indigo-600

              dark:text-indigo-400

              sm:text-2xl
              md:text-3xl

              lg:mt-6
              lg:text-4xl
            "
          >
            {title}
          </h2>

          <div
            className="
              mx-auto
              mt-5

              h-px
              w-16

              bg-indigo-500

              lg:mx-0
              lg:w-20
            "
          />

          <p
            className="
              mx-auto
              mt-6
              max-w-xl

              wrap-break-word

              text-sm
              leading-7

              text-slate-600

              dark:text-slate-400

              sm:text-base

              md:text-lg
              md:leading-8

              lg:mx-0
            "
          >
            {tagline}
          </p>

          {/* Buttons */}
          <div
            className="
              mx-auto
              mt-8
              flex
              w-full
              max-w-md
              gap-3

              lg:mx-0
              lg:max-w-none
            "
          >
            <button
              type="button"
              onClick={() =>
                scrollToSection(
                  "projects"
                )
              }
              className="
                group
                flex
                flex-1
                items-center
                justify-center
                gap-2

                rounded-lg
                bg-indigo-600

                px-5
                py-3.5

                text-sm
                font-semibold
                text-white

                shadow-md

                transition
                duration-300

                hover:-translate-y-0.5
                hover:bg-indigo-500

                sm:flex-none
                sm:px-6
                sm:text-base
              "
            >
              View My Work

              <FiArrowRight
                size={17}
                className="
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </button>

            <button
              type="button"
              onClick={() =>
                scrollToSection(
                  "contact"
                )
              }
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-2

                rounded-lg
                border
                border-slate-300

                bg-white

                px-5
                py-3.5

                text-sm
                font-semibold
                text-slate-700

                shadow-sm

                transition
                duration-300

                hover:-translate-y-0.5
                hover:border-indigo-300
                hover:text-indigo-600

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-slate-200

                dark:hover:border-indigo-500/40
                dark:hover:text-white

                sm:flex-none
                sm:px-6
                sm:text-base
              "
            >
              <FiMail size={17} />

              Contact Me
            </button>
          </div>

          {/* Social links */}
          {(githubUrl ||
            linkedinUrl) && (
            <div
              className="
                mx-auto
                mt-6
                flex
                items-center
                justify-center
                gap-5

                lg:mx-0
                lg:justify-start
              "
            >
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit GitHub profile"
                  className="
                    flex
                    items-center
                    gap-2

                    text-sm
                    font-medium
                    text-slate-500

                    transition

                    hover:text-indigo-600

                    dark:text-slate-400
                    dark:hover:text-indigo-400
                  "
                >
                  <FiGithub size={18} />
                  GitHub
                  <span>↗</span>
                </a>
              )}

              {githubUrl &&
                linkedinUrl && (
                  <span
                    className="
                      h-5
                      w-px
                      bg-slate-300

                      dark:bg-slate-700
                    "
                  />
                )}

              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit LinkedIn profile"
                  className="
                    flex
                    items-center
                    gap-2

                    text-sm
                    font-medium
                    text-slate-500

                    transition

                    hover:text-indigo-600

                    dark:text-slate-400
                    dark:hover:text-indigo-400
                  "
                >
                  <FiLinkedin size={18} />
                  LinkedIn
                  <span>↗</span>
                </a>
              )}
            </div>
          )}
        </motion.div>

        {/* Portrait */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            delay: 0.08,
          }}
          className="
            mt-10
            flex
            w-full
            items-center
            justify-center

            lg:mt-0
          "
        >
          <div
            className="
              w-44

              sm:w-52
              md:w-64
              lg:w-72
              xl:w-80
            "
          >
            <div
              className="
                overflow-hidden
                rounded-3xl

                border
                border-slate-200

                bg-white
                p-1.5

                shadow-xl

                dark:border-slate-700
                dark:bg-slate-800
              "
            >
              <div
                className="
                  overflow-hidden
                  rounded-2xl

                  bg-slate-100

                  dark:bg-slate-700
                "
                style={{
                  aspectRatio:
                    "4 / 5",
                }}
              >
                <img
                  src="/images.jpg"
                  alt={`${name} - ${title}`}
                  className="
                    h-full
                    w-full

                    object-cover
                    object-top
                  "
                  loading="eager"
                  fetchPriority="high"
                  onError={(
                    event
                  ) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Explore */}
      <button
        type="button"
        onClick={() =>
          scrollToSection("about")
        }
        aria-label="Scroll to About section"
        className="
          absolute
          bottom-7
          left-1/2
          hidden
          -translate-x-1/2
          flex-col
          items-center
          gap-2

          text-slate-400

          transition

          hover:text-indigo-600

          dark:hover:text-indigo-400

          lg:flex
        "
      >
        <span
          className="
            text-xs
            font-medium
            uppercase
            tracking-widest
          "
        >
          Explore
        </span>

        <FiArrowDown
          size={18}
          className="animate-bounce"
        />
      </button>
    </section>
  );
}

export default Hero;