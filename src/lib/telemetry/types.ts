export type TelemetryEventName =
  | "page_view"
  | "scroll_depth"
  | "dwell_pulse"
  | "resume_download"
  | "contact_copy"
  | "project_view"
  | "project_modal_open"
  | "external_click"
  | "canvas_fps_metric"
  | "webgl_context_loss";

export type AcquisitionChannel =
  "direct" | "search" | "social" | "referral" | "email" | "campaign" | "redirect";

export type NavigationType = "navigate" | "reload" | "back_forward" | "prerender" | "unknown";

export interface DeviceTelemetryProfile {
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  hasTouch: boolean;
  touchPoints: number;
  orientation: "landscape" | "portrait";
  colorDepth: number;
  osName: string;
  osVersion: string;
  browserName: string;
  browserVersion: string;
  deviceCategory: "desktop" | "mobile" | "tablet" | "bot";
  gpuVendor?: string;
  gpuRenderer?: string;
  rawGpuString?: string;
  language: string;
  timeZone: string;
  inferredCountry?: string;
  inferredCountryCode?: string;
  inferredCity?: string;
  navigationType: NavigationType;
  acquisitionChannel: AcquisitionChannel;
  acquisitionLabel: string;
  landingPage: string;
}

export interface TelemetryEvent {
  eventName: TelemetryEventName;
  path: string;
  sectionId?: string;
  payload?: Record<string, unknown>;
  dwellIncrementSeconds?: number;
  timestamp: string;
}

export interface TelemetryBatchPayload {
  sessionToken: string;
  visitorHash?: string;
  device: DeviceTelemetryProfile;
  referrer: string;
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  };
  events: TelemetryEvent[];
  maxScrollPercentage?: number;
  activeDwellSeconds?: number;
}
