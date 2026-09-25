import { createFileRoute } from "@tanstack/react-router";
import { recordInquiry } from "@/lib/admin/telemetry-store";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rawIp =
            request.headers.get("cf-connecting-ip") ||
            request.headers.get("x-real-ip") ||
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            "127.0.0.1";

          const body = (await request.json().catch(() => null)) as {
            name?: string;
            email?: string;
            company?: string;
            message?: string;
          } | null;

          if (!body || !body.name || !body.email || !body.message) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const inquiry = recordInquiry({
            name: body.name,
            email: body.email,
            company: body.company,
            message: body.message,
            ip: rawIp,
          });

          return new Response(JSON.stringify({ success: true, inquiryId: inquiry.id }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch {
          return new Response(JSON.stringify({ error: "Internal error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
