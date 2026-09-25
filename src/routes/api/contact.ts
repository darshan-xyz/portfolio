import { createFileRoute } from "@tanstack/react-router";
import { recordInquiry, recordAuditLog } from "@/lib/admin/telemetry-store";
import { checkRateLimit } from "@/lib/security/rate-limiter";

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
            website?: string;
            _gotcha?: string;
            gotcha?: string;
          } | null;

          // Honeypot anti-bot filter (silent absorption)
          if (body?.website || body?._gotcha || body?.gotcha) {
            recordAuditLog(
              "security.honeypot_trapped",
              `Automated bot trapped in hidden honeypot input`,
              rawIp,
            );
            return new Response(JSON.stringify({ success: true, inquiryId: "inq-bot-filtered" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Active token bucket rate limiting (5 req / 10 min)
          const rateCheck = checkRateLimit(rawIp, "contact");
          if (!rateCheck.allowed) {
            recordAuditLog(
              "security.contact_throttled",
              `Contact form rate limit exceeded (${rateCheck.current}/${rateCheck.limit} req / 10min)`,
              rawIp,
            );
            return new Response(
              JSON.stringify({
                error: "Message limit exceeded. Please wait a few minutes before submitting again.",
              }),
              {
                status: 429,
                headers: {
                  "Content-Type": "application/json",
                  "Retry-After": String(Math.ceil(rateCheck.resetMs / 1000)),
                },
              },
            );
          }

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
