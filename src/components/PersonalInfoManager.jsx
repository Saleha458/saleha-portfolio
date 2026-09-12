import { useEffect, useState } from "react";

import {
  getPersonalInfo,
  savePersonalInfo,
} from "../services/personalService";

const emptyForm = {
  fullName: "",
  professionalTitle: "",
  tagline: "",
  email: "",
  phone: "",
  location: "",
  about: "",
  githubUrl: "",
  linkedinUrl: "",
  websiteUrl: "",
  availability: "",
};

function PersonalInfoManager() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadPersonalInfo = async () => {
      try {
        const data = await getPersonalInfo();

        if (data) {
          setForm({
            ...emptyForm,
            ...data,
          });
        }
      } catch (error) {
        console.error(
          "Failed to load personal information:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadPersonalInfo();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      await savePersonalInfo({
        fullName: form.fullName.trim(),
        professionalTitle:
          form.professionalTitle.trim(),
        tagline: form.tagline.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        about: form.about.trim(),
        githubUrl: form.githubUrl.trim(),
        linkedinUrl:
          form.linkedinUrl.trim(),
        websiteUrl:
          form.websiteUrl.trim(),
        availability:
          form.availability.trim(),
      });

      setMessage(
        "Personal information saved successfully."
      );
    } catch (error) {
      console.error(
        "Failed to save personal information:",
        error
      );

      setMessage(
        "Failed to save personal information."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
        <p className="text-slate-400">
          Loading personal information...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Personal Information
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          Manage the personal and professional
          information displayed throughout your
          portfolio.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {/* FULL NAME */}
          <div>
            <label
              htmlFor="personal-fullName"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Full Name *
            </label>

            <input
              id="personal-fullName"
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              placeholder="Saleha Imtiaz"
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* PROFESSIONAL TITLE */}
          <div>
            <label
              htmlFor="personal-professionalTitle"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Professional Title *
            </label>

            <input
              id="personal-professionalTitle"
              type="text"
              name="professionalTitle"
              value={form.professionalTitle}
              onChange={handleChange}
              required
              placeholder="Full Stack MERN Developer"
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* TAGLINE */}
          <div className="md:col-span-2">
            <label
              htmlFor="personal-tagline"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Professional Tagline
            </label>

            <input
              id="personal-tagline"
              type="text"
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              placeholder="Building modern, scalable and user-focused web applications."
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label
              htmlFor="personal-email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email *
            </label>

            <input
              id="personal-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* PHONE */}
          <div>
            <label
              htmlFor="personal-phone"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Phone
            </label>

            <input
              id="personal-phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+92 ..."
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />

            <p className="mt-2 text-xs leading-5 text-slate-600">
              Stored for admin use. This number is
              not displayed on the public portfolio.
            </p>
          </div>

          {/* LOCATION */}
          <div>
            <label
              htmlFor="personal-location"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Location
            </label>

            <input
              id="personal-location"
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Pakistan"
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* AVAILABILITY */}
          <div>
            <label
              htmlFor="personal-availability"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Availability
            </label>

            <input
              id="personal-availability"
              type="text"
              name="availability"
              value={form.availability}
              onChange={handleChange}
              placeholder="Available for freelance & remote opportunities"
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* ABOUT */}
          <div className="md:col-span-2">
            <label
              htmlFor="personal-about"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              About Me
            </label>

            <textarea
              id="personal-about"
              name="about"
              value={form.about}
              onChange={handleChange}
              rows={7}
              placeholder="Write your professional introduction..."
              className="w-full resize-y rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* GITHUB */}
          <div>
            <label
              htmlFor="personal-github"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              GitHub URL
            </label>

            <input
              id="personal-github"
              type="url"
              name="githubUrl"
              value={form.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/..."
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* LINKEDIN */}
          <div>
            <label
              htmlFor="personal-linkedin"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              LinkedIn URL
            </label>

            <input
              id="personal-linkedin"
              type="url"
              name="linkedinUrl"
              value={form.linkedinUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* WEBSITE */}
          <div className="md:col-span-2">
            <label
              htmlFor="personal-website"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Website URL
            </label>

            <input
              id="personal-website"
              type="url"
              name="websiteUrl"
              value={form.websiteUrl}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mt-5 rounded-lg px-4 py-3 text-sm ${
              message.includes("successfully")
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
            role="status"
          >
            {message}
          </div>
        )}

        {/* SAVE */}
        <button
          type="submit"
          disabled={saving}
          className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Personal Information"}
        </button>
      </form>
    </div>
  );
}

export default PersonalInfoManager;