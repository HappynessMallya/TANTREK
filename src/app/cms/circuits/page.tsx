"use client";

import { useEffect, useState } from "react";
import { cmsApi, type Circuit } from "@/lib/cms-api";
import { PageHeader } from "../_components/PageHeader";
import { Field } from "../_components/Field";
import { Input } from "../_components/Input";
import { Textarea } from "../_components/Textarea";
import { Alert } from "../_components/Alert";
import { Button } from "../_components/Button";
import { PageLoader } from "../_components/Spinner";
import { SectionSaveCard, MediaLibraryHint } from "../_components/SectionSaveCard";

const DEFAULT_CIRCUITS: Array<{ slug: string; name: string; heroTitle: string; heroIntro: string }> = [
  {
    slug: "northern",
    name: "Northern Circuit",
    heroTitle: "Northern Circuit",
    heroIntro:
      "The classic Tanzania safari route: Serengeti, Ngorongoro, Tarangire, and Lake Manyara. We design Northern Circuit itineraries for travelers who want the best of the north with exclusive camps and expert guiding.",
  },
  {
    slug: "southern",
    name: "Southern Circuit",
    heroTitle: "Southern Circuit",
    heroIntro:
      "Ruaha and Julius Nyerere — vast, less travelled, with predator densities that quietly rival the north.",
  },
  {
    slug: "western",
    name: "Western Circuit",
    heroTitle: "Western Circuit",
    heroIntro:
      "Katavi and Mahale — remote, demanding, unforgettable. Chimpanzees, hippo pods, and a horizon that feels invented.",
  },
];

export default function CmsCircuitsPage() {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [seeding, setSeeding] = useState(false);

  const load = () =>
    cmsApi
      .getCircuits()
      .then((list) => {
        setCircuits(list ?? []);
        setLoading(false);
      })
      .catch((e) => {
        setMsg({ type: "error", text: e instanceof Error ? e.message : "Failed to load circuits." });
        setLoading(false);
      });

  useEffect(() => {
    if (!cmsApi.isConfigured) {
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create the three standard circuits if none exist yet.
  const seedDefaults = async () => {
    setSeeding(true);
    try {
      for (const c of DEFAULT_CIRCUITS) {
        await cmsApi.createCircuit({ name: c.name, slug: c.slug, heroTitle: c.heroTitle, heroIntro: c.heroIntro });
      }
      await load();
      setMsg({ type: "success", text: "Default circuits created." });
    } catch (e) {
      setMsg({ type: "error", text: e instanceof Error ? e.message : "Failed to create circuits." });
    } finally {
      setSeeding(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <PageHeader
        title="Circuits"
        description="The three regional circuit landing pages (Northern, Southern, Western). Edit each circuit's hero title, intro, and image."
      />

      {!cmsApi.isConfigured && (
        <Alert type="warn" message="Set NEXT_PUBLIC_CMS_API_URL to manage circuits." />
      )}
      {msg && <Alert type={msg.type} message={msg.text} onDismiss={() => setMsg(null)} />}

      {circuits.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#D5CAAD] bg-[#FAF8F2] py-14 px-8 text-center">
          <h3 className="font-display text-base font-semibold text-[#0D2218]">No circuits found</h3>
          <p className="mt-1.5 text-sm text-[#8A9990]">
            Create the three standard Tanzania circuits to start editing their landing pages.
          </p>
          <div className="mt-6">
            <Button type="button" onClick={seedDefaults} loading={seeding} disabled={!cmsApi.isConfigured}>
              Create Northern, Southern & Western
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {circuits.map((circuit) => (
            <CircuitCard key={circuit.id ?? circuit.slug} circuit={circuit} />
          ))}
        </div>
      )}
    </div>
  );
}

function CircuitCard({ circuit }: { circuit: Circuit }) {
  const [form, setForm] = useState({
    name: circuit.name ?? "",
    heroTitle: circuit.heroTitle ?? "",
    heroIntro: circuit.heroIntro ?? "",
    heroImageUrl: circuit.heroImageUrl ?? "",
  });

  return (
    <SectionSaveCard
      title={circuit.name || circuit.slug}
      description={`/destinations/${circuit.slug}`}
      disabled={!cmsApi.isConfigured}
      onSave={() => cmsApi.updateCircuit(circuit.slug, form)}
      successMessage="Circuit saved."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Display name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Hero title" hint="Large headline on the circuit page.">
            <Input value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} />
          </Field>
        </div>
        <Field label="Hero intro" hint="Intro paragraph beneath the headline.">
          <Textarea value={form.heroIntro} onChange={(e) => setForm({ ...form, heroIntro: e.target.value })} rows={3} />
        </Field>
        <Field label="Hero image URL" hint={<MediaLibraryHint />}>
          <Input
            type="url"
            value={form.heroImageUrl}
            onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })}
            placeholder="https://minio.tantrek360safaris.com/cms-media/…"
          />
        </Field>
        {form.heroImageUrl && (
          <div className="h-32 w-full overflow-hidden rounded-xl bg-[#0D2218]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.heroImageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </SectionSaveCard>
  );
}
