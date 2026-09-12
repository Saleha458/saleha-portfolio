import { useEffect, useState } from "react";

import {
  getCertificates,
  deleteCertificate,
} from "../services/certificateService";

import CertificateForm from "./CertificateForm";

function CertificateManager() {
  const [certificates, setCertificates] =
    useState([]);

  const [editingCertificate, setEditingCertificate] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const loadCertificates = async () => {
    try {
      const data = await getCertificates();

      const sortedCertificates = [
        ...(data || []),
      ].sort((a, b) => {
        const verifiedA = a.verified ? 1 : 0;
        const verifiedB = b.verified ? 1 : 0;

        if (verifiedA !== verifiedB) {
          return verifiedB - verifiedA;
        }

        return String(
          b.issueDate || ""
        ).localeCompare(
          String(a.issueDate || "")
        );
      });

      setCertificates(sortedCertificates);
    } catch (error) {
      console.error(
        "Failed to load certificates:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this certificate?"
    );

    if (!confirmed) return;

    try {
      await deleteCertificate(id);
      await loadCertificates();
    } catch (error) {
      console.error(
        "Failed to delete certificate:",
        error
      );

      alert("Failed to delete certificate.");
    }
  };

  const handleSaved = async () => {
    setEditingCertificate(null);
    setShowForm(false);

    await loadCertificates();
  };

  const handleEdit = (certificate) => {
    setEditingCertificate(certificate);
    setShowForm(true);
  };

  const formatDate = (date) => {
    if (!date) return "";

    if (
      typeof date !== "string" ||
      !date.includes("-")
    ) {
      return date;
    }

    const [year, month] = date.split("-");

    if (!year || !month) {
      return date;
    }

    const monthName = new Date(
      Number(year),
      Number(month) - 1
    ).toLocaleString("en-US", {
      month: "short",
    });

    return `${monthName} ${year}`;
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Certificates
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage your professional certifications
            and achievements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingCertificate(null);
            setShowForm(
              (previous) => !previous
            );
          }}
          className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          {showForm
            ? "Close"
            : "+ Add Certificate"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="mb-8">
          <CertificateForm
            certificate={editingCertificate}
            onSaved={handleSaved}
            onCancel={() => {
              setEditingCertificate(null);
              setShowForm(false);
            }}
          />
        </div>
      )}

      {/* CONTENT */}
      {loading ? (
        <p className="text-slate-400">
          Loading certificates...
        </p>
      ) : certificates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <p className="text-slate-400">
            No certificates added yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {certificates.map((certificate) => (
            <article
              key={certificate.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
            >
              {/* IMAGE */}
              {certificate.imageUrl && (
                <div className="mb-6 overflow-hidden rounded-xl border border-white/10 bg-slate-950">
                  <img
                    src={certificate.imageUrl}
                    alt={
                      certificate.title ||
                      "Certificate"
                    }
                    className="max-h-72 w-full object-contain"
                    loading="lazy"
                  />
                </div>
              )}

              {/* TOP */}
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-white">
                      {certificate.title ||
                        "Professional Certificate"}
                    </h3>

                    {certificate.verified && (
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {certificate.issuer && (
                    <p className="mt-1 text-indigo-400">
                      {certificate.issuer}
                    </p>
                  )}
                </div>

                {certificate.issueDate && (
                  <span className="w-fit rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-400">
                    {formatDate(
                      certificate.issueDate
                    )}
                  </span>
                )}
              </div>

              {/* CREDENTIAL ID */}
              {certificate.credentialId && (
                <p className="mt-4 text-xs text-slate-500">
                  Credential ID:{" "}
                  <span className="text-slate-400">
                    {certificate.credentialId}
                  </span>
                </p>
              )}

              {/* DESCRIPTION */}
              {certificate.description && (
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {certificate.description}
                </p>
              )}

              {/* CREDENTIAL */}
              {certificate.credentialUrl && (
                <a
                  href={certificate.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center text-sm font-medium text-indigo-400 transition hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  Verify Certificate ↗
                </a>
              )}

              {/* ACTIONS */}
              <div className="mt-6 flex gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    handleEdit(certificate)
                  }
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(certificate.id)
                  }
                  className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default CertificateManager;