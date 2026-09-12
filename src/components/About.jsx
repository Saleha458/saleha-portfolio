import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiMapPin,
  FiBriefcase,
} from "react-icons/fi";

import {
  getCachedPersonalInfo,
  getPersonalInfo,
} from "../services/personalService";

const DEFAULT_INFO = {
  professionalTitle: "Full Stack MERN Developer",
  location: "Gujrat, Pakistan",
  availability:
    "Open to Remote Opportunities, Internships & Freelance Projects",
  email: "salehaimtiaz55@gmail.com",
  about:
    "I’m a Full Stack MERN Developer focused on building modern, scalable and user-centric web applications. I work across frontend and backend development, creating responsive interfaces, REST APIs, database-driven applications and complete end-to-end solutions using technologies such as React.js, Node.js, Express.js and MongoDB.",
};

function About() {
  const [personalInfo, setPersonalInfo] = useState(() => {
    const cached = getCachedPersonalInfo();

    return {
      ...DEFAULT_INFO,
      ...(cached || {}),
    };
  });

  useEffect(() => {
    let active = true;

    const refreshPersonalInfo = async () => {
      try {
        const data = await getPersonalInfo({
          forceRefresh: true,
        });

        if (active && data) {
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

  const title =
    personalInfo.professionalTitle ||
    DEFAULT_INFO.professionalTitle;

  const about =
    personalInfo.about || DEFAULT_INFO.about;

  const location =
    personalInfo.location || DEFAULT_INFO.location;

  const availability =
    personalInfo.availability ||
    DEFAULT_INFO.availability;

  const email =
    personalInfo.email || DEFAULT_INFO.email;

  const paragraphs = about
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section
      id="about"
      className="scroll-mt-24 bg-white px-4 py-20 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            About Me
          </h2>

          <div className="mx-auto mt-5 h-px w-16 bg-indigo-500" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            A closer look at my professional background,
            technical focus and approach to building digital solutions.
          </p>
        </motion.div>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 sm:text-3xl">
              {title}
            </h3>

            <div className="mt-6 space-y-5 text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-[17px]">
              {paragraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph}`}>
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <FiMapPin size={18} />
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Location
                  </p>
                </div>

                <p className="mt-4 font-semibold text-slate-900 dark:text-white">
                  {location}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <FiBriefcase size={18} />
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Availability
                  </p>
                </div>

                <p className="mt-4 font-semibold leading-6 text-slate-900 dark:text-white">
                  {availability}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 sm:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <FiMail size={18} />
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Email
                  </p>
                </div>

                <a
                  href={`mailto:${email}`}
                  className="mt-4 block wrap-break-word font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {email}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;