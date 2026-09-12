import { useEffect, useState } from "react";

import {
  addExperience,
  updateExperience,
} from "../services/experienceService";

const emptyExperience = {
  role: "",
  company: "",
  location: "",
  employmentType: "Full-time",
  startDate: "",
  endDate: "",
  current: false,
  featured: false,
  description: "",
  achievements: "",
  technologies: "",
};

function ExperienceForm({ experience, onSaved, onCancel }) {
  const [form, setForm] = useState(emptyExperience);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (experience) {
      setForm({
        ...emptyExperience,
        ...experience,

        achievements: Array.isArray(experience.achievements)
          ? experience.achievements.join("\n")
          : experience.achievements || "",

        technologies: Array.isArray(experience.technologies)
          ? experience.technologies.join(", ")
          : experience.technologies || "",
      });
    } else {
      setForm({ ...emptyExperience });
    }
  }, [experience]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const experienceData = {
        role: form.role.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        employmentType: form.employmentType,

        startDate: form.startDate,

        endDate: form.current ? "" : form.endDate,

        current: form.current,

        // NEW
        featured: form.featured,

        description: form.description.trim(),

        achievements: form.achievements
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        technologies: form.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (experience?.id) {
        await updateExperience(
          experience.id,
          experienceData
        );
      } else {
        await addExperience(experienceData);
      }

      onSaved();
      setForm({ ...emptyExperience });
    } catch (error) {
      console.error("Experience save error:", error);
      alert("Failed to save experience.");
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
            {experience
              ? "Edit Experience"
              : "Add New Experience"}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Add your professional experience, internship,
            freelance work or leadership role.
          </p>
        </div>

        {experience && (
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

        {/* ROLE */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Job / Role Title *
          </label>

          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            placeholder="e.g. Full Stack Developer Intern"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* COMPANY */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Company / Organization *
          </label>

          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            required
            placeholder="e.g. ABC Technologies"
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
            placeholder="e.g. Remote / Pakistan"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* EMPLOYMENT TYPE */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Employment Type
          </label>

          <select
            name="employmentType"
            value={form.employmentType}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
            <option value="Contract">Contract</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Self-employed">
              Self-employed
            </option>
          </select>
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

            Currently working here
          </label>
        </div>

        {/* FEATURED */}
        <div className="md:col-span-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 p-4">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="h-5 w-5 rounded"
            />

            <div>
              <p className="font-medium text-white">
                ⭐ Featured Experience
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Featured experiences will appear before other
                experiences in your portfolio.
              </p>
            </div>
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
            placeholder="Briefly describe your role..."
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* ACHIEVEMENTS */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-slate-300">
            Key Responsibilities / Achievements
          </label>

          <textarea
            name="achievements"
            value={form.achievements}
            onChange={handleChange}
            rows="5"
            placeholder={`Developed responsive web applications
Integrated REST APIs
Improved application performance
Collaborated with development team`}
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />

          <p className="mt-1 text-xs text-slate-500">
            Add each achievement on a new line.
          </p>
        </div>

        {/* TECHNOLOGIES */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-slate-300">
            Technologies / Skills
          </label>

          <input
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            placeholder="React, JavaScript, Firebase, Python"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
          />

          <p className="mt-1 text-xs text-slate-500">
            Separate technologies with commas.
          </p>
        </div>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : experience
          ? "Update Experience"
          : "Add Experience"}
      </button>
    </form>
  );
}

export default ExperienceForm;