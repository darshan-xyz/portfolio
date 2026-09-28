import { createFileRoute } from "@tanstack/react-router";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  getLiveDashboardData,
  getActiveVisitorsCount,
  getAuditLogs,
  updateInquiryStage,
  recordAuditLog,
} from "@/lib/admin/telemetry-store";
import { getSecurityDiagnostics } from "@/lib/security/rate-limiter";

function getResumeMetadata() {
  try {
    const resumePath = path.resolve(process.cwd(), "public", "resume.pdf");
    if (fs.existsSync(resumePath)) {
      const stats = fs.statSync(resumePath);
      return {
        exists: true,
        sizeBytes: stats.size,
        sizeFormatted: `${(stats.size / 1024).toFixed(1)} KB`,
        updatedAt: stats.mtime.toISOString(),
      };
    }
  } catch {}
  return {
    exists: false,
    sizeBytes: 0,
    sizeFormatted: "Unknown",
    updatedAt: new Date().toISOString(),
  };
}

export const Route = createFileRoute("/api/admin")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const dashboardData = getLiveDashboardData();
          const activeCount = getActiveVisitorsCount();
          const auditLogs = getAuditLogs();
          const securityDiagnostics = getSecurityDiagnostics();
          const resumeMeta = getResumeMetadata();

          return new Response(
            JSON.stringify({
              success: true,
              data: dashboardData,
              activeCount,
              auditLogs,
              securityDiagnostics,
              resumeMeta,
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store, no-cache, must-revalidate",
              },
            },
          );
        } catch (err) {
          return new Response(JSON.stringify({ error: "Failed to fetch dashboard data" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      POST: async ({ request }) => {
        try {
          const rawIp =
            request.headers.get("cf-connecting-ip") ||
            request.headers.get("x-real-ip") ||
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            "127.0.0.1";

          const body = (await request.json().catch(() => null)) as {
            action?: string;
            id?: string;
            stage?: "new" | "screening" | "interview" | "offer" | "archived";
          } | null;

          if (body?.action === "update_stage" && body.id && body.stage) {
            updateInquiryStage(body.id, body.stage, rawIp);
            return new Response(JSON.stringify({ success: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (body?.action === "upload_resume") {
            const uploadBody = body as {
              action?: string;
              base64Data?: string;
              fileName?: string;
            };
            if (!uploadBody.base64Data) {
              return new Response(JSON.stringify({ error: "No file content provided" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }

            // Clean data url prefix if present (e.g., data:application/pdf;base64,...)
            const base64Clean = uploadBody.base64Data.replace(/^data:.*?;base64,/, "");
            const fileBuffer = Buffer.from(base64Clean, "base64");

            if (fileBuffer.length === 0) {
              return new Response(JSON.stringify({ error: "Empty file payload" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }

            // Max 15 MB limit
            if (fileBuffer.length > 15 * 1024 * 1024) {
              return new Response(
                JSON.stringify({ error: "File size exceeds 15 MB limit" }),
                {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                },
              );
            }

            const publicResumePath = path.resolve(process.cwd(), "public", "resume.pdf");
            fs.writeFileSync(publicResumePath, fileBuffer);

            // Also synchronize assets folder if exists
            const assetsResumePath = path.resolve(process.cwd(), "src", "assets", "resume.pdf");
            try {
              if (fs.existsSync(path.dirname(assetsResumePath))) {
                fs.writeFileSync(assetsResumePath, fileBuffer);
              }
            } catch {}

            recordAuditLog(
              "cms.resume_updated",
              `Resume updated via Admin Studio (${(fileBuffer.length / 1024).toFixed(1)} KB${uploadBody.fileName ? `, original: ${uploadBody.fileName}` : ""})`,
              rawIp,
            );

            const updatedMeta = getResumeMetadata();
            return new Response(
              JSON.stringify({
                success: true,
                message: "Resume successfully updated across live portfolio",
                resumeMeta: updatedMeta,
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          if (body?.action === "audit_login") {
            recordAuditLog("auth.admin_login", "Admin accessed Archon Command Center", rawIp);
            return new Response(JSON.stringify({ success: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ error: "Unknown action" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        } catch {
          return new Response(JSON.stringify({ error: "Operation failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
