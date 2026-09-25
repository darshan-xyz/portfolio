import { useState } from "react";
import {
  Search,
  Building2,
  Download,
  Clock,
  Cpu,
  MapPin,
  ChevronRight,
  X,
  Mail,
  Compass,
  Share2,
  Link2,
  ArrowRightCircle,
  Smartphone,
  Laptop,
  Tablet,
  Bot,
  RotateCw,
  ExternalLink,
  Shield,
  MousePointer,
  Fingerprint,
} from "lucide-react";
import type { VisitorSessionRecord } from "@/lib/admin/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VisitorsTabProps {
  visitors: VisitorSessionRecord[];
}

function getChannelBadge(channel: VisitorSessionRecord["acquisitionChannel"]) {
  switch (channel) {
    case "direct":
      return {
        label: "Direct Entry",
        icon: <Compass className="h-3 w-3 text-cyan-400" />,
        className: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
      };
    case "search":
      return {
        label: "Organic Search",
        icon: <Search className="h-3 w-3 text-emerald-400" />,
        className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      };
    case "social":
      return {
        label: "Social Media",
        icon: <Share2 className="h-3 w-3 text-purple-400" />,
        className: "border-purple-500/30 bg-purple-500/10 text-purple-300",
      };
    case "referral":
      return {
        label: "Web Referral",
        icon: <Link2 className="h-3 w-3 text-sky-400" />,
        className: "border-sky-500/30 bg-sky-500/10 text-sky-300",
      };
    case "email":
      return {
        label: "Email / Direct Link",
        icon: <Mail className="h-3 w-3 text-amber-400" />,
        className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      };
    case "campaign":
      return {
        label: "Campaign",
        icon: <ExternalLink className="h-3 w-3 text-rose-400" />,
        className: "border-rose-500/30 bg-rose-500/10 text-rose-300",
      };
    case "redirect":
      return {
        label: "Redirect / QR",
        icon: <ArrowRightCircle className="h-3 w-3 text-indigo-400" />,
        className: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
      };
    default:
      return {
        label: "Unknown Source",
        icon: <Compass className="h-3 w-3 text-white/50" />,
        className: "border-white/10 bg-white/5 text-white/60",
      };
  }
}

function getDeviceIcon(deviceType: VisitorSessionRecord["deviceType"]) {
  switch (deviceType) {
    case "mobile":
      return <Smartphone className="h-3.5 w-3.5 text-sky-400" />;
    case "tablet":
      return <Tablet className="h-3.5 w-3.5 text-amber-400" />;
    case "bot":
      return <Bot className="h-3.5 w-3.5 text-rose-400" />;
    case "desktop":
    default:
      return <Laptop className="h-3.5 w-3.5 text-[#7CF9C9]" />;
  }
}

export function VisitorsTab({ visitors }: VisitorsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorSessionRecord | null>(null);

  const filteredVisitors = visitors.filter((v) => {
    const query = searchTerm.toLowerCase();
    return (
      v.ip.toLowerCase().includes(query) ||
      (v.asnOrg && v.asnOrg.toLowerCase().includes(query)) ||
      v.city.toLowerCase().includes(query) ||
      v.countryName.toLowerCase().includes(query) ||
      v.referrer.toLowerCase().includes(query) ||
      (v.acquisitionLabel && v.acquisitionLabel.toLowerCase().includes(query)) ||
      (v.acquisitionChannel && v.acquisitionChannel.toLowerCase().includes(query)) ||
      (v.os && v.os.toLowerCase().includes(query)) ||
      (v.browser && v.browser.toLowerCase().includes(query)) ||
      (v.landingPage && v.landingPage.toLowerCase().includes(query)) ||
      (v.gpuRenderer && v.gpuRenderer.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      {/* Search & Stats Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-mono text-base font-semibold text-white">
            RECRUITER & VISITOR INTELLIGENCE DOSSIER
          </h2>
          <p className="text-xs text-white/50">
            Real-time sessions, verified acquisition sources, hardware signatures, and live journey
            paths
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search by IP, OS, company, channel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-white/10 bg-white/5 pl-9 text-xs text-white placeholder:text-white/40 focus:border-[#7CF9C9]"
          />
        </div>
      </div>

      {/* Main Visitor Table */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/[0.02] font-mono text-white/50">
              <tr>
                <th className="px-4 py-3">VISITOR / NETWORK</th>
                <th className="px-4 py-3">ACQUISITION PATH</th>
                <th className="px-4 py-3">LOCATION</th>
                <th className="px-4 py-3">DEVICE & HARDWARE</th>
                <th className="px-4 py-3">DWELL & SCROLL</th>
                <th className="px-4 py-3">CONVERSIONS</th>
                <th className="px-4 py-3 text-right">DOSSIER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-white/40">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Cpu className="h-6 w-6 text-[#7CF9C9]/30 animate-pulse" />
                      <span className="font-mono text-xs text-white/70">
                        No visitor sessions recorded yet
                      </span>
                      <p className="text-[11px] text-white/40 max-w-sm">
                        Real-time visitor sessions will appear here as visitors navigate your
                        portfolio.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((visitor) => {
                  const channelInfo = getChannelBadge(visitor.acquisitionChannel);
                  return (
                    <tr
                      key={visitor.id}
                      onClick={() => setSelectedVisitor(visitor)}
                      className="cursor-pointer transition-colors hover:bg-white/[0.03]"
                    >
                      {/* Visitor / Network */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {visitor.isTargetCompany ? (
                            <div className="flex h-7 w-7 items-center justify-center rounded bg-purple-500/20 text-purple-400">
                              <Building2 className="h-4 w-4" />
                            </div>
                          ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded bg-white/5 text-white/60">
                              <Cpu className="h-4 w-4" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5 font-medium text-white">
                              <span>{visitor.asnOrg || "Residential / ISP"}</span>
                              {visitor.isTargetCompany && (
                                <Badge className="border-purple-500/40 bg-purple-500/20 px-1 py-0 text-[9px] text-purple-300">
                                  RECRUITER
                                </Badge>
                              )}
                            </div>
                            <div className="font-mono text-[10px] text-white/40">
                              {visitor.ip} · {visitor.timestamp}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Acquisition Path */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] ${channelInfo.className}`}
                            >
                              {channelInfo.icon}
                              <span>{channelInfo.label}</span>
                            </Badge>
                            {visitor.navigationType && visitor.navigationType !== "navigate" && (
                              <Badge
                                variant="outline"
                                className="border-white/10 text-[9px] text-white/40"
                              >
                                {visitor.navigationType}
                              </Badge>
                            )}
                          </div>
                          <div
                            className="font-mono text-[10px] text-white/70 truncate max-w-[200px]"
                            title={visitor.acquisitionLabel}
                          >
                            {visitor.acquisitionLabel}
                          </div>
                          <div className="font-mono text-[9px] text-white/40 truncate max-w-[180px]">
                            Entry: {visitor.landingPage || "/"}
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-white/40" />
                          <span>
                            {visitor.city}, {visitor.countryCode}
                          </span>
                        </div>
                        <div className="text-[10px] text-white/40">
                          {visitor.region || visitor.countryName}
                        </div>
                      </td>

                      {/* Device & Hardware */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-white">
                          {getDeviceIcon(visitor.deviceType)}
                          <span>
                            {visitor.browser} · {visitor.os}
                          </span>
                        </div>
                        <div
                          className="font-mono text-[10px] text-[#7CF9C9]/80 truncate max-w-[170px]"
                          title={visitor.gpuRenderer || "Standard Graphics"}
                        >
                          {visitor.gpuRenderer || "Standard Graphics"}
                        </div>
                        <div className="text-[9px] text-white/40 font-mono">
                          {visitor.screenWidth}x{visitor.screenHeight}
                          {visitor.devicePixelRatio && visitor.devicePixelRatio > 1
                            ? ` @ ${visitor.devicePixelRatio}x`
                            : ""}
                        </div>
                      </td>

                      {/* Dwell & Scroll */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-amber-400" />
                          <span className="font-mono">
                            {Math.floor(visitor.activeDwellSeconds / 60)}m{" "}
                            {visitor.activeDwellSeconds % 60}s
                          </span>
                        </div>
                        <div className="text-[10px] text-white/40">
                          Scrolled {visitor.maxScrollPercentage}%
                        </div>
                      </td>

                      {/* Conversions */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {visitor.hasResumeDownload && (
                            <Badge className="border-[#B8FF3A]/30 bg-[#B8FF3A]/10 text-[9px] text-[#B8FF3A]">
                              <Download className="mr-1 h-2.5 w-2.5" />
                              Resume
                            </Badge>
                          )}
                          {visitor.hasContactIntent && (
                            <Badge className="border-sky-500/30 bg-sky-500/10 text-[9px] text-sky-400">
                              <Mail className="mr-1 h-2.5 w-2.5" />
                              Contact
                            </Badge>
                          )}
                          {visitor.utmSource && (
                            <Badge
                              variant="outline"
                              className="border-white/10 text-[9px] text-white/50"
                            >
                              {visitor.utmSource}
                            </Badge>
                          )}
                          {!visitor.hasResumeDownload &&
                            !visitor.hasContactIntent &&
                            !visitor.utmSource && (
                              <span className="text-[10px] text-white/30 font-mono">—</span>
                            )}
                        </div>
                      </td>

                      {/* Inspect Arrow */}
                      <td className="px-4 py-3.5 text-right">
                        <ChevronRight className="inline-block h-4 w-4 text-white/30" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visitor Deep Dossier Modal / Drawer */}
      {selectedVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <Card className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border-white/10 bg-[#0B2A3B] text-white shadow-2xl">
            <CardHeader className="flex flex-row items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="font-mono text-base text-white">
                    VISITOR DOSSIER // {selectedVisitor.ip}
                  </CardTitle>
                  {selectedVisitor.isTargetCompany && (
                    <Badge className="border-purple-500/40 bg-purple-500/20 text-[10px] text-purple-300">
                      TARGET RECRUITER
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-white/50">
                  {selectedVisitor.asnOrg} · {selectedVisitor.city}, {selectedVisitor.countryName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedVisitor(null)}
                className="h-8 w-8 p-0 text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-6 pt-5">
              {/* Detailed Traffic Acquisition Audit Card */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-white/70">
                    TRAFFIC ACQUISITION & PATHWAY AUDIT
                  </span>
                  {(() => {
                    const ch = getChannelBadge(selectedVisitor.acquisitionChannel);
                    return (
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 text-[10px] ${ch.className}`}
                      >
                        {ch.icon}
                        <span>{ch.label}</span>
                      </Badge>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-white/40 block text-[11px]">Acquisition Label</span>
                    <span className="font-medium text-white">
                      {selectedVisitor.acquisitionLabel || "Direct Visit"}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[11px]">Navigation Type</span>
                    <span className="font-mono text-white/90">
                      {selectedVisitor.navigationType === "reload"
                        ? "Page Reload (F5 / Refresh)"
                        : selectedVisitor.navigationType === "back_forward"
                          ? "History Traversal (Back / Forward)"
                          : "Direct Link Entry / Navigate"}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[11px]">Landing Page URL</span>
                    <span className="font-mono text-[#7CF9C9] break-all">
                      {selectedVisitor.landingPage || "/"}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[11px]">Raw HTTP Referrer</span>
                    <span className="font-mono text-white/80 break-all">
                      {selectedVisitor.referrer && selectedVisitor.referrer !== "Direct"
                        ? selectedVisitor.referrer
                        : "None (Direct address bar entry or private window)"}
                    </span>
                  </div>
                </div>

                {selectedVisitor.utmSource && (
                  <div className="rounded border border-sky-500/20 bg-sky-500/5 p-2 font-mono text-[11px] text-sky-300">
                    <div>UTM Source: {selectedVisitor.utmSource}</div>
                    {selectedVisitor.utmCampaign && (
                      <div>UTM Campaign: {selectedVisitor.utmCampaign}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Technical Hardware & Environment Profile Grid */}
              <div>
                <span className="font-mono text-xs font-semibold text-white/70 block mb-2">
                  VERIFIED HARDWARE & RUNTIME PROFILE
                </span>
                <div className="grid grid-cols-2 gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs sm:grid-cols-4">
                  <div>
                    <span className="text-white/40 block">OS & Platform</span>
                    <span className="font-medium text-white">{selectedVisitor.os}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Browser Engine</span>
                    <span className="font-medium text-white">{selectedVisitor.browser}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">GPU Renderer</span>
                    <span
                      className="font-mono font-medium text-[#7CF9C9] truncate block"
                      title={selectedVisitor.gpuRenderer}
                    >
                      {selectedVisitor.gpuRenderer || "Standard Graphics"}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Screen Resolution</span>
                    <span className="font-mono font-medium text-white">
                      {selectedVisitor.screenWidth}x{selectedVisitor.screenHeight}
                      {selectedVisitor.devicePixelRatio
                        ? ` @ ${selectedVisitor.devicePixelRatio}x`
                        : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Input Modality</span>
                    <span className="font-mono text-white flex items-center gap-1">
                      {selectedVisitor.hasTouch ? (
                        <>
                          <Fingerprint className="h-3 w-3 text-emerald-400" />
                          Touch Enabled
                        </>
                      ) : (
                        <>
                          <MousePointer className="h-3 w-3 text-sky-400" />
                          Mouse Only
                        </>
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Orientation</span>
                    <span className="font-mono capitalize text-white">
                      {selectedVisitor.orientation || "landscape"}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Active Dwell</span>
                    <span className="font-mono font-medium text-amber-400">
                      {selectedVisitor.activeDwellSeconds} seconds
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Scroll Depth</span>
                    <span className="font-mono font-medium text-white">
                      {selectedVisitor.maxScrollPercentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Journey Timeline */}
              <div className="space-y-3">
                <span className="font-mono text-xs font-semibold text-white/70">
                  REAL-TIME INTERACTION JOURNEY ({selectedVisitor.timeline.length} EVENTS)
                </span>
                <div className="space-y-2 border-l border-white/10 pl-4 text-xs max-h-60 overflow-y-auto">
                  {selectedVisitor.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-[#7CF9C9]" />
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-white/40">{step.time}</span>
                        <span className="font-medium text-white">{step.event}</span>
                      </div>
                      <p className="text-[11px] text-white/60">{step.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  onClick={() => setSelectedVisitor(null)}
                  className="bg-white/10 text-xs text-white hover:bg-white/20"
                >
                  Close Dossier
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
