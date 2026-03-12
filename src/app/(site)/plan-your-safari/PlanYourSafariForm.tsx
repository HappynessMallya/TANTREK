"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { publicApi } from "@/lib/public-api";

const STEPS = [
  {
    id: "interests",
    title: "Trip type & interests",
    fields: [
      {
        name: "experience",
        label: "Primary experience",
        type: "select",
        options: [
          "Luxury fly-in",
          "Honeymoon",
          "Photographic",
          "Conservation",
          "Corporate",
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
        label: "Number of nights (safari)",
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
      {
        name: "notes",
        label: "Your vision",
        type: "textarea",
      },
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
  "w-full h-12 px-4 rounded-md bg-safari-green-dark/50 border border-safari-gold/30 text-safari-cream placeholder:text-safari-sand-muted focus:border-safari-gold focus:ring-1 focus:ring-safari-gold outline-none transition-all";
const inputClassLegacy =
  "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-safari-cream focus:border-safari-gold focus:ring-1 focus:ring-safari-gold outline-none";
const textareaClass =
  "w-full min-h-[120px] px-4 py-3 rounded-md bg-safari-green-dark/50 border border-safari-gold/30 text-safari-cream placeholder:text-safari-sand-muted focus:border-safari-gold focus:ring-1 focus:ring-safari-gold outline-none transition-all resize-none";
const textareaClassLegacy =
  "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-safari-cream focus:border-safari-gold focus:ring-1 focus:ring-safari-gold outline-none resize-none";
const labelClassPremium =
  "block text-xs font-bold uppercase tracking-widest text-safari-sand-light/95 mb-2";
const labelClassLegacy = "block text-sm font-medium text-safari-sand-light mb-2";

const radioCardBase =
  "flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm transition-colors";
const radioCardDefault =
  "border-safari-gold/20 bg-safari-green-dark/30 text-safari-sand-light hover:border-safari-gold/50";
const radioCardChecked =
  "border-safari-gold/60 bg-safari-gold/10 text-safari-gold-light";

function getInitialFormState(initialEmail?: string, initialSeason?: string): FormState {
  const state = { ...defaultState } as FormState;
  if (typeof initialEmail === "string" && initialEmail.trim()) state.email = initialEmail.trim();
  if (typeof initialSeason === "string" && initialSeason === "flexible") state.travel_month = "Flexible";
  return state;
}

export function PlanYourSafariForm({
  inline = false,
  initialEmail,
  initialSeason,
}: {
  inline?: boolean;
  initialEmail?: string;
  initialSeason?: string;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(() => getInitialFormState(initialEmail, initialSeason));
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;
  const labelClass = inline ? labelClassPremium : labelClassLegacy;
  const usePremiumInputs = inline;

  const update = (name: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (isLast) {
      setSubmitting(true);
      setSubmitError("");
      // Build message from all collected fields
      const circuits = (form.circuits as string[]).join(", ");
      const message = [
        form.notes as string,
        form.experience ? `Experience: ${form.experience as string}` : "",
        circuits ? `Regions: ${circuits}` : "",
        form.nights ? `Nights: ${form.nights as string}` : "",
      ].filter(Boolean).join("\n");

      const result = await publicApi.submitInquiry({
        name: (form.name as string) || "Anonymous",
        email: (form.email as string) || "",
        phone: (form.phone as string) || undefined,
        message: message || "No message provided.",
        travelDates: (form.travel_month as string) || undefined,
        budget: (form.budget as string) || undefined,
      });
      setSubmitting(false);
      if (result.success) {
        setSubmitted(true);
      } else {
        setSubmitError(result.message ?? "Submission failed. Please try again.");
      }
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (!isFirst) setStep((s) => s - 1);
  };

  if (submitted) {
    const content = (
      <div className="text-center py-8">
        <h2 className="font-display text-2xl text-safari-gold-light">
          Thank you
        </h2>
        <p className="mt-4 text-safari-sand-light/90">
          We’ve received your details and will be in touch within 24–48 hours
          with a tailored outline. For immediate discussion, message us on{" "}
          <a
            href="https://wa.me/255762111315"
            target="_blank"
            rel="noopener noreferrer"
            className="text-safari-gold hover:underline"
          >
            WhatsApp
          </a>
          .
        </p>
      </div>
    );
    if (inline) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {content}
        </motion.div>
      );
    }
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <GlassCard className="p-8">{content}</GlassCard>
      </motion.div>
    );
  }

  const formContent = (
    <>
      <div className="flex justify-between items-center mb-6">
        <span className="text-safari-sand-muted text-sm">
          Step {step + 1} of {STEPS.length}
        </span>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 w-8 rounded-full transition-colors ${
                i <= step ? "bg-safari-gold" : "bg-white/20"
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
          <h2
            className={
              inline
                ? "font-display text-lg font-semibold text-safari-gold-light sm:text-xl"
                : "font-display text-xl text-safari-gold-light mb-6"
            }
          >
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
                  <label
                    htmlFor={field.name}
                    className={labelClass}
                  >
                    {field.label}
                  </label>
                  {isExperienceRadio && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {field.options!.map((opt) => {
                        const selected =
                          ((form[field.name] as string) || "") === opt;
                        return (
                          <label
                            key={opt}
                            className={`${radioCardBase} ${
                              selected ? radioCardChecked : radioCardDefault
                            }`}
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
                      className={
                        usePremiumInputs ? inputClass : inputClassLegacy
                      }
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
                            className={`cursor-pointer ${inline ? `flex items-center gap-2 rounded-md border border-safari-gold/20 bg-safari-green-dark/30 px-3 py-2.5 text-sm text-safari-sand-light hover:border-safari-gold/50 ${checked ? "border-safari-gold/50 bg-safari-gold/10" : ""}` : "flex items-center gap-2"}`}
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
                              className={
                                inline
                                  ? "rounded border-safari-gold/40 bg-safari-green-dark/50 text-safari-gold focus:ring-safari-gold"
                                  : "rounded border-white/20 bg-white/5 text-safari-gold focus:ring-safari-gold"
                              }
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
                      placeholder={
                        inline ? "e.g. Jonathan Smith" : undefined
                      }
                      className={
                        usePremiumInputs ? inputClass : inputClassLegacy
                      }
                    />
                  )}
                  {field.type === "email" && (
                    <input
                      type="email"
                      id={field.name}
                      value={(form[field.name] as string) || ""}
                      onChange={(e) => update(field.name, e.target.value)}
                      placeholder={
                        inline ? "you@example.com" : undefined
                      }
                      className={
                        usePremiumInputs ? inputClass : inputClassLegacy
                      }
                    />
                  )}
                  {field.type === "tel" && (
                    <input
                      type="tel"
                      id={field.name}
                      value={(form[field.name] as string) || ""}
                      onChange={(e) => update(field.name, e.target.value)}
                      className={
                        usePremiumInputs ? inputClass : inputClassLegacy
                      }
                    />
                  )}
                  {field.type === "textarea" && (
                    <textarea
                      id={field.name}
                      value={(form[field.name] as string) || ""}
                      onChange={(e) => update(field.name, e.target.value)}
                      rows={4}
                      placeholder={
                        inline
                          ? "Describe your dream encounter..."
                          : undefined
                      }
                      className={
                        usePremiumInputs ? textareaClass : textareaClassLegacy
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className={inline ? "mt-8 flex flex-col gap-4" : "mt-10 flex justify-between"}>
        {inline && (
          <div className="flex justify-start">
            <button
              type="button"
              onClick={handleBack}
              className={`inline-flex items-center justify-center px-6 py-3 font-medium rounded-md text-safari-gold hover:bg-white/5 transition-colors ${
                isFirst ? "invisible" : ""
              }`}
            >
              Back
            </button>
          </div>
        )}
        {submitError && (
          <p className="text-red-400 text-sm text-center mb-2">{submitError}</p>
        )}
        {inline ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-safari-gold px-6 py-4 font-bold uppercase tracking-wider text-safari-green-dark transition-all hover:bg-safari-gold-light hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Sending…" : isLast ? "Request your itinerary" : "Next"}
              {!submitting && (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
            </button>
            <p className="text-center text-[10px] uppercase tracking-widest text-safari-sand-muted">
              Our response time for private inquiries is typically within 24–48
              hours.
            </p>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleBack}
              className={`inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg text-safari-gold hover:bg-white/5 ${
                isFirst ? "invisible" : ""
              }`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg bg-safari-gold text-safari-green hover:bg-safari-gold-light transition-colors disabled:opacity-60"
            >
              {submitting ? "Sending…" : isLast ? "Submit" : "Next"}
            </button>
          </>
        )}
      </div>
    </>
  );

  if (inline) {
    return <div className="flex flex-col">{formContent}</div>;
  }

  return <GlassCard className="p-6 sm:p-8">{formContent}</GlassCard>;
}
