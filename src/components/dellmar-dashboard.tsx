import { useState, type ReactNode } from "react";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  Menu,
  Truck,
  Wrench,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const greenChart = { value: { label: "Quantidade", color: "var(--chart-1)" } } satisfies ChartConfig;
const multiChart = {
  first: { label: "Principal", color: "var(--chart-1)" },
  second: { label: "Secundário", color: "var(--chart-3)" },
} satisfies ChartConfig;

const horseYears = [
  { year: "2018", value: 2 }, { year: "2019", value: 22 }, { year: "2020", value: 12 },
  { year: "2021", value: 32 }, { year: "2022", value: 13 }, { year: "2023", value: 22 },
  { year: "2024", value: 60 }, { year: "2025", value: 13 },
];
const trailerYears = [
  { year: "2011", value: 1 }, { year: "2012", value: 7 }, { year: "2013", value: 6 },
  { year: "2014", value: 3 }, { year: "2015", value: 4 }, { year: "2016", value: 7 },
  { year: "2017", value: 27 }, { year: "2018", value: 38 }, { year: "2019", value: 31 },
  { year: "2020", value: 9 }, { year: "2021", value: 37 }, { year: "2022", value: 15 },
  { year: "2023", value: 36 }, { year: "2024", value: 73 }, { year: "2025", value: 19 },
];
const trailerTypes = [
  { name: "Sider Vanderleia", value: 127 }, { name: "Sider 4 eixos", value: 95 },
  { name: "Graneleiro 4 eixos", value: 27 }, { name: "Sider Rodotrem", value: 26 },
  { name: "Sider LS", value: 21 }, { name: "Graneleiro LS", value: 14 },
  { name: "Grade baixa", value: 2 }, { name: "Graneleiro", value: 1 },
];
const fleetStatus = [
  { name: "Manutenção vazio", value: 60 }, { name: "Trânsito carregado", value: 59 },
  { name: "Carregado", value: 18 }, { name: "Vazio", value: 15 },
  { name: "Ag. descarga", value: 14 }, { name: "Teste", value: 4 },
  { name: "Programado", value: 2 }, { name: "Sem motorista", value: 2 },
];

function Panel({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("min-w-0 rounded-lg border border-border bg-card p-4 shadow-xs", className)}>
      <h2 className="mb-3 font-display text-sm font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Metric({ value, label, detail }: { value: string; label: string; detail?: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-card px-4 py-4 shadow-xs">
      <p className="font-display text-2xl font-semibold leading-none text-primary sm:text-3xl">{value}</p>
      <p className="mt-2 text-xs font-medium text-muted-foreground">{label}</p>
      {detail ? <p className="mt-1 text-[10px] font-semibold text-accent">{detail}</p> : null}
    </div>
  );
}

function VerticalBars({ data, height = 190 }: { data: { name?: string; year?: string; value: number }[]; height?: number }) {
  return (
    <ChartContainer config={greenChart} className="w-full" style={{ height }}>
      <BarChart data={data} margin={{ top: 14, right: 4, left: -26, bottom: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey={data[0]?.year ? "year" : "name"}
          tickLine={false}
          axisLine={false}
          fontSize={9}
          minTickGap={10}
          tickFormatter={(value: string) => value.length > 11 ? `${value.slice(0, 9)}…` : value}
        />
        <YAxis tickLine={false} axisLine={false} fontSize={9} />
        <Tooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={[2, 2, 0, 0]} maxBarSize={48} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  );
}

function Donut({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ChartContainer config={multiChart} className="mx-auto h-[160px] w-full">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={42} outerRadius={66} strokeWidth={2} isAnimationActive={false}>
          {data.map((entry, index) => <Cell key={entry.name} fill={`var(--chart-${(index % 4) + 1})`} />)}
        </Pie>
        <Tooltip content={<ChartTooltipContent nameKey="name" />} />
      </PieChart>
    </ChartContainer>
  );
}

function DataTable({ type }: { type: "fleet-horse" | "fleet-trailer" | "revenue" }) {
  const fleetHorse = [
    ["QRC1697", "2018", "DAF", "XF105 FTS 460A", "DESENGATADO"],
    ["QRD7144", "2018", "DAF", "XF105 FTS 460A", "DESENGATADO"],
    ["QRG7D38", "2019", "DAF", "XF105 FTS 460A", "DESENGATADO"],
    ["MRY5I72", "2012", "FACCHINI", "SR/FACCHINI SRF LO", "ATIVO - RODA"],
  ];
  const fleetTrailer = [
    ["RBF2B37", "2019", "FACCHINI", "SIDER VANDERLEIA", "ATIVO"],
    ["SGE9D01", "2020", "RANDON", "SIDER 4 EIXOS", "ATIVO"],
    ["MTY0437", "2018", "LIBRELATO", "SIDER RODOTREM", "ATIVO"],
    ["TOG3I63", "2021", "GUERRA", "SIDER VANDERLEIA", "MANUTENÇÃO"],
  ];
  const revenue = [
    ["SGI9H63", "RBF2B37", "SIDER VANDERLEIA", "ROMILDO GALVÃO SOARES", "GERSON.SILVA", "R$ 96.318,04", "137,60%"],
    ["SGF2F37", "SGE9D01", "SIDER 4 EIXOS", "ALIMAR LAUVRS", "DANILO.FARIA", "R$ 102.288,86", "120,34%"],
    ["QRJ4G28", "MTY0437", "SIDER RODOTREM", "LEANDRO SERRA SANTOS", "GERSON.SILVA", "R$ 111.940,39", "117,83%"],
    ["RBE1C00", "TOG3I63", "SIDER VANDERLEIA", "DEILTON LEAL NOBRE", "DANILO.FARIA", "R$ 81.241,24", "116,06%"],
  ];
  const heads = type === "fleet-horse"
    ? ["Cavalo", "Ano fab", "Marca", "Modelo", "Status"]
    : type === "fleet-trailer"
    ? ["Carreta", "Ano fab", "Marca", "Modelo", "Status"]
    : ["Cavalo", "Carreta", "Tipo de carreta", "Motorista", "Gestor", "Faturamento", "% Meta"];
  const rows = type === "fleet-horse" ? fleetHorse : type === "fleet-trailer" ? fleetTrailer : revenue;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse text-left text-[11px]">
        <thead><tr className="border-b border-border text-muted-foreground">{heads.map((h) => <th key={h} className="px-3 py-2 font-semibold uppercase">{h}</th>)}</tr></thead>
        <tbody>{rows.map((row) => <tr key={row.join()} className="border-b border-border/60 transition-colors hover:bg-muted/60">{row.map((cell) => <td key={cell} className="whitespace-nowrap px-3 py-2">{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function FleetTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <Metric value="176" label="Cavalos" />
        <Metric value="313" label="Carretas" />
        <Metric value="133" label="Cavalos em operação" />
        <Metric value="54" label="Cavalos fora da operação" />
        <Metric value="177" label="Carretas em operação" />
        <Metric value="136" label="Carretas paradas" />
        <Metric value="89" label="Carretas agregadas" />
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <Panel title="Ano de carretas" className="xl:col-span-7"><VerticalBars data={trailerYears} /></Panel>
        <Panel title="Tipo de cavalo" className="xl:col-span-5"><Donut data={[{ name: "DAF", value: 136 }, { name: "IVECO", value: 40 }]} /></Panel>
        <Panel title="Ano dos cavalos" className="xl:col-span-4"><VerticalBars data={horseYears} height={175} /></Panel>
        <Panel title="Tipo de carreta" className="xl:col-span-4"><Donut data={[{ name: "Facchini", value: 261 }, { name: "Randon", value: 24 }, { name: "Librelato", value: 19 }, { name: "Guerra", value: 9 }]} /></Panel>
        <Panel title="Metragem das carretas" className="xl:col-span-4"><VerticalBars data={[{ name: "15,4m", value: 98 }, { name: "15,3m", value: 8 }, { name: "15,1m", value: 105 }, { name: "14,6m", value: 13 }]} height={175} /></Panel>
        <Panel title="Relação de ativos" className="xl:col-span-7"><DataTable type="fleet" /></Panel>
        <Panel title="Carretas por modelo" className="xl:col-span-5"><VerticalBars data={trailerTypes} height={210} /></Panel>
      </div>
    </div>
  );
}

function RevenueTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Metric value="174" label="Contagem de cavalos" />
        <Metric value="R$ 7,0 mi" label="Faturamento total" detail="No período atual" />
        <Metric value="134" label="Cavalos faturados" />
        <Metric value="40" label="Cavalos sem faturar" />
        <Metric value="R$ 52.377" label="Média de faturamento" />
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <Panel title="Faturamento por gestor" className="xl:col-span-5"><VerticalBars data={[{ name: "Antonio", value: 2.8 }, { name: "Danilo", value: 2.4 }, { name: "Gerson", value: 1.8 }]} /></Panel>
        <Panel title="Divisão da frota" className="xl:col-span-4"><Donut data={[{ name: "Antonio", value: 63 }, { name: "Danilo", value: 59 }, { name: "Gerson", value: 52 }]} /></Panel>
        <Panel title="Status das OS" className="xl:col-span-3"><VerticalBars data={[{ name: "Correta", value: 46 }, { name: "Em aberto", value: 22 }, { name: "Sem OS", value: 18 }]} /></Panel>
        <Panel title="Faturamento por carreta" className="xl:col-span-4"><VerticalBars data={[{ name: "Sider 4 eixos", value: 4.5 }, { name: "Vanderleia", value: 1.6 }, { name: "Rodotrem", value: 0.7 }, { name: "Outros", value: 0.2 }]} /></Panel>
        <Panel title="Status da frota" className="xl:col-span-8"><VerticalBars data={fleetStatus} /></Panel>
        <Panel title="Detalhamento de faturamento" className="xl:col-span-12"><DataTable type="revenue" /></Panel>
      </div>
    </div>
  );
}

export function DellmarDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState("fleet");
  const nav = [
    { label: "Painel geral", icon: LayoutDashboard },
    { label: "Frota", icon: Truck },
    { label: "Manutenção", icon: Wrench },
    { label: "Relatórios", icon: BarChart3 },
  ];
  return (
    <div className="min-h-screen bg-background">
      {mobileOpen ? <div className="fixed inset-0 z-40 bg-foreground/30 lg:hidden" onClick={() => setMobileOpen(false)} /> : null}
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200", collapsed ? "w-[72px]" : "w-60", mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="grid size-9 shrink-0 place-items-center rounded-md bg-sidebar-primary font-display text-lg font-bold text-sidebar-primary-foreground">D</div>
            {!collapsed ? <span className="font-display text-xl font-semibold uppercase">Dellmar</span> : null}
          </div>
          <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X /></Button>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Navegação principal">
          {nav.map(({ label, icon: Icon }, index) => <Button key={label} variant="ghost" className={cn("w-full justify-start px-3 text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", index === 0 && "bg-sidebar-accent text-sidebar-accent-foreground", collapsed && "justify-center px-0")} title={collapsed ? label : undefined}><Icon />{!collapsed ? label : null}</Button>)}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <Button variant="ghost" className="hidden w-full justify-center text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:inline-flex" onClick={() => setCollapsed((v) => !v)} aria-label={collapsed ? "Expandir menu" : "Recolher menu"}>{collapsed ? <ChevronRight /> : <><ChevronLeft /><span>Recolher</span></>}</Button>
        </div>
      </aside>

      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[72px]" : "lg:pl-60")}>
        <Tabs value={tab} onValueChange={setTab}>
          <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-border bg-card/95 px-4 backdrop-blur md:px-7">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu /></Button>
              <div><h1 className="font-display text-lg font-semibold sm:text-xl">Dashboard operacional</h1><p className="hidden text-[10px] font-semibold uppercase text-muted-foreground sm:block">Monitoramento em tempo real</p></div>
            </div>
            <TabsList className="h-10 shrink-0 bg-muted p-1">
              <TabsTrigger value="fleet" className="px-3 text-xs sm:px-5 sm:text-sm">Status Frota</TabsTrigger>
              <TabsTrigger value="revenue" className="px-3 text-xs sm:px-5 sm:text-sm"><CircleDollarSign className="mr-1 hidden size-4 sm:block" />Faturamento</TabsTrigger>
            </TabsList>
          </header>
          <main className="mx-auto max-w-[1600px] p-4 md:p-6">
            <TabsContent value="fleet" className="mt-0"><FleetTab /></TabsContent>
            <TabsContent value="revenue" className="mt-0"><RevenueTab /></TabsContent>
          </main>
        </Tabs>
      </div>
    </div>
  );
}