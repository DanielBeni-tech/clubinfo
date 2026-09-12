import { createFileRoute, Outlet } from "@tanstack/react-router";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [...brandSocialMeta],
    links: [...brandHeadLinks],
  }),
  component: ProjectsLayout,
});

function ProjectsLayout() {
  return <Outlet />;
}
