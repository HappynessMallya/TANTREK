"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

const STEPS = [
  {
    id: "interests",
    title: "Trip type & interests",
    fields: [
      { name: "experience", label: "Primary experience", type: "select", options: ["Luxury fly-in", "Honeymoon", "Photographic", "Conservation", "Corporate", "Mixed / Flexible"] },
      { name: "circuits", label: "Regions of interest", type: "multiselect", options: ["Northern (Serengeti, Ngorongoro)", "Southern (Ruaha, Julius Nyerere)", "Western (Katavi)"] },
    ],
  },
  {
    id: "dates",
    title: "When & how long",
    fields: [
      { name: "travel_month", label: "Preferred travel month(s)", type: "select", options: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Flexible"] },
      { name: "nights", label: "Number of nights (safari)", type: "select", options: ["3–5", "6–8", "9–12", "13+"] },
    ],
  },
  {
    id: "budget",
    title: "Budget",
    fields: [
      { name: "budget", label: "Budget range per person (USD)", type: "select", options: ["$5,000 – $8,000", "$8,000 – $12,000", "$12,000 – $18,000", "$18,000 – $25,000", "$25,000+", "Prefer to discuss"] },
    ],
  },
  {
    id: "contact",
    title: "Your details",
    fields: [
      { name: "name", label: "Full name", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone (with country code)", type: "tel" },
      { name: "notes", label: "Any special requests or questions", type: "textarea" },
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

export function PlanYourSafariForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(defaultState);
  const [submitted, setSubmitted] = useState(false);

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  const update = (name: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (isLast) {
      // Submit: in production, POST to API or send via email/Webhook
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <GlassCard className="p-8">
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
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <GlassCard className="p-6 sm:p-8">
      <div className="flex justify-between items-center mb-8">
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
        >
          <h2 className="font-display text-xl text-safari-gold-light mb-6">
            {currentStep.title}
          </h2>
          <div className="space-y-6">
            {currentStep.fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-safari-sand-light mb-2"
                >
                  {field.label}
                </label>
                {field.type === "select" && "options" in field && (
                  <select
                    id={field.name}
                    value={(form[field.name] as string) || ""}
                    onChange={(e) => update(field.name, e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-safari-cream focus:border-safari-gold focus:ring-1 focus:ring-safari-gold outline-none"
                  >
                    <option value="">Select...</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
                {field.type === "multiselect" && "options" in field && (
                  <div className="flex flex-wrap gap-2">
                    {field.options.map((opt) => {
                      const arr = (form[field.name] as string[]) || [];
                      const checked = arr.includes(opt);
                      return (
                        <label
                          key={opt}
                          className="flex items-center gap-2 cursor-pointer"
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
                            className="rounded border-white/20 bg-white/5 text-safari-gold focus:ring-safari-gold"
                          />
                          <span className="text-safari-sand-light text-sm">
                            {opt}
                          </span>
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
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-safari-cream focus:border-safari-gold focus:ring-1 focus:ring-safari-gold outline-none"
                  />
                )}
                {field.type === "email" && (
                  <input
                    type="email"
                    id={field.name}
                    value={(form[field.name] as string) || ""}
                    onChange={(e) => update(field.name, e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-safari-cream focus:border-safari-gold focus:ring-1 focus:ring-safari-gold outline-none"
                  />
                )}
                {field.type === "tel" && (
                  <input
                    type="tel"
                    id={field.name}
                    value={(form[field.name] as string) || ""}
                    onChange={(e) => update(field.name, e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-safari-cream focus:border-safari-gold focus:ring-1 focus:ring-safari-gold outline-none"
                  />
                )}
                {field.type === "textarea" && (
                  <textarea
                    id={field.name}
                    value={(form[field.name] as string) || ""}
                    onChange={(e) => update(field.name, e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-safari-cream focus:border-safari-gold focus:ring-1 focus:ring-safari-gold outline-none resize-none"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex justify-between">
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
          className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg bg-safari-gold text-safari-green hover:bg-safari-gold-light transition-colors"
        >
          {isLast ? "Submit" : "Next"}
        </button>
      </div>
    </GlassCard>
  );
}
