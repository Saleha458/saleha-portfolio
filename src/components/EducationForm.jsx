import { useEffect, useState } from "react";

import {
  addEducation,
  updateEducation,
} from "../services/educationService";

const emptyEducation = {
  degree: "",
  institution: "",
  fieldOfStudy: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  achievements: "",
};

function EducationForm({
  education,
  onSaved,
  onCancel,
}) {
  const [form, setForm] = useState(emptyEducation);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (education) {
      setForm({
        ...emptyEducation,
        ...education,

        achievements: Array.isArray(education.achievements)
          ? education.achievements.join("\n")
          : education.achievements || "",
      });
    } else {
      setForm(emptyEducation);
    }
  }, [education]);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const educationData = {
        degree: form.degree.trim(),
        institution: form.institution.trim(),
        fieldOfStudy: form.fieldOfStudy.trim(),
        location: form.location.trim(),

        startDate: form.startDate,

        endDate: form.current
          ? ""
          : form.endDate,

        current: form.current,

        description: form.description.trim(),

        achievements: form.achievements
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (education?.id) {
        await updateEducation(
          education.id,
          educationData
        );
      } else {
        await addEducation(
          educationData
        );
      }

      onSaved();
      setForm(emptyEducation);
    } catch (error) {
      console.error(error);
      alert("Failed to save education.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {education
              ? "Edit Education"
              : "Add New Education"}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Add your academic background and qualifications.
          </p>
        </div>

        {education && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-slate-400 hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {/* DEGREE */}

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Degree / Qualification *
          </label>

          <input
            name="degree"
            value={form.degree}
            onChange={handleChange}
            required
            placeholder="e.g. BSc Software Engineering"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* INSTITUTION */}

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Institution *
          </label>

          <input
            name="institution"
            value={form.institution}
            onChange={handleChange}
            required
            placeholder="e.g. HITEC University"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* FIELD */}

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Field of Study
          </label>

          <input
            name="fieldOfStudy"
            value={form.fieldOfStudy}
            onChange={handleChange}
            placeholder="e.g. Software Engineering"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* LOCATION */}

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Location
          </label>

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Taxila, Pakistan"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* START DATE */}

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Start Date *
          </label>

          <input
            type="month"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* END DATE */}

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            End Date
          </label>

          <input
            type="month"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            disabled={form.current}
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none disabled:cursor-not-allowed disabled:opacity-40"
          />

          <label className="mt-3 flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              name="current"
              checked={form.current}
              onChange={handleChange}
              className="h-4 w-4"
            />

            Currently studying here
          </label>
        </div>

        {/* DESCRIPTION */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-slate-300">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Briefly describe your education..."
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* ACHIEVEMENTS */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-slate-300">
            Achievements / Highlights
          </label>

          <textarea
            name="achievements"
            value={form.achievements}
            onChange={handleChange}
            rows="5"
            placeholder={`CGPA: 3.30
Dean's List
Relevant coursework
Academic projects`}
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />

          <p className="mt-1 text-xs text-slate-500">
            Add each achievement on a new line.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : education
          ? "Update Education"
          : "Add Education"}
      </button>
    </form>
  );
}

export default EducationForm;