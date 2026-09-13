import { createFileRoute } from "@tanstack/react-router";
import { MarkdownPage, reglementMeta } from "@/components/site/MarkdownPage";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import reglementContent from "../../docs/08_Reglement.md?raw";

export const Route = createFileRoute("/reglement")({
  head: () => ({
    meta: [
      { title: reglementMeta.title },
      { name: "description", content: reglementMeta.description },
      { property: "og:title", content: reglementMeta.ogTitle },
      { property: "og:description", content: reglementMeta.ogDescription },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: ReglementPage,
});

function ReglementPage() {
  return (
    <MarkdownPage
      title="Règlement intérieur"
      lead="Les règles pratiques de fonctionnement du Club : adhésion, Bureau Exécutif, pôles, réunions, discipline et procédures."
      content={reglementContent}
      meta={reglementMeta}
    />
  );
}
