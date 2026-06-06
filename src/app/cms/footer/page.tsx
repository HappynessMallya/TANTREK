"use client";

import { useEffect, useState } from "react";
import { cmsApi } from "@/lib/cms-api";
import { PageHeader } from "../_components/PageHeader";
import { Field } from "../_components/Field";
import { Input } from "../_components/Input";
import { Textarea } from "../_components/Textarea";
import { Button } from "../_components/Button";
import { Alert } from "../_components/Alert";
import { PageLoader } from "../_components/Spinner";
import { SectionSaveCard } from "../_components/SectionSaveCard";

type Link = { label: string; href: string };
type Group = { heading: string; links: Link[] };

type FooterData = {
  brandTagline: string;
  brandDescription: string;
  brandSubline: string;
  destinationSections: Group[];
  servicesLinks: Link[];
  companyLinks: Link[];
  getInTouch: {
    location: string;
    whatsappLabel: string;
    whatsappUrl: string;
    email: string;
    ctaLabel: string;
    ctaHref: string;
  };
  newsletter: { heading: string; copy: string; placeholder: string; buttonLabel: string };
  legalLinks: Link[];
};

const DEFAULTS: FooterData = {
  brandTagline: "A 360° integrated ecosystem of travel, business, and investment in Tanzania.",
  brandDescription:
    "Connecting investors, diaspora, entrepreneurs, and global professionals to Tanzania's wilderness — and its real opportunities.",
  brandSubline: "Tourism • Safaris • Investment",
  destinationSections: [
    { heading: "Northern Tanzania", links: [
      { label: "Serengeti", href: "/destinations/northern" },
      { label: "Ngorongoro", href: "/destinations/northern" },
      { label: "Tarangire", href: "/destinations/northern" },
      { label: "Lake Manyara", href: "/destinations/northern" },
    ] },
    { heading: "Southern Tanzania", links: [
      { label: "Julius Nyerere", href: "/destinations/southern" },
      { label: "Ruaha", href: "/destinations/southern" },
    ] },
    { heading: "Western Tanzania", links: [{ label: "Katavi", href: "/destinations/western" }] },
  ],
  servicesLinks: [
    { label: "Investment Safari Tours", href: "/experiences/luxury-fly-in" },
    { label: "Cultural Immersion", href: "/experiences/honeymoon" },
    { label: "Bush & Beach Luxury", href: "/experiences/photographic" },
    { label: "Diaspora Opportunity Tours", href: "/experiences/conservation" },
    { label: "Corporate Tours", href: "/experiences/corporate" },
  ],
  companyLinks: [
    { label: "About TANTREK 360", href: "/about" },
    { label: "Why Choose Us", href: "/about" },
    { label: "Our Impact", href: "/sustainability" },
    { label: "Speak to an Expert", href: "/plan-your-safari" },
    { label: "Insights", href: "/safari-journal" },
  ],
  getInTouch: {
    location: "Tanzania • Spain",
    whatsappLabel: "+34 637 04 86 15",
    whatsappUrl: "https://wa.me/34637048615",
    email: "info@tantrek360safaris.com",
    ctaLabel: "Speak to an Expert",
    ctaHref: "/plan-your-safari",
  },
  newsletter: {
    heading: "Stay informed",
    copy: "Tanzania investment insights and curated journeys delivered to your inbox.",
    placeholder: "Your email",
    buttonLabel: "Subscribe",
  },
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export default function CmsFooterPage() {
  const [form, setForm] = useState<FooterData>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cmsApi.isConfigured) {
      setLoading(false);
      return;
    }
    cmsApi
      .getFooter()
      .then((d) => {
        setForm({ ...DEFAULTS, ...(d as Partial<FooterData>) });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // PUT /footer replaces the whole object, so always send the full current state.
  const save = (patch: Partial<FooterData>) => {
    const next = { ...form, ...patch };
    setForm(next);
    return cmsApi.updateFooter(next as Record<string, unknown>);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <PageHeader
        title="Footer"
        description="Footer link columns, brand lines, contact block and newsletter. (Logo, social icons and global contact live in Settings.)"
      />
      {!cmsApi.isConfigured && (
        <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to load and save the footer." />
      )}

      <div className="space-y-5">
        {/* Brand */}
        <SectionSaveCard
          title="Brand lines"
          description="The short paragraphs shown beside the footer logo."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ brandTagline: form.brandTagline, brandDescription: form.brandDescription, brandSubline: form.brandSubline })}
          successMessage="Brand lines saved."
        >
          <div className="space-y-4">
            <Field label="Tagline"><Input value={form.brandTagline} onChange={(e) => setForm({ ...form, brandTagline: e.target.value })} /></Field>
            <Field label="Description"><Textarea rows={2} value={form.brandDescription} onChange={(e) => setForm({ ...form, brandDescription: e.target.value })} /></Field>
            <Field label="Sub-line" hint="Small line beneath, e.g. 'Tourism • Safaris • Investment'."><Input value={form.brandSubline} onChange={(e) => setForm({ ...form, brandSubline: e.target.value })} /></Field>
          </div>
        </SectionSaveCard>

        {/* Destination groups */}
        <SectionSaveCard
          title="Destinations column"
          description="Grouped destination links (heading + links)."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ destinationSections: form.destinationSections })}
          successMessage="Destinations column saved."
        >
          <GroupListEditor
            groups={form.destinationSections}
            onChange={(destinationSections) => setForm({ ...form, destinationSections })}
          />
        </SectionSaveCard>

        {/* Services */}
        <SectionSaveCard
          title="Services column"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ servicesLinks: form.servicesLinks })}
          successMessage="Services column saved."
        >
          <LinkListEditor links={form.servicesLinks} onChange={(servicesLinks) => setForm({ ...form, servicesLinks })} />
        </SectionSaveCard>

        {/* Company */}
        <SectionSaveCard
          title="Company column"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ companyLinks: form.companyLinks })}
          successMessage="Company column saved."
        >
          <LinkListEditor links={form.companyLinks} onChange={(companyLinks) => setForm({ ...form, companyLinks })} />
        </SectionSaveCard>

        {/* Get in touch */}
        <SectionSaveCard
          title="Get in touch"
          description="Contact block + CTA button in the footer."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ getInTouch: form.getInTouch })}
          successMessage="Contact block saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Location"><Input value={form.getInTouch.location} onChange={(e) => setForm({ ...form, getInTouch: { ...form.getInTouch, location: e.target.value } })} /></Field>
            <Field label="Email"><Input value={form.getInTouch.email} onChange={(e) => setForm({ ...form, getInTouch: { ...form.getInTouch, email: e.target.value } })} /></Field>
            <Field label="WhatsApp label" hint="Shown to visitors, e.g. '+34 637 04 86 15'."><Input value={form.getInTouch.whatsappLabel} onChange={(e) => setForm({ ...form, getInTouch: { ...form.getInTouch, whatsappLabel: e.target.value } })} /></Field>
            <Field label="WhatsApp URL"><Input value={form.getInTouch.whatsappUrl} onChange={(e) => setForm({ ...form, getInTouch: { ...form.getInTouch, whatsappUrl: e.target.value } })} /></Field>
            <Field label="CTA label"><Input value={form.getInTouch.ctaLabel} onChange={(e) => setForm({ ...form, getInTouch: { ...form.getInTouch, ctaLabel: e.target.value } })} /></Field>
            <Field label="CTA link"><Input value={form.getInTouch.ctaHref} onChange={(e) => setForm({ ...form, getInTouch: { ...form.getInTouch, ctaHref: e.target.value } })} /></Field>
          </div>
        </SectionSaveCard>

        {/* Newsletter */}
        <SectionSaveCard
          title="Newsletter block"
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ newsletter: form.newsletter })}
          successMessage="Newsletter block saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Heading"><Input value={form.newsletter.heading} onChange={(e) => setForm({ ...form, newsletter: { ...form.newsletter, heading: e.target.value } })} /></Field>
            <Field label="Button label"><Input value={form.newsletter.buttonLabel} onChange={(e) => setForm({ ...form, newsletter: { ...form.newsletter, buttonLabel: e.target.value } })} /></Field>
            <div className="md:col-span-2"><Field label="Copy"><Textarea rows={2} value={form.newsletter.copy} onChange={(e) => setForm({ ...form, newsletter: { ...form.newsletter, copy: e.target.value } })} /></Field></div>
            <Field label="Input placeholder"><Input value={form.newsletter.placeholder} onChange={(e) => setForm({ ...form, newsletter: { ...form.newsletter, placeholder: e.target.value } })} /></Field>
          </div>
        </SectionSaveCard>

        {/* Legal */}
        <SectionSaveCard
          title="Legal links"
          description="Links in the bottom bar (Privacy, Terms, Cookies)."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ legalLinks: form.legalLinks })}
          successMessage="Legal links saved."
        >
          <LinkListEditor links={form.legalLinks} onChange={(legalLinks) => setForm({ ...form, legalLinks })} />
        </SectionSaveCard>
      </div>
    </div>
  );
}

// ─── Reusable: editable list of {label, href} ───────────────────────────────
function LinkListEditor({ links, onChange }: { links: Link[]; onChange: (l: Link[]) => void }) {
  const update = (i: number, patch: Partial<Link>) =>
    onChange(links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const remove = (i: number) => onChange(links.filter((_, idx) => idx !== i));
  const add = () => onChange([...links, { label: "", href: "" }]);

  return (
    <div className="space-y-2.5">
      {links.map((l, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input className="flex-1" placeholder="Label" value={l.label} onChange={(e) => update(i, { label: e.target.value })} />
          <Input className="flex-1" placeholder="/path or https://…" value={l.href} onChange={(e) => update(i, { href: e.target.value })} />
          <button type="button" onClick={() => remove(i)} aria-label="Remove" className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" onClick={add}>+ Add link</Button>
    </div>
  );
}

// ─── Reusable: editable list of groups (heading + links) ─────────────────────
function GroupListEditor({ groups, onChange }: { groups: Group[]; onChange: (g: Group[]) => void }) {
  const updateGroup = (i: number, patch: Partial<Group>) =>
    onChange(groups.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
  const removeGroup = (i: number) => onChange(groups.filter((_, idx) => idx !== i));
  const addGroup = () => onChange([...groups, { heading: "", links: [] }]);

  return (
    <div className="space-y-4">
      {groups.map((g, i) => (
        <div key={i} className="rounded-xl border border-[#EAE4D0] bg-[#FDFCF9] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Input className="flex-1" placeholder="Group heading (e.g. Northern Tanzania)" value={g.heading} onChange={(e) => updateGroup(i, { heading: e.target.value })} />
            <button type="button" onClick={() => removeGroup(i)} aria-label="Remove group" className="shrink-0 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">
              Remove group
            </button>
          </div>
          <LinkListEditor links={g.links} onChange={(links) => updateGroup(i, { links })} />
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" onClick={addGroup}>+ Add group</Button>
    </div>
  );
}
