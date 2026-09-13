import {
  useEffect,
  useState,
} from "react";

import {
  addSkill,
  updateSkill,
} from "../services/skillService";

/* =========================================================
   DEFAULT DATA
========================================================= */

const emptySkill = {
  name: "",
  category: "Frontend",
  featured: false,
};

/*
 * Keep the list focused on technologies that are relevant
 * to the portfolio instead of exposing proficiency levels.
 */

const skillOptions = {
  Frontend: [
    "React.js",
    "JavaScript",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "Bootstrap",
    "Responsive Design",
    "Vite",
  ],

  Backend: [
    "Node.js",
    "Express.js",
    "REST APIs",
    "Flask",
    "API Development",
  ],

  "Mobile Development": [
    "Flutter",
    "Dart",
  ],

  "Databases & Cloud": [
    "MongoDB",
    "MongoDB Atlas",
    "Firebase",
    "Cloud Firestore",
    "MySQL",
    "SQLite",
  ],

  "AI & Data": [
    "Python",
    "Machine Learning",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "OpenCV",
  ],

  "Programming Languages": [
    "Java",
    "JavaScript",
    "Python",
    "SQL",
    "Dart",
  ],

  "Tools & Workflow": [
    "Git",
    "GitHub",
    "VS Code",
    "npm",
    "Postman",
    "Thunder Client",
    "Cypress",
    "Cloudinary",
    "EmailJS",
  ],
};

const categories = Object.keys(skillOptions);

/* =========================================================
   SKILL FORM
========================================================= */

function SkillForm({
  skill,
  onSaved,
  onCancel,
}) {
  const [form, setForm] =
    useState(emptySkill);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (skill) {
      setForm({
        name:
          skill.name || "",
        category:
          skill.category ||
          "Frontend",
        featured:
          skill.featured === true,
      });
    } else {
      setForm(emptySkill);
    }
  }, [skill]);

  /* =======================================================
     CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    if (name === "category") {
      setForm((previous) => ({
        ...previous,
        category: value,
        name: "",
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!form.category) {
      alert(
        "Please select a stack."
      );

      return;
    }

    if (!form.name) {
      alert(
        "Please select a technology."
      );

      return;
    }

    setLoading(true);

    try {
      /*
       * Only professional portfolio information is saved.
       *
       * No proficiency level.
       * No years of experience.
       */

      const skillData = {
        name: form.name,
        category:
          form.category,
        featured:
          form.featured,
      };

      if (skill?.id) {
        await updateSkill(
          skill.id,
          skillData
        );
      } else {
        await addSkill(
          skillData
        );
      }

      setForm(emptySkill);

      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error(
        "Failed to save skill:",
        error
      );

      alert(
        "Failed to save technology."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      {/* HEADER */}

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {skill
              ? "Edit Technology"
              : "Add Technology"}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Add technologies under
            their relevant development
            stack.
          </p>
        </div>

        {skill &&
          onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Cancel
            </button>
          )}
      </div>

      {/* FIELDS */}

      <div className="grid gap-5 md:grid-cols-2">
        {/* STACK */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Stack / Category *
          </label>

          <select
            name="category"
            value={form.category}
            onChange={
              handleChange
            }
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
          >
            {categories.map(
              (category) => (
                <option
                  key={category}
                  value={
                    category
                  }
                >
                  {category}
                </option>
              )
            )}
          </select>
        </div>

        {/* TECHNOLOGY */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Technology *
          </label>

          <select
            name="name"
            value={form.name}
            onChange={
              handleChange
            }
            required
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
          >
            <option value="">
              Select a technology
            </option>

            {(
              skillOptions[
                form.category
              ] || []
            ).map(
              (
                technology
              ) => (
                <option
                  key={
                    technology
                  }
                  value={
                    technology
                  }
                >
                  {
                    technology
                  }
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* FEATURED */}

      <label className="mt-6 flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          name="featured"
          checked={
            form.featured
          }
          onChange={
            handleChange
          }
          className="h-4 w-4 rounded"
        />

        <span className="text-sm text-slate-300">
          Prioritize this
          technology in its
          stack
        </span>
      </label>

      {/* ACTIONS */}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : skill
            ? "Update Technology"
            : "Add Technology"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-6 py-3 font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default SkillForm;