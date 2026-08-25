import { createFileRoute } from "@tanstack/react-router";
import { DellmarDashboard } from "@/components/dellmar-dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel de Frota | Dellmar" },
      {
        name: "description",
        content: "Painel operacional Dellmar para acompanhamento de frota e faturamento.",
      },
      { property: "og:title", content: "Painel de Frota | Dellmar" },
      {
        property: "og:description",
        content: "Acompanhe status, disponibilidade e faturamento da frota Dellmar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DellmarDashboard,
});