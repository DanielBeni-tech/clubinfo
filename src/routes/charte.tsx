import { createFileRoute } from "@tanstack/react-router";
import { MarkdownPage, charteMeta } from "@/components/site/MarkdownPage";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import charterContent from "../../docs/07_Charte.md?raw";

export const Route = createFileRoute("/charte")({
  head: () => ({
    meta: [
      { title: charteMeta.title },
      { name: "description", content: charteMeta.description },
      { property: "og:title", content: charteMeta.ogTitle },
      { property: "og:description", content: charteMeta.ogDescription },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: ChartePage,
});

function ChartePage() {
  return (
    <MarkdownPage
      title="Charte du Club Informatique SUP'PTIC"
      lead="Le texte fondateur qui définit l'identité, les valeurs, les objectifs, l'organisation et les principes de gouvernance du Club."
      content={charterContent}
      meta={charteMeta}
    />
  );
}
