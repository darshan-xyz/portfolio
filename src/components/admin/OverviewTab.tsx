import { Users, Eye, Clock, Download, Building2, TrendingUp, Globe, Monitor } from "lucide-react";
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

export function OverviewTab({ data }: OverviewTabProps) {
  const { stats, trafficSeries, topPages, deviceBreakdown, geoBreakdown } = data;

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-white/10 bg-[#0B2A3B]/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs font-medium text-white/60">
              Total Pageviews
            </CardTitle>
            <Eye className="h-4 w-4 text-[#7CF9C9]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-white">
              {stats.totalViews.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center text-xs text-emerald-400">
              <TrendingUp className="mr-1 h-3 w-3" />+{stats.viewsTrendPercent}% this week
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0B2A3B]/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs font-medium text-white/60">
              Unique Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-white">
              {stats.uniqueVisitors.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center text-xs text-sky-400">
              <TrendingUp className="mr-1 h-3 w-3" />+{stats.visitorsTrendPercent}% unique reach
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0B2A3B]/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs font-medium text-white/60">
              Avg Active Dwell
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-white">
              {Math.floor(stats.avgDwellSeconds / 60)}m {stats.avgDwellSeconds % 60}s
            </div>
            <div className="mt-1 text-xs text-white/40">Active focused tab time</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0B2A3B]/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs font-medium text-white/60">
              Resume Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-[#B8FF3A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-white">
              {stats.resumeDownloads}
            </div>
            <div className="mt-1 text-xs text-[#B8FF3A]">
              {((stats.resumeDownloads / stats.uniqueVisitors) * 100).toFixed(1)}% conversion rate
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0B2A3B]/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs font-medium text-white/60">
              Recruiter / Target Visits
            </CardTitle>
            <Building2 className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-white">
              {stats.targetCompanyVisits}
            </div>
            <div className="mt-1 text-xs text-purple-300">Google, Microsoft, Amazon, Meta</div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Chart: Traffic Over Time */}
      <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="font-mono text-sm text-white">
              TRAFFIC & ENGAGEMENT METRICS (LAST 7 DAYS)
            </CardTitle>
            <p className="text-xs text-white/50">
              Daily pageviews vs unique visitors with resume download correlation
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#7CF9C9]" />
              <span className="text-white/70">Views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
              <span className="text-white/70">Visitors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#B8FF3A]" />
              <span className="text-white/70">Downloads</span>
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
        <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-mono text-sm text-white">
              TOP VISITED PROJECTS & CASE STUDIES
            </CardTitle>
            <p className="text-xs text-white/50">Ranked by total views and average dwell time</p>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Device Breakdown Donut */}
        <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="font-mono text-sm text-white flex items-center gap-2">
              <Monitor className="h-4 w-4 text-[#7CF9C9]" />
              DEVICE PROFILES
            </CardTitle>
            <p className="text-xs text-white/50">Desktop vs Mobile vs Tablet</p>
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
                  className="flex items-center gap-2 rounded border border-white/5 bg-white/[0.02] p-1.5"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: DEVICE_COLORS[d.name] }}
                  />
                  <span className="text-white/70">{d.name}</span>
                  <span className="ml-auto font-mono text-white">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Geolocation Leaderboard */}
      <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-mono text-sm text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-sky-400" />
            TOP GEOGRAPHIC HUBS & TECH CLUSTERS
          </CardTitle>
          <p className="text-xs text-white/50">Visitor density categorized by city and country</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {geoBreakdown.map((geo) => (
              <div
                key={`${geo.country}-${geo.city}`}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-xs">{geo.city}</span>
                    <Badge variant="outline" className="border-white/20 text-[10px] text-white/60">
                      {geo.code}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-white/40">{geo.country}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-[#7CF9C9]">{geo.visits}</div>
                  <div className="text-[10px] text-white/40">{geo.percent}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
