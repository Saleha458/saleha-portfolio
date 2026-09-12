import { useEffect, useState } from "react";

import {
  addCertificate,
  updateCertificate,
} from "../services/certificateService";

const emptyCertificate = {
  title: "",
  issuer: "",
  issueDate: "",
  credentialUrl: "",
  imageUrl: "",
  description: "",
};

function CertificateForm({
  certificate,
  onSaved,
  onCancel,
}) {
  const [form, setForm] = useState(emptyCertificate);
  const [loading, setLoading] = useState(false);

  // ================= EDIT MODE =================

  useEffect(() => {
    if (certificate) {
      setForm({
        ...emptyCertificate,
        ...certificate,
      });
    } else {
      setForm(emptyCertificate);
    }
  }, [certificate]);

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const certificateData = {
        title: form.title.trim(),
        issuer: form.issuer.trim(),
        issueDate: form.issueDate,
        credentialUrl: form.credentialUrl.trim(),
        imageUrl: form.imageUrl.trim(),
        description: form.description.trim(),
      };

      if (certificate?.id) {
        await updateCertificate(
          certificate.id,
          certificateData
        );
      } else {
        await addCertificate(certificateData);
      }

      setForm(emptyCertificate);

      onSaved();
    } catch (error) {
      console.error(
        "Failed to save certificate:",
        error
      );

      alert("Failed to save certificate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      {/* ================= HEADER ================= */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {certificate
              ? "Edit Certificate"
              : "Add New Certificate"}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Add your professional certifications and achievements.
          </p>
        </div>

        {certificate && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-slate-400 hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>

      {/* ================= FORM FIELDS ================= */}

      <div className="grid gap-5 md:grid-cols-2">

        {/* TITLE */}

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Certificate Title *
          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="e.g. IBM Full Stack Software Developer"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />
        </div>

        {/* ISSUER */}

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Issuing Organization *
          </label>

          <input
            name="issuer"
            value={form.issuer}
            onChange={handleChange}
            required
            placeholder="e.g. IBM"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />
        </div>

        {/* ISSUE DATE */}

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Issue Date *
          </label>

          <input
            type="month"
            name="issueDate"
            value={form.issueDate}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />
        </div>

        {/* CREDENTIAL URL */}

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Credential URL
          </label>

          <input
            type="url"
            name="credentialUrl"
            value={form.credentialUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />
        </div>

        {/* IMAGE URL */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-slate-300">
            Certificate Image URL
          </label>

          <input
            type="url"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          <p className="mt-2 text-xs text-slate-500">
            Add a public image URL for your certificate.
          </p>

          {form.imageUrl && (
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-slate-950">
              <img
                src={form.imageUrl}
                alt="Certificate preview"
                className="h-48 w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
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
            placeholder="Briefly describe what this certification represents..."
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />
        </div>

      </div>

      {/* ================= BUTTON ================= */}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : certificate
          ? "Update Certificate"
          : "Add Certificate"}
      </button>
    </form>
  );
}

export default CertificateForm;