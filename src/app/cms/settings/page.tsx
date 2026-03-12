"use client";

import { useEffect, useState } from "react";
import { cmsApi } from "@/lib/cms-api";
import { PageHeader } from "../_components/PageHeader";
import { Field } from "../_components/Field";
import { Input } from "../_components/Input";
import { Textarea } from "../_components/Textarea";
import { Alert } from "../_components/Alert";
import { PageLoader } from "../_components/Spinner";
import { SectionSaveCard, MediaLibraryHint } from "../_components/SectionSaveCard";

type Settings = {
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  phone: string;
  whatsappNumber: string;
  officeAddress: string;
  footerTagline: string;
  footerDescription: string;
  footerLocation: string;
  copyrightText: string;
  logo: string;
  logoAlt: string;
  ogImage: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
};

const EMPTY: Settings = {
  siteTitle: "", siteDescription: "", contactEmail: "", phone: "", whatsappNumber: "",
  officeAddress: "", footerTagline: "", footerDescription: "", footerLocation: "",
  copyrightText: "", logo: "", logoAlt: "", ogImage: "",
  facebookUrl: "", instagramUrl: "", twitterUrl: "", youtubeUrl: "",
};

export default function CmsSettingsPage() {
  const [form, setForm] = useState<Settings>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cmsApi.isConfigured) { setLoading(false); return; }
    cmsApi.getSettings()
      .then((d) => { setForm({ ...EMPTY, ...(d as Partial<Settings>) }); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = (fields: Partial<Settings>) =>
    cmsApi.updateSettings(fields as Record<string, unknown>);

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-6">
      <PageHeader
        title="Site Settings"
        description="Global settings — each group saves independently."
      />
      {!cmsApi.isConfigured && (
        <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to load and save settings." />
      )}

      <div className="space-y-5">

        {/* ── Branding & Identity ──────────────────────────────────────── */}
        <SectionSaveCard
          title="Branding & Identity"
          description="Site name, logo, default share image, and meta description."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ siteTitle: form.siteTitle, siteDescription: form.siteDescription, logo: form.logo, logoAlt: form.logoAlt, ogImage: form.ogImage })}
          successMessage="Branding settings saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Field label="Site title">
                <Input value={form.siteTitle} onChange={(e) => set("siteTitle", e.target.value)} placeholder="Tanzania Wildmakers Safaris" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Default meta description" hint="Max 160 characters. Used on pages that don't have their own.">
                <Textarea value={form.siteDescription} onChange={(e) => set("siteDescription", e.target.value)} rows={2} maxLength={160} />
              </Field>
            </div>
            <Field label="Logo URL" hint={<MediaLibraryHint />}>
              <Input type="url" value={form.logo} onChange={(e) => set("logo", e.target.value)} placeholder="https://cdn…/logo.png" />
            </Field>
            <Field label="Logo alt text">
              <Input value={form.logoAlt} onChange={(e) => set("logoAlt", e.target.value)} placeholder="Tanzania Wildmakers Safaris" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Social share image (OG image)" hint={<MediaLibraryHint />}>
                <Input type="url" value={form.ogImage} onChange={(e) => set("ogImage", e.target.value)} placeholder="https://cdn…/og.jpg" />
              </Field>
            </div>
          </div>
          {form.logo && (
            <div className="mt-4 flex items-center gap-3 border-t border-[#EAE4D0] pt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.logo} alt="Logo preview" className="h-12 object-contain rounded" />
              <span className="text-xs text-[#8A9990]">Current logo preview</span>
            </div>
          )}
        </SectionSaveCard>

        {/* ── Contact information ──────────────────────────────────────── */}
        <SectionSaveCard
          title="Contact information"
          description="Displayed in the footer, contact page, and WhatsApp floating button."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ contactEmail: form.contactEmail, phone: form.phone, whatsappNumber: form.whatsappNumber, officeAddress: form.officeAddress })}
          successMessage="Contact info saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Email address">
              <Input type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} placeholder="info@tanzaniawildmakersafari.com" />
            </Field>
            <Field label="Phone number">
              <Input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+255 762 111 315" />
            </Field>
            <Field label="WhatsApp number" hint="Digits only, include country code (e.g. 255762111315).">
              <Input value={form.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} placeholder="255762111315" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Office / mailing address">
                <Textarea value={form.officeAddress} onChange={(e) => set("officeAddress", e.target.value)} rows={2} placeholder="Dar es Salaam, Tanzania" />
              </Field>
            </div>
          </div>
        </SectionSaveCard>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <SectionSaveCard
          title="Footer copy"
          description="Text that appears in the website footer at the bottom of every page."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ footerTagline: form.footerTagline, footerDescription: form.footerDescription, footerLocation: form.footerLocation, copyrightText: form.copyrightText })}
          successMessage="Footer copy saved."
        >
          <div className="space-y-4">
            <Field label="Tagline" hint="Short punchy line shown prominently in the footer.">
              <Input value={form.footerTagline} onChange={(e) => set("footerTagline", e.target.value)} placeholder="Crafting wild experiences. Redefining safari frontiers." />
            </Field>
            <Field label="Footer description">
              <Textarea value={form.footerDescription} onChange={(e) => set("footerDescription", e.target.value)} rows={2} placeholder="Specialists in private safaris across Tanzania's most remote wilderness…" />
            </Field>
            <Field label="Location line" hint="Shown below the description, e.g. circuit names.">
              <Input value={form.footerLocation} onChange={(e) => set("footerLocation", e.target.value)} placeholder="Serengeti • Ruaha • Katavi" />
            </Field>
            <Field label="Copyright text">
              <Input value={form.copyrightText} onChange={(e) => set("copyrightText", e.target.value)} placeholder={`© ${new Date().getFullYear()} Tanzania Wildmakers Safaris. All rights reserved.`} />
            </Field>
          </div>
        </SectionSaveCard>

        {/* ── Social media ─────────────────────────────────────────────── */}
        <SectionSaveCard
          title="Social media links"
          description="Used in the footer and contact section. Leave blank to hide an icon."
          disabled={!cmsApi.isConfigured}
          onSave={() => save({ instagramUrl: form.instagramUrl, facebookUrl: form.facebookUrl, twitterUrl: form.twitterUrl, youtubeUrl: form.youtubeUrl })}
          successMessage="Social links saved."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Instagram">
              <Input type="url" value={form.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} placeholder="https://instagram.com/tanzaniawildmakers" />
            </Field>
            <Field label="Facebook">
              <Input type="url" value={form.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} placeholder="https://facebook.com/tanzaniawildmakers" />
            </Field>
            <Field label="Twitter / X">
              <Input type="url" value={form.twitterUrl} onChange={(e) => set("twitterUrl", e.target.value)} placeholder="https://twitter.com/wildmakers" />
            </Field>
            <Field label="YouTube">
              <Input type="url" value={form.youtubeUrl} onChange={(e) => set("youtubeUrl", e.target.value)} placeholder="https://youtube.com/@tanzaniawildmakers" />
            </Field>
          </div>
        </SectionSaveCard>

      </div>
    </div>
  );
}
