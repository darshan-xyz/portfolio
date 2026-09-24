import { useState } from "react";
import {
  Mail,
  Building,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Archive,
  ExternalLink,
} from "lucide-react";
import type { CrmInquiryRecord } from "@/lib/admin/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CrmTabProps {
  inquiries: CrmInquiryRecord[];
}

const STAGES: Array<{ id: CrmInquiryRecord["pipelineStage"]; label: string }> = [
  { id: "new", label: "New Leads" },
  { id: "screening", label: "Screening" },
  { id: "interview", label: "Interview Scheduled" },
  { id: "offer", label: "Offer / Contract" },
  { id: "archived", label: "Archived" },
];

export function CrmTab({ inquiries: initialInquiries }: CrmTabProps) {
  const [inquiries, setInquiries] = useState<CrmInquiryRecord[]>(initialInquiries);

  const moveStage = (id: string, nextStage: CrmInquiryRecord["pipelineStage"]) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, pipelineStage: nextStage } : inq)),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-mono text-base font-semibold text-white">
            RECRUITMENT & INQUIRY PIPELINE (CRM)
          </h2>
          <p className="text-xs text-white/50">
            Inbound opportunities with automated AI sentiment analysis and lifecycle progression
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-400"
          >
            {inquiries.filter((i) => i.pipelineStage === "new").length} New Inquiries
          </Badge>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {STAGES.map((stage) => {
          const stageInquiries = inquiries.filter((i) => i.pipelineStage === stage.id);
          return (
            <div
              key={stage.id}
              className="flex flex-col rounded-xl border border-white/10 bg-[#0B2A3B]/30 p-3 backdrop-blur-md min-h-[500px]"
            >
              {/* Column Header */}
              <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                  {stage.label}
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/60">
                  {stageInquiries.length}
                </span>
              </div>

              {/* Cards in Column */}
              <div className="flex-1 space-y-3">
                {stageInquiries.length === 0 ? (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-white/5 text-[11px] text-white/30">
                    No leads in {stage.label.toLowerCase()}
                  </div>
                ) : (
                  stageInquiries.map((inq) => (
                    <Card
                      key={inq.id}
                      className="border-white/10 bg-[#040914]/90 text-white shadow-lg transition-all hover:border-[#7CF9C9]/50"
                    >
                      <CardContent className="space-y-3 p-3.5">
                        {/* Header: Sender & Priority */}
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <div className="font-semibold text-xs text-white">{inq.name}</div>
                            <div className="text-[10px] text-white/50">{inq.roleType}</div>
                          </div>
                          <Badge
                            className={`text-[9px] px-1.5 py-0 uppercase ${
                              inq.priority === "urgent"
                                ? "border-rose-500/40 bg-rose-500/20 text-rose-300"
                                : inq.priority === "high"
                                  ? "border-amber-500/40 bg-amber-500/20 text-amber-300"
                                  : "border-white/10 bg-white/5 text-white/60"
                            }`}
                          >
                            {inq.priority}
                          </Badge>
                        </div>

                        {/* Company & Role */}
                        <div className="flex items-center gap-1.5 rounded bg-white/[0.03] p-1.5 text-[11px] text-white/70">
                          <Building className="h-3 w-3 shrink-0 text-[#7CF9C9]" />
                          <span className="truncate">{inq.company}</span>
                        </div>

                        {/* AI Summary Badge */}
                        <div className="rounded border border-purple-500/20 bg-purple-500/10 p-2 text-[10px] text-purple-200">
                          <div className="flex items-center gap-1 font-mono text-[9px] text-purple-300 mb-0.5">
                            <Sparkles className="h-2.5 w-2.5" />
                            AI TRIAGE SUMMARY
                          </div>
                          <p className="line-clamp-2 leading-relaxed">{inq.aiSummary}</p>
                        </div>

                        {/* Raw Message Preview */}
                        <p className="text-[11px] text-white/60 line-clamp-3 italic">
                          "{inq.message}"
                        </p>

                        <div className="text-[10px] text-white/30 font-mono">{inq.createdAt}</div>

                        {/* Card Actions */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-2">
                          <a
                            href={`mailto:${inq.email}?subject=${encodeURIComponent(`Re: ${inq.opportunityType} inquiry — Darshan R`)}`}
                            className="inline-flex items-center gap-1 text-[11px] text-[#7CF9C9] hover:underline"
                          >
                            <Mail className="h-3 w-3" />
                            Reply
                          </a>

                          <div className="flex items-center gap-1">
                            {stage.id === "new" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => moveStage(inq.id, "screening")}
                                className="h-6 px-1.5 text-[10px] text-sky-400 hover:bg-sky-500/10"
                              >
                                Screening
                                <ArrowRight className="ml-1 h-2.5 w-2.5" />
                              </Button>
                            )}
                            {stage.id === "screening" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => moveStage(inq.id, "interview")}
                                className="h-6 px-1.5 text-[10px] text-amber-400 hover:bg-amber-500/10"
                              >
                                Interview
                                <ArrowRight className="ml-1 h-2.5 w-2.5" />
                              </Button>
                            )}
                            {stage.id === "interview" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => moveStage(inq.id, "offer")}
                                className="h-6 px-1.5 text-[10px] text-emerald-400 hover:bg-emerald-500/10"
                              >
                                Offer
                                <CheckCircle2 className="ml-1 h-2.5 w-2.5" />
                              </Button>
                            )}
                            {stage.id !== "archived" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => moveStage(inq.id, "archived")}
                                className="h-6 px-1.5 text-[10px] text-white/40 hover:bg-white/5 hover:text-white"
                              >
                                <Archive className="h-2.5 w-2.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
