import { createFileRoute } from "@tanstack/react-router";
import { UAParser } from "ua-parser-js";
import { isbot } from "isbot";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { recordSession, recordAuditLog } from "@/lib/admin/telemetry-store";
import { checkRateLimit } from "@/lib/security/rate-limiter";
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

          // Enforce active sliding-window token bucket rate limiting
          const rateCheck = checkRateLimit(rawIp, "telemetry");
          if (!rateCheck.allowed) {
            recordAuditLog(
              "security.telemetry_throttled",
              `Telemetry rate limit exceeded for ${rawIp} (${rateCheck.current}/${rateCheck.limit} req/min)`,
              rawIp,
            );
            return new Response(
              JSON.stringify({ error: "Too many requests. Please wait before sending telemetry." }),
              {
                status: 429,
                headers: {
                  "Content-Type": "application/json",
                  "Retry-After": String(Math.ceil(rateCheck.resetMs / 1000)),
                },
              },
            );
          }

          const rawUserAgent = request.headers.get("user-agent") || "";
          const isBot = isbot(rawUserAgent);

          const body = (await request.json().catch(() => null)) as TelemetryBatchPayload | null;
          if (!body || !body.sessionToken) {
            return new Response(JSON.stringify({ error: "Invalid payload" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const isLocal =
            rawIp === "127.0.0.1" ||
            rawIp === "::1" ||
            rawIp.startsWith("192.168.") ||
            rawIp.startsWith("10.") ||
            rawIp.startsWith("172.");

          // ASN & Corporate Network mapping
          const asnHeader =
            request.headers.get("cf-as-number") || request.headers.get("x-vercel-ip-as-number");
          const asnNumber = asnHeader ? parseInt(asnHeader, 10).toString() : null;
          const matchedCompany =
            asnNumber && KNOWN_TECH_ASNS[asnNumber] ? KNOWN_TECH_ASNS[asnNumber] : null;

          // Geolocation from CDN / edge headers with smart client-hint fallbacks
          const edgeCountry =
            request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country");
          const edgeCity =
            request.headers.get("cf-ipcity") || request.headers.get("x-vercel-ip-city");
          const edgeRegion =
            request.headers.get("cf-region") || request.headers.get("x-vercel-ip-country-region");

          let countryCode = "IN";
          let city = "Local / Coimbatore";
          let region = "Development";
          let companyOrg = matchedCompany;

          if (isLocal) {
            countryCode = body.device?.inferredCountryCode || "IN";
            city = body.device?.inferredCity || "Local Dev";
            region = "Localhost Network";
            companyOrg = "Localhost / Developer Station";
          } else if (edgeCountry) {
            countryCode = edgeCountry;
            city =
              edgeCity && edgeCity !== "Unknown"
                ? edgeCity
                : body.device?.inferredCity || "Detected City";
            region = edgeRegion || "";
            companyOrg =
              matchedCompany || (asnHeader ? `ASN ${asnNumber}` : "Internet Service Provider");
          } else if (body.device?.inferredCountryCode) {
            countryCode = body.device.inferredCountryCode;
            city = body.device.inferredCity || "Detected Location";
            region = body.device.timeZone || "";
            companyOrg = matchedCompany || "Direct Connection";
          }

          const latStr = request.headers.get("x-vercel-ip-latitude");
          const lonStr = request.headers.get("x-vercel-ip-longitude");
          const latitude = latStr ? parseFloat(latStr) : null;
          const longitude = lonStr ? parseFloat(lonStr) : null;

          // Device & Browser parser merging client hints with server UA
          const uaParsed = new UAParser(rawUserAgent).getResult();
          const deviceType = isBot
            ? "bot"
            : body.device?.deviceCategory ||
              (uaParsed.device.type === "mobile"
                ? "mobile"
                : uaParsed.device.type === "tablet"
                  ? "tablet"
                  : "desktop");

          const osDisplayName =
            body.device?.osName && body.device.osName !== "Unknown OS"
              ? body.device.osVersion
                ? `${body.device.osName} ${body.device.osVersion}`
                : body.device.osName
              : uaParsed.os.name
                ? `${uaParsed.os.name} ${uaParsed.os.version || ""}`.trim()
                : "Unknown OS";

          const browserDisplayName =
            body.device?.browserName && body.device.browserName !== "Browser"
              ? body.device.browserVersion
                ? `${body.device.browserName} ${body.device.browserVersion}`
                : body.device.browserName
              : uaParsed.browser.name
                ? `${uaParsed.browser.name} ${uaParsed.browser.version || ""}`.trim()
                : "Unknown Browser";

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
            asn_org: companyOrg,
            device_type: deviceType,
            os_name: osDisplayName,
            os_version: body.device?.osVersion || uaParsed.os.version || "",
            browser_name: browserDisplayName,
            browser_version: body.device?.browserVersion || uaParsed.browser.version || "",
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
            asnOrg: companyOrg,
            deviceType,
            os: osDisplayName,
            browser: browserDisplayName,
            gpuRenderer: body.device?.gpuRenderer || null,
            screenWidth: body.device?.screenWidth || 0,
            screenHeight: body.device?.screenHeight || 0,
            devicePixelRatio: body.device?.devicePixelRatio || 1,
            hasTouch: body.device?.hasTouch || false,
            orientation:
              body.device?.orientation ||
              (body.device?.screenWidth >= body.device?.screenHeight ? "landscape" : "portrait"),
            referrer: body.referrer || null,
            acquisitionChannel: body.device?.acquisitionChannel || "direct",
            acquisitionLabel:
              body.device?.acquisitionLabel ||
              (body.referrer ? `Referral: ${body.referrer}` : "Direct Visit"),
            navigationType: body.device?.navigationType || "navigate",
            landingPage: body.device?.landingPage || body.events[0]?.path || "/",
            utmSource: body.utm?.source || null,
            utmCampaign: body.utm?.campaign || null,
            activeDwellSeconds: body.activeDwellSeconds || 0,
            maxScrollPercentage: body.maxScrollPercentage || 0,
            hasResumeDownload: hasResume,
            hasContactIntent: hasContact,
            events: body.events,
          });

          // Asynchronously persist to Supabase if available
          try {
            const supabase = createServerSupabaseClient();
            if (supabase) {
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
            }
          } catch {
            // Supabase offline fail-safe
          }

          return new Response(JSON.stringify({ status: "recorded", buffered: true }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        } catch (err) {
          console.error("[TELEMETRY ROUTE ERROR]:", err);
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
