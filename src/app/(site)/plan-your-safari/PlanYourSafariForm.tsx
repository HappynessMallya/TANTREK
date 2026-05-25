"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WHATSAPP_NUMBER = "34637048615";

function buildWhatsAppMessage(form: Record<string, string | string[]>): string {
  const circuits = Array.isArray(form.circuits) ? (form.circuits as string[]).join(", ") : "";
  const lines = [
    "Hello TANTREK 360 — I'd like to plan a trip.",
    "",
    form.name ? `Name: ${form.name as string}` : "",
    form.email ? `Email: ${form.email as string}` : "",
    form.phone ? `Phone: ${form.phone as string}` : "",
    "",
    form.experience ? `Service: ${form.experience as string}` : "",
    circuits ? `Regions: ${circuits}` : "",
    form.travel_month ? `Travel month: ${form.travel_month as string}` : "",
    form.nights ? `Nights: ${form.nights as string}` : "",
    form.budget ? `Budget: ${form.budget as string}` : "",
    "",
    form.notes ? `Notes:\n${form.notes as string}` : "",
  ].filter((line, i, arr) => {
    // Collapse consecutive blank lines
    if (line === "" && arr[i - 1] === "") return false;
    return true;
  });
  return lines.join("\n").trim();
}

function buildWhatsAppUrl(form: Record<string, string | string[]>): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(form))}`;
}

const STEPS = [
  {
    id: "interests",
    title: "Goals & interests",
    fields: [
      {
        name: "experience",
        label: "Primary service",
        type: "select",
        options: [
          "Investment Safari Tour",
          "Cultural Immersion",
          "Bush & Beach Luxury",
          "Diaspora Opportunity Tour",
          "Corporate Tour",
          "Mixed / Flexible",
        ],
      },
      {
        name: "circuits",
        label: "Regions of interest",
        type: "multiselect",
        options: [
          "Northern (Serengeti, Ngorongoro)",
          "Southern (Ruaha, Julius Nyerere)",
          "Western (Katavi)",
        ],
      },
    ],
  },
  {
    id: "dates",
    title: "When & how long",
    fields: [
      {
        name: "travel_month",
        label: "Preferred travel month(s)",
        type: "select",
        options: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
          "Flexible",
        ],
      },
      {
        name: "nights",
        label: "Number of nights",
        type: "select",
        options: ["3–5", "6–8", "9–12", "13+"],
      },
    ],
  },
  {
    id: "budget",
    title: "Budget",
    fields: [
      {
        name: "budget",
        label: "Budget range per person (USD)",
        type: "select",
        options: [
          "$5,000 – $8,000",
          "$8,000 – $12,000",
          "$12,000 – $18,000",
          "$18,000 – $25,000",
          "$25,000+",
          "Prefer to discuss",
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "Your details",
    fields: [
      { name: "name", label: "Full name", type: "text" },
      { name: "email", label: "Email address", type: "email" },
      { name: "phone", label: "Phone (with country code)", type: "tel" },
      { name: "notes", label: "Your vision", type: "textarea" },
    ],
  },
];

type FormState = Record<string, string | string[]>;

const defaultState: FormState = {};
STEPS.forEach((step) => {
  step.fields.forEach((f) => {
    if (f.type === "multiselect") defaultState[f.name] = [];
    else defaultState[f.name] = "";
  });
});

const inputClass =
  "w-full h-12 px-4 rounded-lg bg-white border border-tantrek-border text-tantrek-text placeholder:text-tantrek-text-soft focus:border-tantrek-orange focus:ring-2 focus:ring-tantrek-orange/20 outline-none transition-all";
const textareaClass =
  "w-full min-h-[120px] px-4 py-3 rounded-lg bg-white border border-tantrek-border text-tantrek-text placeholder:text-tantrek-text-soft focus:border-tantrek-orange focus:ring-2 focus:ring-tantrek-orange/20 outline-none transition-all resize-none";
const labelClass =
  "block text-[11px] font-bold uppercase tracking-[0.22em] text-tantrek-navy mb-2.5";

const radioCardBase =
  "flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors";
const radioCardDefault =
  "border-tantrek-border bg-white text-tantrek-text hover:border-tantrek-orange/45";
const radioCardChecked =
  "border-tantrek-orange bg-tantrek-orange/10 text-tantrek-navy font-medium";

function getInitialFormState(
  initialEmail?: string,
  initialSeason?: string,
  initialNotes?: string
): FormState {
  const state = { ...defaultState } as FormState;
  if (typeof initialEmail === "string" && initialEmail.trim()) state.email = initialEmail.trim();
  if (typeof initialSeason === "string" && initialSeason === "flexible") state.travel_month = "Flexible";
  if (typeof initialNotes === "string" && initialNotes.trim()) state.notes = initialNotes;
  return state;
}

export function PlanYourSafariForm({
  inline = false,
  initialEmail,
  initialSeason,
  initialNotes,
}: {
  inline?: boolean;
  initialEmail?: string;
  initialSeason?: string;
  initialNotes?: string;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(() =>
    getInitialFormState(initialEmail, initialSeason, initialNotes)
  );
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  const update = (name: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (isLast) {
      const url = buildWhatsAppUrl(form);
      setWhatsappUrl(url);
      window.open(url, "_blank", "noopener,noreferrer");
      setSubmitted(true);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (!isFirst) setStep((s) => s - 1);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.683-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl text-tantrek-navy font-semibold">
          WhatsApp opened
        </h2>
        <p className="mt-3 text-tantrek-text-muted leading-relaxed max-w-md mx-auto">
          We&apos;ve prefilled your itinerary request in WhatsApp — just hit send and we&apos;ll
          reply within 24&ndash;48 hours with a tailored 360° outline.
        </p>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,211,102,0.32)] transition-all hover:bg-[#1ebe57] hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.683-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607z" />
            </svg>
            Open WhatsApp again
          </a>
        )}
        <p className="mt-6 text-xs text-tantrek-text-muted">
          Popup blocked? Reach us at{" "}
          <a href="mailto:info@tantrek360safaris.com" className="text-tantrek-orange font-semibold hover:underline break-all">
            info@tantrek360safaris.com
          </a>
          .
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <span className="text-tantrek-text-muted text-xs uppercase tracking-[0.18em] font-semibold">
          Step {step + 1} of {STEPS.length}
        </span>
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 w-8 rounded-full transition-colors ${
                i <= step ? "bg-tantrek-orange" : "bg-tantrek-border"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-tantrek-navy">
            {currentStep.title}
          </h2>
          <div className="space-y-6">
            {currentStep.fields.map((field) => {
              const isExperienceRadio =
                inline &&
                field.name === "experience" &&
                field.type === "select" &&
                "options" in field;

              return (
                <div key={field.name}>
                  <label htmlFor={field.name} className={labelClass}>
                    {field.label}
                  </label>
                  {isExperienceRadio && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {field.options!.map((opt) => {
                        const selected = ((form[field.name] as string) || "") === opt;
                        return (
                          <label
                            key={opt}
                            className={`${radioCardBase} ${selected ? radioCardChecked : radioCardDefault}`}
                          >
                            <input
                              type="radio"
                              name={field.name}
                              checked={selected}
                              onChange={() => update(field.name, opt)}
                              className="sr-only"
                            />
                            <span className="flex-1 text-left">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {!isExperienceRadio && field.type === "select" && "options" in field && (
                    <select
                      id={field.name}
                      value={(form[field.name] as string) || ""}
                      onChange={(e) => update(field.name, e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select...</option>
                      {field.options!.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}
                  {field.type === "multiselect" && "options" in field && (
                    <div className="flex flex-wrap gap-2">
                      {field.options!.map((opt) => {
                        const arr = (form[field.name] as string[]) || [];
                        const checked = arr.includes(opt);
                        return (
                          <label
                            key={opt}
                            className={`cursor-pointer flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                              checked
                                ? "border-tantrek-orange bg-tantrek-orange/10 text-tantrek-navy font-medium"
                                : "border-tantrek-border bg-white text-tantrek-text hover:border-tantrek-orange/45"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                const next = checked
                                  ? arr.filter((x) => x !== opt)
                                  : [...arr, opt];
                                update(field.name, next);
                              }}
                              className="rounded border-tantrek-border text-tantrek-orange focus:ring-tantrek-orange"
                            />
                            <span className="text-sm">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {field.type === "text" && (
                    <input
                      type="text"
                      id={field.name}
                      value={(form[field.name] as string) || ""}
                      onChange={(e) => update(field.name, e.target.value)}
                      placeholder="e.g. Jonathan Smith"
                      className={inputClass}
                    />
                  )}
                  {field.type === "email" && (
                    <input
                      type="email"
                      id={field.name}
                      value={(form[field.name] as string) || ""}
                      onChange={(e) => update(field.name, e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  )}
                  {field.type === "tel" && (
                    <input
                      type="tel"
                      id={field.name}
                      value={(form[field.name] as string) || ""}
                      onChange={(e) => update(field.name, e.target.value)}
                      placeholder="+34 600 000 000"
                      className={inputClass}
                    />
                  )}
                  {field.type === "textarea" && (
                    <textarea
                      id={field.name}
                      value={(form[field.name] as string) || ""}
                      onChange={(e) => update(field.name, e.target.value)}
                      rows={4}
                      placeholder="Tell us a little about what you'd like to see, do, or achieve..."
                      className={textareaClass}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 space-y-4">
        <div className="flex justify-start">
          <button
            type="button"
            onClick={handleBack}
            className={`inline-flex items-center gap-1 px-4 py-2.5 text-sm font-semibold rounded-lg text-tantrek-navy hover:bg-tantrek-surface transition-colors ${
              isFirst ? "invisible" : ""
            }`}
          >
            <span aria-hidden>←</span> Back
          </button>
        </div>
        <button
          type="button"
          onClick={handleNext}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 ${
            isLast
              ? "bg-[#25D366] shadow-[0_10px_24px_rgba(37,211,102,0.32)] hover:bg-[#1ebe57]"
              : "bg-tantrek-orange shadow-[0_10px_24px_rgba(255,122,0,0.32)] hover:bg-tantrek-orange-deep"
          }`}
        >
          {isLast ? (
            <>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.683-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607z" />
              </svg>
              Send via WhatsApp
            </>
          ) : (
            <>
              Continue
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </button>
        <p className="text-center text-[10px] uppercase tracking-[0.22em] text-tantrek-text-muted font-semibold">
          {isLast ? "Opens WhatsApp · Reply within 24–48 hours" : "Response within 24–48 hours"}
        </p>
      </div>
    </div>
  );
}
