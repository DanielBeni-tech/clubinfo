import { useMemo } from "react";
import { marked } from "marked";
import { CTASection, PageHeader } from "@/components/site/shared";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";

type MarkdownPageProps = {
  title: string;
  lead: string;
  content: string;
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
};

/**
 * Configurer marked pour produire du HTML propre
 * avec des classes Tailwind sur les éléments.
 */
marked.use({
  breaks: false,
  gfm: true,
});

export function MarkdownPage({ title, lead, content, meta }: MarkdownPageProps) {
  const html = useMemo(() => {
    // marked rend du HTML brut, on applique des classes Tailwind
    // via un renderer custom
    const renderer = new marked.Renderer();

    renderer.heading = ({ text, depth }) => {
      const tag = `h${depth}`;
      const classes =
        depth === 1
          ? "font-display text-3xl sm:text-4xl mt-10 mb-4"
          : depth === 2
            ? "font-display text-2xl mt-10 mb-3 text-primary"
            : depth === 3
              ? "font-display text-xl mt-8 mb-2"
              : "font-display text-lg mt-6 mb-2";
      return `<${tag} class="${classes}">${text}</${tag}>`;
    };

    renderer.paragraph = ({ text }) => {
      return `<p class="text-muted-foreground leading-relaxed mb-4">${text}</p>`;
    };

    renderer.list = (token) => {
      const tag = token.ordered ? "ol" : "ul";
      const listClass = token.ordered
        ? "list-decimal list-inside space-y-2 mb-4 text-muted-foreground"
        : "list-disc list-inside space-y-2 mb-4 text-muted-foreground";
      return `<${tag} class="${listClass}">${token.items.map((item) => `<li class="leading-relaxed">${item.text}</li>`).join("")}</${tag}>`;
    };

    renderer.listitem = ({ text }) => {
      return `<li class="leading-relaxed">${text}</li>`;
    };

    renderer.strong = ({ text }) => {
      return `<strong class="font-semibold text-foreground">${text}</strong>`;
    };

    renderer.blockquote = ({ text }) => {
      return `<blockquote class="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">${text}</blockquote>`;
    };

    renderer.hr = () => {
      return `<hr class="my-10 border-border" />`;
    };

    renderer.link = ({ href, text }) => {
      return `<a href="${href}" class="text-primary underline underline-offset-2 hover:text-accent transition-colors" target="_blank" rel="noreferrer">${text}</a>`;
    };

    renderer.codespan = ({ text }) => {
      return `<code class="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-secondary-foreground">${text}</code>`;
    };

    return marked.parse(content, { renderer }) as string;
  }, [content]);

  return (
    <div>
      <PageHeader title={title} lead={lead} />

      <section className="section-y">
        <article className="mx-auto max-w-4xl px-4 prose-custom">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </section>

      <CTASection />
    </div>
  );
}

export const charteMeta = {
  title: "Charte — Club Informatique SUP'PTIC",
  description:
    "Charte du Club Informatique SUP'PTIC : mission, valeurs, objectifs, organisation et principes de gouvernance.",
  ogTitle: "Charte du Club Informatique SUP'PTIC",
  ogDescription: "Le texte fondateur du Club Informatique SUP'PTIC.",
};

export const reglementMeta = {
  title: "Règlement intérieur — Club Informatique SUP'PTIC",
  description:
    "Règlement intérieur du Club Informatique SUP'PTIC : fonctionnement, droits, devoirs, discipline et procédures.",
  ogTitle: "Règlement intérieur du Club Informatique SUP'PTIC",
  ogDescription: "Les règles pratiques de fonctionnement du Club Informatique SUP'PTIC.",
};
