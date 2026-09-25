import {
  Users,
  Eye,
  Clock,
  Download,
  Building2,
  TrendingUp,
  TrendingDown,
  Globe,
  Monitor,
  Compass,
  Search,
  Share2,
  Link2,
  Mail,
  ExternalLink,
  ArrowRightCircle,
  Radio,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { AdminDashboardData } from "@/lib/admin/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OverviewTabProps {
  data: AdminDashboardData;
}

const DEVICE_COLORS: Record<string, string> = {
  Desktop: "#7CF9C9",
  Mobile: "#38bdf8",
  Tablet: "#f59e0b",
  Bot: "#64748b",
};

const CHANNEL_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  direct: { label: "Direct (URL Typed / Bookmark)", color: "#38bdf8", icon: Compass },
  search: { label: "Organic Search Engines", color: "#7CF9C9", icon: Search },
  social: { label: "Social Media (LinkedIn, GitHub, X)", color: "#c084fc", icon: Share2 },
  referral: { label: "External Web Referrals", color: "#2dd4bf", icon: Link2 },
  email: { label: "Email / Direct Campaigns", color: "#fbbf24", icon: Mail },
  campaign: { label: "Marketing Campaigns", color: "#f43f5e", icon: ExternalLink },
  redirect: { label: "Redirects & QR Codes", color: "#818cf8", icon: ArrowRightCircle },
};

export function OverviewTab({ data }: OverviewTabProps) {
  const {
    stats,
    trafficSeries,
    topPages,
    deviceBreakdown,
    geoBreakdown,
    acquisitionBreakdown = [],
  } = data;

  const conversionRate =
    stats.uniqueVisitors > 0
      ? ((stats.resumeDownloads / stats.uniqueVisitors) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-border bg-surface/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs font-medium text-muted-foreground">
              Total Pageviews
            </CardTitle>
            <Eye className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {stats.totalViews.toLocaleString()}
            </div>
            {stats.viewsTrendPercent !== 0 ? (
              <div
                className={`mt-1 flex items-center text-xs ${stats.viewsTrendPercent > 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {stats.viewsTrendPercent > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {stats.viewsTrendPercent > 0
                  ? `+${stats.viewsTrendPercent}%`
                  : `${stats.viewsTrendPercent}%`}{" "}
                vs prior period
              </div>
            ) : (
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400/50" />
                Baseline period (first 7 days)
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-surface/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs font-medium text-muted-foreground">
              Unique Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {stats.uniqueVisitors.toLocaleString()}
            </div>
            {stats.visitorsTrendPercent !== 0 ? (
              <div
                className={`mt-1 flex items-center text-xs ${stats.visitorsTrendPercent > 0 ? "text-sky-400" : "text-rose-400"}`}
              >
                {stats.visitorsTrendPercent > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {stats.visitorsTrendPercent > 0
                  ? `+${stats.visitorsTrendPercent}%`
                  : `${stats.visitorsTrendPercent}%`}{" "}
                vs prior period
              </div>
            ) : (
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-sky-400/50" />
                100% authentic reach
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-surface/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs font-medium text-muted-foreground">
              Avg Active Dwell
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {Math.floor(stats.avgDwellSeconds / 60)}m {stats.avgDwellSeconds % 60}s
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Active focused tab time</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs font-medium text-muted-foreground">
              Resume Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-accent-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {stats.resumeDownloads}
            </div>
            <div className="mt-1 text-xs text-accent-2">{conversionRate}% conversion rate</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs font-medium text-muted-foreground">
              Recruiter / Target Visits
            </CardTitle>
            <Building2 className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {stats.targetCompanyVisits}
            </div>
            <div className="mt-1 text-xs text-purple-300">
              {stats.targetCompanyVisits > 0
                ? "Target enterprise ASN identified"
                : "Awaiting verified enterprise ASNs"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Chart: Traffic Over Time */}
      <Card className="border-border bg-surface/40 backdrop-blur-md">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-2">
          <div>
            <CardTitle className="font-mono text-sm text-foreground">
              REAL-TIME TRAFFIC & ENGAGEMENT METRICS (LAST 7 DAYS)
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Genuine daily pageviews vs unique visitors with resume download correlation
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="text-muted-foreground">Views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
              <span className="text-muted-foreground">Visitors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-accent-2" />
              <span className="text-muted-foreground">Downloads</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7CF9C9" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7CF9C9" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B2A3B",
                    borderColor: "rgba(255,255,255,0.15)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Pageviews"
                  stroke="#7CF9C9"
                  strokeWidth={2}
                  fill="url(#viewsGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Unique Visitors"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fill="url(#visitorsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Grid: Top Pages & Device Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top Pages & Projects Bar Chart */}
        <Card className="border-border bg-surface/40 backdrop-blur-md lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-mono text-sm text-foreground">
              TOP VISITED PORTFOLIO SECTIONS & ROUTES
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Ranked by real visitor interactions and dwell time
            </p>
          </CardHeader>
          <CardContent>
            {topPages.length === 0 ? (
              <div className="flex h-64 items-center justify-center font-mono text-xs text-muted-foreground">
                No pageviews recorded yet. Live visits will chart here.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topPages}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  >
                    <XAxis type="number" stroke="#64748b" fontSize={11} hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={11}
                      width={180}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0B2A3B",
                        borderColor: "rgba(255,255,255,0.15)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar
                      dataKey="views"
                      name="Views"
                      fill="#7CF9C9"
                      radius={[0, 4, 4, 0]}
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Breakdown Donut */}
        <Card className="border-border bg-surface/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="font-mono text-sm text-foreground flex items-center gap-2">
              <Monitor className="h-4 w-4 text-accent" />
              VERIFIED DEVICE PROFILES
            </CardTitle>
            <p className="text-xs text-muted-foreground">Desktop vs Mobile vs Tablet vs Bot</p>
          </CardHeader>
          <CardContent>
            <div className="relative h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceBreakdown}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    cornerRadius={4}
                    dataKey="value"
                  >
                    {deviceBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={DEVICE_COLORS[entry.name] || "#7CF9C9"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B2A3B",
                      borderColor: "rgba(255,255,255,0.15)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {deviceBreakdown.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center gap-2 rounded border border-border bg-white/[0.02] p-1.5"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: DEVICE_COLORS[d.name] }}
                  />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="ml-auto font-mono text-foreground">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Acquisition & Inbound Pathways Section */}
      <Card className="border-border bg-surface/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-mono text-sm text-foreground flex items-center gap-2">
            <Radio className="h-4 w-4 text-cyan-400" />
            ACQUISITION & VISITOR DISCOVERY PATHWAYS
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Exact entry channels, search discovery, social networks, and referral origins
          </p>
        </CardHeader>
        <CardContent>
          {acquisitionBreakdown.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-muted-foreground">
              No acquisition pathways recorded yet. Inbound visitor channels will appear here.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {acquisitionBreakdown.map((item) => {
                  const conf = CHANNEL_CONFIG[item.channel] || {
                    label: item.label,
                    color: "#94a3b8",
                    icon: Compass,
                  };
                  const Icon = conf.icon;
                  return (
                    <div
                      key={item.channel}
                      className="rounded-xl border border-border bg-white/[0.02] p-3.5 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex h-7 w-7 items-center justify-center rounded-lg"
                            style={{
                              backgroundColor: `${conf.color}15`,
                              color: conf.color,
                            }}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-medium text-xs text-foreground block">
                              {conf.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              Channel: {item.channel}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm font-bold text-foreground">
                            {item.count}
                          </div>
                          <div className="text-[10px] font-mono text-muted-foreground">
                            {item.percent}%
                          </div>
                        </div>
                      </div>

                      <div className="h-1.5 w-full rounded-full bg-muted/20 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(4, item.percent)}%`,
                            backgroundColor: conf.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Global Geolocation Leaderboard */}
      <Card className="border-border bg-surface/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-mono text-sm text-foreground flex items-center gap-2">
            <Globe className="h-4 w-4 text-sky-400" />
            TOP GEOGRAPHIC HUBS & TECH CLUSTERS
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Visitor density categorized by city and country
          </p>
        </CardHeader>
        <CardContent>
          {geoBreakdown.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-muted-foreground">
              No geographical sessions recorded yet. Real visitor regions will appear here.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {geoBreakdown.map((geo) => (
                <div
                  key={`${geo.country}-${geo.city}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-white/[0.02] p-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-xs">{geo.city}</span>
                      <Badge
                        variant="outline"
                        className="border-border text-[10px] text-muted-foreground"
                      >
                        {geo.code}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{geo.country}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-accent">{geo.visits}</div>
                    <div className="text-[10px] text-muted-foreground">{geo.percent}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
