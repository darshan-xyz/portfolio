import { createFileRoute } from "@tanstack/react-router";
import {
  getLiveDashboardData,
  getActiveVisitorsCount,
  getAuditLogs,
  updateInquiryStage,
  recordAuditLog,
} from "@/lib/admin/telemetry-store";

export const Route = createFileRoute("/api/admin")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const dashboardData = getLiveDashboardData();
          const activeCount = getActiveVisitorsCount();
          const auditLogs = getAuditLogs();

          return new Response(
            JSON.stringify({
              success: true,
              data: dashboardData,
              activeCount,
              auditLogs,
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
