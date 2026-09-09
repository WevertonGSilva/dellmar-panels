import { useState, type ReactNode } from "react";
import { CircleDollarSign } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const greenChart = {
  value: { label: "Quantidade", color: "var(--chart-1)" },
} satisfies ChartConfig;
const multiChart = {
  first: { label: "Principal", color: "var(--chart-1)" },
  second: { label: "Secundário", color: "var(--chart-3)" },
} satisfies ChartConfig;

const horseYears = [
  { year: "2018", value: 2 },
  { year: "2019", value: 22 },
  { year: "2020", value: 12 },
  { year: "2021", value: 32 },
  { year: "2022", value: 13 },
  { year: "2023", value: 22 },
  { year: "2024", value: 60 },
  { year: "2025", value: 13 },
];
const trailerYears = [
  { year: "2011", value: 1 },
  { year: "2012", value: 7 },
  { year: "2013", value: 6 },
  { year: "2014", value: 3 },
  { year: "2015", value: 4 },
  { year: "2016", value: 7 },
  { year: "2017", value: 27 },
  { year: "2018", value: 38 },
  { year: "2019", value: 31 },
  { year: "2020", value: 9 },
  { year: "2021", value: 37 },
  { year: "2022", value: 15 },
  { year: "2023", value: 36 },
  { year: "2024", value: 73 },
  { year: "2025", value: 19 },
];
const trailerTypes = [
  { name: "Sider Vanderleia", value: 127 },
  { name: "Sider 4 eixos", value: 95 },
  { name: "Graneleiro 4 eixos", value: 27 },
  { name: "Sider Rodotrem", value: 26 },
  { name: "Sider LS", value: 21 },
  { name: "Graneleiro LS", value: 14 },
  { name: "Grade baixa", value: 2 },
  { name: "Graneleiro", value: 1 },
];
const fleetStatus = [
  { name: "Manutenção vazio", value: 60 },
  { name: "Trânsito carregado", value: 59 },
  { name: "Carregado", value: 18 },
  { name: "Vazio", value: 15 },
  { name: "Ag. descarga", value: 14 },
  { name: "Teste", value: 4 },
  { name: "Programado", value: 2 },
  { name: "Sem motorista", value: 2 },
];

const managers = [
  { name: "Antonio", vehicles: 63, revenue: "R$ 2,8 mi", average: "R$ 44.444" },
  { name: "Danilo", vehicles: 59, revenue: "R$ 2,4 mi", average: "R$ 40.678" },
  { name: "Gerson", vehicles: 52, revenue: "R$ 1,8 mi", average: "R$ 34.615" },
];

const availableByState = [
  ["SP", 31],
  ["MG", 18],
  ["PR", 12],
  ["GO", 8],
  ["BA", 7],
  ["SC", 5],
  ["RS", 4],
  ["RJ", 3],
  ["CE", 6],
  ["ES", 4],
  ["MS", 3],
  ["MT", 2],
];
const scheduledByState = [
  ["SP", 15],
  ["MG", 9],
  ["PR", 6],
  ["BA", 4],
  ["GO", 3],
  ["SC", 2],
  ["RS", 1],
  ["RJ", 1],
  ["PE", 2],
  ["CE", 1],
  ["ES", 1],
  ["MS", 1],
];
const loadedByClientGroup = [
  ["Varejo", 28, "SP"],
  ["Indústria", 21, "MG"],
  ["Agronegócio", 17, "GO"],
  ["Distribuição", 11, "PR"],
  ["Construção", 9, "BA"],
  ["Química", 7, "RJ"],
  ["Alimentos", 6, "SC"],
  ["Outros", 4, "RS"],
];

type DashboardFilter = {
  label: string;
  value: string;
  amount?: number;
};

function filterValues<T extends { name?: string; year?: string }>(
  values: T[],
  activeFilter: DashboardFilter | null,
) {
  const hasMatch = values.some(
    (item) => item.name === activeFilter?.value || item.year === activeFilter?.value,
  );
  if (!activeFilter || !hasMatch) {
    return values;
  }
  return values.filter(
    (item) => item.name === activeFilter.value || item.year === activeFilter.value,
  );
}

function filterRows(rows: string[][] | number[][], activeFilter: DashboardFilter | null) {
  if (!activeFilter || !rows.some(([name]) => String(name) === activeFilter.value)) return rows;
  return rows.filter(([name]) => String(name) === activeFilter.value);
}

function managerFactor(activeFilter: DashboardFilter | null) {
  if (activeFilter?.label !== "Gestor") return 1;
  const manager = managers.find((item) => item.name === activeFilter.value);
  return manager ? manager.vehicles / managers.reduce((sum, item) => sum + item.vehicles, 0) : 1;
}

function formatMillions(value: number) {
  return `R$ ${(value / 1_000_000).toFixed(1).replace(".", ",")} mi`;
}

function parseMillions(value: string) {
  return Number(value.replace("R$ ", "").replace(" mi", "").replace(",", ".")) * 1_000_000;
}

function getRevenueView(activeFilter: DashboardFilter | null) {
  const selectedManager =
    activeFilter?.label === "Gestor"
      ? managers.find((manager) => manager.name === activeFilter.value)
      : null;
  const amount = activeFilter?.amount;
  const scale = amount ? amount / 103 : 1;

  return {
    selectedManager,
    count: selectedManager?.vehicles ?? amount ?? 174,
    total: selectedManager?.revenue ?? formatMillions(7_000_000 * scale),
    billed: selectedManager?.vehicles ?? Math.round(134 * scale),
    pending: selectedManager ? 0 : Math.round(40 * scale),
    average: selectedManager?.average ?? `R$ ${Math.round(52_377 * scale).toLocaleString("pt-BR")}`,
  };
}

function filteredCount(value: number, activeFilter: DashboardFilter | null) {
  return activeFilter?.amount
    ? Math.max(0, Math.round(value * (activeFilter.amount / 103)))
    : value;
}

function ManagerCard({
  name,
  vehicles,
  revenue,
  average,
  activeFilter,
  onFilterChange,
}: (typeof managers)[number] & {
  activeFilter: DashboardFilter | null;
  onFilterChange: (filter: DashboardFilter) => void;
}) {
  const isActive = activeFilter?.value === name;

  return (
    <Card
      className={cn(
        "rounded-lg border-border shadow-xs transition-colors",
        isActive && "border-primary ring-2 ring-primary/20",
      )}
    >
      <CardHeader className="border-b border-border/70 p-4 pb-3">
        <button
          type="button"
          className="text-left font-display text-base font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onFilterChange({ label: "Gestor", value: name, amount: vehicles })}
        >
          {name}
        </button>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-3 p-4">
        <div>
          <p className="text-xl font-semibold text-primary">{vehicles}</p>
          <p className="mt-1 text-[10px] font-medium text-muted-foreground">Veículos</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-primary">{revenue}</p>
          <p className="mt-1 text-[10px] font-medium text-muted-foreground">
            Faturamento acumulado
          </p>
        </div>
        <div>
          <p className="text-lg font-semibold text-primary">{average}</p>
          <p className="mt-1 text-[10px] font-medium text-muted-foreground">Média por veículo</p>
        </div>
      </CardContent>
    </Card>
  );
}

function BreakdownCard({
  title,
  total,
  rows,
  activeFilter,
  onFilterChange,
}: {
  title: string;
  total: string;
  rows: (string | number)[][];
  activeFilter: DashboardFilter | null;
  onFilterChange: (filter: DashboardFilter) => void;
}) {
  const factor = managerFactor(activeFilter);
  const visibleRows =
    activeFilter?.label === "Gestor"
      ? rows.map(([name, value, destination]) => [
          name,
          Math.round(Number(value) * factor),
          destination,
        ])
      : filterRows(rows, activeFilter);
  const visibleTotal = Math.round(Number(total) * factor);

  return (
    <Card className="rounded-lg border-border shadow-xs">
      <CardHeader className="flex-row items-start justify-between p-4 pb-3">
        <CardTitle className="font-display text-sm text-foreground">{title}</CardTitle>
        <span className="font-display text-xl font-semibold text-primary">{visibleTotal}</span>
      </CardHeader>
      <CardContent className="flex flex-wrap items-start gap-2 p-3 pt-0">
        {visibleRows.map(([name, value, destination]) => (
          <button
            key={name}
            type="button"
            className={cn(
              "w-[160px] shrink-0 rounded-md bg-muted/70 px-2.5 py-2 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeFilter?.value === name && "bg-primary/15 ring-2 ring-primary/30",
            )}
            onClick={() =>
              onFilterChange({ label: title, value: String(name), amount: Number(value) })
            }
          >
            {destination ? (
              <span className="flex items-center justify-between gap-2">
                <span className="min-w-0">
                  <span className="block truncate text-[10px] font-semibold text-foreground">
                    {name}
                  </span>
                  <span className="mt-0.5 block text-[9px] font-medium text-muted-foreground">
                    Destino: {destination}
                  </span>
                </span>
                <span className="shrink-0 border-l border-border/70 pl-2 font-display text-lg font-bold text-primary">
                  {value}
                </span>
              </span>
            ) : (
              <>
                <span className="block truncate text-[9px] font-medium text-muted-foreground">
                  {name}
                </span>
                <span className="mt-0.5 block text-sm font-semibold text-foreground">{value}</span>
              </>
            )}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("min-w-0 rounded-lg border border-border bg-card p-4 shadow-xs", className)}
    >
      <h2 className="mb-3 font-display text-sm font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Metric({
  value,
  label,
  detail,
  onFilterChange,
  activeFilter,
}: {
  value: string;
  label: string;
  detail?: string;
  onFilterChange?: (filter: DashboardFilter) => void;
  activeFilter?: DashboardFilter | null;
}) {
  const isActive = activeFilter?.label === label;
  return (
    <button
      type="button"
      className={cn(
        "min-w-0 rounded-lg border border-border bg-card px-4 py-4 text-left shadow-xs transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive && "border-primary ring-2 ring-primary/20",
      )}
      onClick={() => onFilterChange?.({ label, value })}
    >
      <p className="font-display text-2xl font-semibold leading-none text-primary sm:text-3xl">
        {value}
      </p>
      <p className="mt-2 text-xs font-medium text-muted-foreground">{label}</p>
      {detail ? <p className="mt-1 text-[10px] font-semibold text-accent">{detail}</p> : null}
    </button>
  );
}

function VerticalBars({
  data,
  height = 190,
  onFilterChange,
  activeFilter,
}: {
  data: { name?: string; year?: string; value: number }[];
  height?: number;
  onFilterChange?: (filter: DashboardFilter) => void;
  activeFilter?: DashboardFilter | null;
}) {
  const visibleData = filterValues(data, activeFilter ?? null);

  return (
    <ChartContainer config={greenChart} className="w-full" style={{ height }}>
      <BarChart data={visibleData} margin={{ top: 14, right: 4, left: -26, bottom: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey={visibleData[0]?.year ? "year" : "name"}
          tickLine={false}
          axisLine={false}
          fontSize={9}
          minTickGap={10}
          tickFormatter={(value: string) => (value.length > 11 ? `${value.slice(0, 9)}…` : value)}
        />
        <YAxis tickLine={false} axisLine={false} fontSize={9} />
        <Tooltip content={<ChartTooltipContent hideLabel />} />
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[2, 2, 0, 0]}
          maxBarSize={48}
          isAnimationActive={false}
          onClick={(entry) => {
            const label = entry?.payload?.name ?? entry?.payload?.year;
            if (label) {
              onFilterChange?.({ label: "Gráfico", value: String(label) });
            }
          }}
        />
      </BarChart>
    </ChartContainer>
  );
}

function Donut({
  data,
  onFilterChange,
  activeFilter,
}: {
  data: { name: string; value: number }[];
  onFilterChange?: (filter: DashboardFilter) => void;
  activeFilter?: DashboardFilter | null;
}) {
  const visibleData = filterValues(data, activeFilter ?? null);

  return (
    <ChartContainer config={multiChart} className="mx-auto h-[160px] w-full">
      <PieChart>
        <Pie
          data={visibleData}
          dataKey="value"
          nameKey="name"
          innerRadius={42}
          outerRadius={66}
          strokeWidth={2}
          isAnimationActive={false}
          onClick={(entry) => {
            if (entry?.name) {
              onFilterChange?.({ label: "Gráfico", value: String(entry.name) });
            }
          }}
        >
          {visibleData.map((entry, index) => (
            <Cell key={entry.name} fill={`var(--chart-${(index % 4) + 1})`} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent nameKey="name" />} />
      </PieChart>
    </ChartContainer>
  );
}

function DataTable({
  type,
  activeFilter,
}: {
  type: "fleet-horse" | "fleet-trailer" | "revenue";
  activeFilter?: DashboardFilter | null;
}) {
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
    [
      "SGI9H63",
      "RBF2B37",
      "SIDER VANDERLEIA",
      "ROMILDO GALVÃO SOARES",
      "GERSON.SILVA",
      "R$ 96.318,04",
      "137,60%",
    ],
    [
      "SGF2F37",
      "SGE9D01",
      "SIDER 4 EIXOS",
      "ALIMAR LAUVRS",
      "DANILO.FARIA",
      "R$ 102.288,86",
      "120,34%",
    ],
    [
      "QRJ4G28",
      "MTY0437",
      "SIDER RODOTREM",
      "LEANDRO SERRA SANTOS",
      "GERSON.SILVA",
      "R$ 111.940,39",
      "117,83%",
    ],
    [
      "RBE1C00",
      "TOG3I63",
      "SIDER VANDERLEIA",
      "DEILTON LEAL NOBRE",
      "DANILO.FARIA",
      "R$ 81.241,24",
      "116,06%",
    ],
  ];
  const heads =
    type === "fleet-horse"
      ? ["Cavalo", "Ano fab", "Marca", "Modelo", "Status"]
      : type === "fleet-trailer"
        ? ["Carreta", "Ano fab", "Marca", "Modelo", "Status"]
        : ["Cavalo", "Carreta", "Tipo de carreta", "Motorista", "Gestor", "Faturamento", "% Meta"];
  const rows =
    type === "fleet-horse" ? fleetHorse : type === "fleet-trailer" ? fleetTrailer : revenue;
  const visibleRows =
    activeFilter && rows.some((row) => row.includes(activeFilter.value))
      ? rows.filter((row) => row.includes(activeFilter.value))
      : rows;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse text-left text-[11px]">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            {heads.map((h) => (
              <th key={h} className="px-3 py-2 font-semibold uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr
              key={row.join()}
              className="border-b border-border/60 transition-colors hover:bg-muted/60"
            >
              {row.map((cell) => (
                <td key={cell} className="whitespace-nowrap px-3 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FleetTab({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: DashboardFilter | null;
  onFilterChange: (filter: DashboardFilter) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <Metric
          value={String(filteredCount(176, activeFilter))}
          label="Cavalos"
          onFilterChange={onFilterChange}
        />
        <Metric
          value={String(filteredCount(313, activeFilter))}
          label="Carretas"
          onFilterChange={onFilterChange}
        />
        <Metric
          value={String(filteredCount(133, activeFilter))}
          label="Cavalos em operação"
          onFilterChange={onFilterChange}
        />
        <Metric
          value={String(filteredCount(54, activeFilter))}
          label="Cavalos fora da operação"
          onFilterChange={onFilterChange}
        />
        <Metric
          value={String(filteredCount(177, activeFilter))}
          label="Carretas em operação"
          onFilterChange={onFilterChange}
        />
        <Metric
          value={String(filteredCount(136, activeFilter))}
          label="Carretas paradas"
          onFilterChange={onFilterChange}
        />
        <Metric
          value={String(filteredCount(89, activeFilter))}
          label="Carretas agregadas"
          onFilterChange={onFilterChange}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <Panel title="Ano de carretas" className="xl:col-span-7">
          <VerticalBars
            data={trailerYears}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
          />
        </Panel>
        <Panel title="Tipo de cavalo" className="xl:col-span-5">
          <Donut
            data={[
              { name: "DAF", value: 136 },
              { name: "IVECO", value: 40 },
            ]}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
          />
        </Panel>
        <Panel title="Ano dos cavalos" className="xl:col-span-4">
          <VerticalBars
            data={horseYears}
            height={175}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
          />
        </Panel>
        <Panel title="Tipo de carreta" className="xl:col-span-4">
          <Donut
            data={[
              { name: "Facchini", value: 261 },
              { name: "Randon", value: 24 },
              { name: "Librelato", value: 19 },
              { name: "Guerra", value: 9 },
            ]}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
          />
        </Panel>
        <Panel title="Metragem das carretas" className="xl:col-span-4">
          <VerticalBars
            data={[
              { name: "15,4m", value: 98 },
              { name: "15,3m", value: 8 },
              { name: "15,1m", value: 105 },
              { name: "14,6m", value: 13 },
            ]}
            height={175}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
          />
        </Panel>
        <Panel title="Relação de ativos" className="xl:col-span-7">
          <DataTable type="fleet" activeFilter={activeFilter} />
        </Panel>
        <Panel title="Carretas por modelo" className="xl:col-span-5">
          <VerticalBars
            data={trailerTypes}
            height={210}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
          />
        </Panel>
      </div>
    </div>
  );
}

function RevenueTab({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: DashboardFilter | null;
  onFilterChange: (filter: DashboardFilter) => void;
}) {
  const revenueView = getRevenueView(activeFilter);
  const visibleManagers = managers
    .filter(
      (manager) =>
        !activeFilter || activeFilter.label !== "Gestor" || activeFilter.value === manager.name,
    )
    .map((manager) => {
      if (!activeFilter?.amount || activeFilter.label === "Gestor") return manager;
      const scale = activeFilter.amount / 103;
      return {
        ...manager,
        vehicles: Math.round(manager.vehicles * scale),
        revenue: formatMillions(parseMillions(manager.revenue) * scale),
        average: `R$ ${Math.round(Number(manager.average.replace(/[^0-9]/g, "")) * scale).toLocaleString("pt-BR")}`,
      };
    });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Metric
          value={String(revenueView.count)}
          label="Contagem de cavalos"
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
        <Metric
          value={revenueView.total}
          label="Faturamento total"
          detail="No período atual"
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
        <Metric
          value={String(revenueView.billed)}
          label="Cavalos faturados"
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
        <Metric
          value={String(revenueView.pending)}
          label="Cavalos sem faturar"
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
        <Metric
          value={revenueView.average}
          label="Média de faturamento"
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {visibleManagers.map((manager) => (
          <ManagerCard
            key={manager.name}
            {...manager}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
          />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <BreakdownCard
          title="Veículos disponíveis"
          total="103"
          rows={availableByState}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
        <BreakdownCard
          title="Veículos programados"
          total="46"
          rows={scheduledByState}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
        <BreakdownCard
          title="Veículos carregados"
          total="77"
          rows={loadedByClientGroup}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
        <BreakdownCard
          title="Em manutenção"
          total="60"
          rows={[
            ["Vazio", 15],
            ["Carregado", 18],
          ]}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <Panel title="Faturamento por carreta" className="xl:col-span-5">
          <VerticalBars
            data={[
              { name: "Sider 4 eixos", value: 4.5 },
              { name: "Vanderleia", value: 1.6 },
              { name: "Rodotrem", value: 0.7 },
              { name: "Outros", value: 0.2 },
            ]}
            onFilterChange={onFilterChange}
          />
        </Panel>
        <Panel title="Status da frota" className="xl:col-span-7">
          <VerticalBars
            data={fleetStatus}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
          />
        </Panel>
        <Panel title="Detalhamento de faturamento" className="xl:col-span-12">
          <DataTable type="revenue" activeFilter={activeFilter} />
        </Panel>
      </div>
    </div>
  );
}

export function DellmarDashboard() {
  const [tab, setTab] = useState("fleet");
  const [activeFilter, setActiveFilter] = useState<DashboardFilter | null>(null);
  const handleFilterChange = (filter: DashboardFilter) => {
    setActiveFilter((current) =>
      current?.label === filter.label && current.value === filter.value ? null : filter,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Tabs value={tab} onValueChange={setTab}>
        <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-border bg-card/95 px-4 backdrop-blur md:px-7">
          <div>
            <h1 className="font-display text-lg font-semibold sm:text-xl">Dashboard operacional</h1>
            <p className="hidden text-[10px] font-semibold uppercase text-muted-foreground sm:block">
              Monitoramento em tempo real
            </p>
          </div>
          <TabsList className="h-10 shrink-0 bg-muted p-1">
            <TabsTrigger value="fleet" className="px-3 text-xs sm:px-5 sm:text-sm">
              Status Frota
            </TabsTrigger>
            <TabsTrigger value="revenue" className="px-3 text-xs sm:px-5 sm:text-sm">
              <CircleDollarSign className="mr-1 hidden size-4 sm:block" />
              Faturamento
            </TabsTrigger>
          </TabsList>
        </header>
        {activeFilter ? (
          <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-2 md:px-7">
            <p className="text-xs text-muted-foreground">
              Filtro ativo: <span className="font-semibold text-foreground">{activeFilter.label}</span>
              <span className="mx-1">=</span>
              <span className="font-semibold text-primary">{activeFilter.value}</span>
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setActiveFilter(null)}
            >
              Limpar filtro
            </Button>
          </div>
        ) : null}
        <main className="mx-auto max-w-[1600px] p-4 md:p-6">
          <TabsContent value="fleet" className="mt-0">
            <FleetTab activeFilter={activeFilter} onFilterChange={handleFilterChange} />
          </TabsContent>
          <TabsContent value="revenue" className="mt-0">
            <RevenueTab activeFilter={activeFilter} onFilterChange={handleFilterChange} />
          </TabsContent>
        </main>
      </Tabs>
    </div>
  );
}
