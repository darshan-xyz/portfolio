export interface VisitorSessionRecord {
  id: string;
  sessionToken: string;
  ip: string;
  countryCode: string;
  countryName: string;
  city: string;
  region: string;
  asnNumber?: string;
  asnOrg?: string;
  isTargetCompany?: boolean;
  deviceType: "desktop" | "mobile" | "tablet" | "bot";
  os: string;
  browser: string;
  gpuRenderer?: string;
  screenWidth: number;
  screenHeight: number;
  referrer: string;
  utmSource?: string;
  utmCampaign?: string;
  activeDwellSeconds: number;
  maxScrollPercentage: number;
  hasResumeDownload: boolean;
  hasContactIntent: boolean;
  timestamp: string;
  eventsCount: number;
  timeline: Array<{
    time: string;
    event: string;
    detail: string;
  }>;
}

export interface CrmInquiryRecord {
  id: string;
  name: string;
  email: string;
  company: string;
  roleType: string;
  opportunityType: string;
  message: string;
  pipelineStage: "new" | "screening" | "interview" | "offer" | "archived";
  priority: "low" | "medium" | "high" | "urgent";
  sentiment: "positive" | "neutral" | "urgent";
  aiSummary: string;
  createdAt: string;
}

export interface AdminDashboardData {
  stats: {
    totalViews: number;
    uniqueVisitors: number;
    avgDwellSeconds: number;
    resumeDownloads: number;
    targetCompanyVisits: number;
    viewsTrendPercent: number;
    visitorsTrendPercent: number;
  };
  trafficSeries: Array<{
    date: string;
    views: number;
    visitors: number;
    resumeDownloads: number;
  }>;
  topPages: Array<{
    path: string;
    name: string;
    views: number;
    avgDwell: number;
  }>;
  deviceBreakdown: Array<{
    name: "Desktop" | "Mobile" | "Tablet" | "Bot";
    value: number;
  }>;
  geoBreakdown: Array<{
    country: string;
    code: string;
    city: string;
    visits: number;
    percent: number;
  }>;
  visitors: VisitorSessionRecord[];
  inquiries: CrmInquiryRecord[];
}
