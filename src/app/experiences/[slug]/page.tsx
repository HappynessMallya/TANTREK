import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExperienceBySlug, experiences } from "@/data/experiences";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return experiences.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) return { title: "Experience" };
  return {
    title: exp.name,
    description: exp.metaDescription,
  };
}

export default async function ExperiencePage({ params }: Props) {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) notFound();

  return (
    <>
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24 px-4 sm:px-6">
        <GlassCard className="max-w-4xl mx-auto p-8 sm:p-10 lg:p-12 rounded-xl">
          <h1 className="font-display text-4xl lg:text-5xl text-safari-gold-light">
            {exp.name}
          </h1>
          <p className="mt-6 text-xl text-safari-sand-light/90">{exp.tagline}</p>
          <p className="mt-6 text-safari-sand-light/80 leading-relaxed">
            {exp.body}
          </p>
          <ul className="mt-8 space-y-2">
            {exp.highlights.map((h) => (
              <li key={h} className="text-safari-sand-light/90">
                — {h}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/plan-your-safari" variant="primary">
              {exp.cta}
            </Button>
            <span className="text-safari-sand-muted text-sm self-center">
              Or{" "}
              <a
                href="https://wa.me/255762111315"
                target="_blank"
                rel="noopener noreferrer"
                className="text-safari-gold hover:underline"
              >
                contact us on WhatsApp
              </a>
            </span>
          </div>
          <div className="mt-12 pt-8 border-t border-glass-border">
            <p className="text-safari-sand-muted text-sm font-medium uppercase tracking-wider">
              Explore destinations
            </p>
            <ul className="mt-3 flex flex-wrap gap-4">
              {exp.internalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-safari-gold hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>
      </section>
    </>
  );
}
