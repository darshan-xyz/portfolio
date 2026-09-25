import { createFileRoute } from "@tanstack/react-router";
import { UAParser } from "ua-parser-js";
import { isbot } from "isbot";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { recordSession } from "@/lib/admin/telemetry-store";
import type { TelemetryBatchPayload } from "@/lib/telemetry/types";

const KNOWN_TECH_ASNS: Record<string, string> = {
  "15169": "Google LLC",
  "8075": "Microsoft Corporation",
  "16509": "Amazon.com Inc",
  "32934": "Meta Platforms Inc",
  "714": "Apple Inc",
  "2906": "Netflix Inc",
  "13414": "Twitter / X Corp",
  "26496": "GoDaddy",
  "13335": "Cloudflare",
  "396982": "Google Cloud",
  "14618": "Amazon AWS",
};

// In-memory telemetry buffer for high-throughput buffering or when DB is pending
const inMemoryBuffer: Array<{
  session: Record<string, unknown>;
  events: Array<Record<string, unknown>>;
}> = [];

export const Route = createFileRoute("/api/telemetry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rawIp =
            request.headers.get("cf-connecting-ip") ||
            request.headers.get("x-real-ip") ||
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            "127.0.0.1";

          const rawUserAgent = request.headers.get("user-agent") || "";
          const isBot = isbot(rawUserAgent);

          // Geolocation from CDN / edge headers
          const countryCode =
            request.headers.get("cf-ipcountry") ||
            request.headers.get("x-vercel-ip-country") ||
            "US";
          const city =
            request.headers.get("cf-ipcity") ||
            request.headers.get("x-vercel-ip-city") ||
            "Unknown";
          const region =
            request.headers.get("cf-region") ||
            request.headers.get("x-vercel-ip-country-region") ||
            "Unknown";
          const latStr = request.headers.get("x-vercel-ip-latitude");
          const lonStr = request.headers.get("x-vercel-ip-longitude");
          const latitude = latStr ? parseFloat(latStr) : null;
          const longitude = lonStr ? parseFloat(lonStr) : null;

          // ASN lookup from headers
          const asnHeader =
            request.headers.get("cf-as-number") ||
            request.headers.get("x-vercel-ip-as-number") ||
            "";
          const asnNumber = asnHeader.replace(/\D/g, "");
          const matchedCompany = KNOWN_TECH_ASNS[asnNumber] || null;

          // Device & Browser parser
          const uaParsed = new UAParser(rawUserAgent).getResult();
          const deviceType = isBot
            ? "bot"
            : uaParsed.device.type === "mobile"
              ? "mobile"
              : uaParsed.device.type === "tablet"
                ? "tablet"
                : "desktop";

          const body = (await request.json().catch(() => null)) as TelemetryBatchPayload | null;
          if (!body || !body.sessionToken) {
            return new Response(JSON.stringify({ error: "Invalid payload" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const hasResume = body.events.some((e) => e.eventName === "resume_download");
          const hasContact = body.events.some((e) => e.eventName === "contact_copy");

          const sessionRecord = {
            session_token: body.sessionToken,
            visitor_hash: body.visitorHash || "anon",
            raw_ip: rawIp,
            country_code: countryCode,
            region,
            city,
            latitude,
            longitude,
            asn_number: asnNumber || null,
            asn_org: matchedCompany,
            device_type: deviceType,
            os_name: uaParsed.os.name || "Unknown",
            os_version: uaParsed.os.version || "",
            browser_name: uaParsed.browser.name || "Unknown",
            browser_version: uaParsed.browser.version || "",
            gpu_vendor: body.device?.gpuVendor || null,
            gpu_renderer: body.device?.gpuRenderer || null,
            screen_width: body.device?.screenWidth || 0,
            screen_height: body.device?.screenHeight || 0,
            device_pixel_ratio: body.device?.devicePixelRatio || 1,
            has_touch: body.device?.hasTouch || false,
            referrer_url: body.referrer || null,
            utm_source: body.utm?.source || null,
            utm_medium: body.utm?.medium || null,
            utm_campaign: body.utm?.campaign || null,
            utm_content: body.utm?.content || null,
            utm_term: body.utm?.term || null,
            max_scroll_percentage: body.maxScrollPercentage || 0,
            active_dwell_seconds: body.activeDwellSeconds || 0,
            is_bot: isBot,
            has_resume_download: hasResume,
            has_contact_intent: hasContact,
            ended_at: new Date().toISOString(),
          };

          // Record into real-time shared store
          recordSession({
            sessionToken: body.sessionToken,
            visitorHash: body.visitorHash || "anon",
            rawIp,
            countryCode,
            city,
            region,
            asnNumber: asnNumber || null,
            asnOrg: matchedCompany,
            deviceType,
            os: uaParsed.os.name || "Unknown",
            browser: uaParsed.browser.name || "Unknown",
            gpuRenderer: body.device?.gpuRenderer || null,
            screenWidth: body.device?.screenWidth || 0,
            screenHeight: body.device?.screenHeight || 0,
            referrer: body.referrer || null,
            utmSource: body.utm?.source || null,
            utmCampaign: body.utm?.campaign || null,
            activeDwellSeconds: body.activeDwellSeconds || 0,
            maxScrollPercentage: body.maxScrollPercentage || 0,
            hasResumeDownload: hasResume,
            hasContactIntent: hasContact,
            events: body.events,
          });

          // Asynchronously persist to Supabase if available
          const supabase = createServerSupabaseClient();
          supabase
            .from("analytics_sessions")
            .upsert(sessionRecord, { onConflict: "session_token" })
            .select("id")
            .single()
            .then(async ({ data: sessionData, error }) => {
              if (error || !sessionData?.id) return;

              const eventsToInsert = body.events.map((e) => ({
                session_id: sessionData.id,
                event_name: e.eventName,
                page_path: e.path,
                section_id: e.sectionId || null,
                payload: e.payload || {},
                dwell_increment_seconds: e.dwellIncrementSeconds || 0,
                created_at: e.timestamp || new Date().toISOString(),
              }));

              if (eventsToInsert.length > 0) {
                await supabase.from("analytics_events").insert(eventsToInsert);
              }
            })
            .catch(() => {
              // Non-blocking fail-safe
            });

          return new Response(JSON.stringify({ status: "recorded", buffered: true }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        } catch {
          // Never let analytics ingestion fail with a 500 error
          return new Response(JSON.stringify({ status: "acknowledged" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
