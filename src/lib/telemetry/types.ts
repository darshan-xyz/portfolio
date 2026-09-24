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

export interface DeviceTelemetryProfile {
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  hasTouch: boolean;
  colorDepth: number;
  gpuVendor?: string;
  gpuRenderer?: string;
  language: string;
  timeZone: string;
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
