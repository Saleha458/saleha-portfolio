import {
  lazy,
  Suspense,
} from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

/*
 * Keep the first visible screen lightweight.
 *
 * Everything below Hero is loaded in separate
 * JavaScript chunks instead of blocking the
 * first portfolio render.
 */

const About = lazy(
  () =>
    import(
      "../components/About"
    )
);

const Skills = lazy(
  () =>
    import(
      "../components/Skills"
    )
);

const Experience = lazy(
  () =>
    import(
      "../components/Experience"
    )
);

const Education = lazy(
  () =>
    import(
      "../components/Education"
    )
);

const Projects = lazy(
  () =>
    import(
      "../components/Projects"
    )
);

const Certificates = lazy(
  () =>
    import(
      "../components/Certificates"
    )
);

const Contact = lazy(
  () =>
    import(
      "../components/Contact"
    )
);

const Footer = lazy(
  () =>
    import(
      "../components/Footer"
    )
);

const DigitalTwin = lazy(
  () =>
    import(
      "../components/DigitalTwin"
    )
);

/* =========================================================
   SECTION FALLBACK
========================================================= */

function SectionFallback() {
  return (
    <div className="bg-slate-50 px-6 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-5 w-32 rounded bg-slate-200 dark:bg-white/5" />

        <div className="mt-4 h-9 w-64 max-w-full rounded bg-slate-200 dark:bg-white/5" />

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-36 rounded-2xl bg-slate-200 dark:bg-white/5" />

          <div className="hidden h-36 rounded-2xl bg-slate-200 dark:bg-white/5 sm:block" />

          <div className="hidden h-36 rounded-2xl bg-slate-200 dark:bg-white/5 lg:block" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* CRITICAL FIRST VIEW */}

      <Navbar />

      <main>
        <Hero />

        {/* BELOW-THE-FOLD CONTENT */}

        <Suspense
          fallback={
            <SectionFallback />
          }
        >
          <About />

          <Skills />

          <Experience />

          <Education />

          <Projects />

          <Certificates />

          <Contact />
        </Suspense>
      </main>

      <Suspense
        fallback={null}
      >
        <Footer />
      </Suspense>

      {/*
       * AI code is not part of the initial Home bundle anymore.
       */}

      <Suspense
        fallback={null}
      >
        <DigitalTwin />
      </Suspense>
    </div>
  );
}

export default Home;