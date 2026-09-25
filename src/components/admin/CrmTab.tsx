import { useState, useEffect } from "react";
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
import { toast } from "sonner";

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

  // Synchronize with incoming real-time poll updates
  useEffect(() => {
    setInquiries(initialInquiries);
  }, [initialInquiries]);

  const moveStage = async (id: string, nextStage: CrmInquiryRecord["pipelineStage"]) => {
    // Optimistic UI update
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, pipelineStage: nextStage } : inq)),
    );

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_stage",
          id,
          stage: nextStage,
        }),
      });

      if (res.ok) {
        toast.success(`Inquiry moved to "${nextStage}" stage`);
      } else {
        toast.error("Failed to persist stage change to server");
      }
    } catch {
      toast.error("Network error updating inquiry stage");
    }
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
            Real inbound opportunities submitted through portfolio contact channels
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-400"
          >
            {inquiries.filter((i) => i.pipelineStage === "new").length} New Inquiries
          </Badge>
          <Badge
            variant="outline"
            className="border-white/10 bg-white/5 font-mono text-xs text-white/60"
          >
            {inquiries.length} Total Messages
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
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-white/5 text-[11px] text-white/30 text-center p-3 font-mono">
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

                        {/* Company & Email */}
                        <div className="space-y-1 text-xs">
                          {inq.company && inq.company !== "Not specified" && (
                            <div className="flex items-center gap-1.5 text-white/80">
                              <Building className="h-3 w-3 text-white/40" />
                              <span className="font-medium text-[11px]">{inq.company}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-white/60">
                            <Mail className="h-3 w-3 text-white/40" />
                            <a
                              href={`mailto:${inq.email}`}
                              className="font-mono text-[10px] hover:text-[#7CF9C9] truncate max-w-[180px]"
                            >
                              {inq.email}
                            </a>
                          </div>
                        </div>

                        {/* Message Content */}
                        <div className="rounded border border-white/5 bg-white/[0.02] p-2 text-[11px] text-white/80 line-clamp-3">
                          "{inq.message}"
                        </div>

                        {/* Opportunity Type & Timestamp */}
                        <div className="flex items-center justify-between text-[10px] text-white/40 border-t border-white/5 pt-2">
                          <span className="font-mono">{inq.opportunityType}</span>
                          <span>{inq.createdAt}</span>
                        </div>

                        {/* Pipeline Stage Movement Controls */}
                        <div className="flex items-center justify-between gap-1 border-t border-white/5 pt-2">
                          {stage.id !== "new" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const idx = STAGES.findIndex((s) => s.id === stage.id);
                                if (idx > 0) moveStage(inq.id, STAGES[idx - 1].id);
                              }}
                              className="h-6 px-1.5 text-[10px] text-white/50 hover:text-white"
                            >
                              ← Back
                            </Button>
                          )}
                          {stage.id !== "archived" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const idx = STAGES.findIndex((s) => s.id === stage.id);
                                if (idx < STAGES.length - 1) moveStage(inq.id, STAGES[idx + 1].id);
                              }}
                              className="ml-auto h-6 gap-1 px-1.5 text-[10px] text-[#7CF9C9] hover:bg-[#7CF9C9]/10"
                            >
                              Advance →
                            </Button>
                          )}
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
