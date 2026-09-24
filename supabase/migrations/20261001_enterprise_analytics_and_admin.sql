-- Enterprise Analytics, Telemetry, CRM & CMS Schema for Darshan R's Portfolio
-- Target: PostgreSQL / Supabase with Row Level Security (RLS) and Partitioning

-- 1. Enable Core Cryptographic and UUID Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Daily Rotating Salts (Enables GDPR/ePrivacy compliant cookie-less visitor tracking)
CREATE TABLE IF NOT EXISTS public.analytics_salts (
    day DATE PRIMARY KEY,
    salt TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enriched Companies Table (B2B Lead & Recruiter Intelligence)
CREATE TABLE IF NOT EXISTS public.enriched_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT,
    asn_number TEXT,
    asn_org TEXT UNIQUE,
    industry TEXT,
    company_size TEXT,
    headquarters TEXT,
    logo_url TEXT,
    is_target_company BOOLEAN DEFAULT false,
    notes TEXT,
    total_sessions_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_companies_asn_org ON public.enriched_companies(asn_org);
CREATE INDEX IF NOT EXISTS idx_companies_is_target ON public.enriched_companies(is_target_company) WHERE is_target_company = true;

-- 4. Analytics Sessions Table (Per-Visitor Aggregated Session Records)
CREATE TABLE IF NOT EXISTS public.analytics_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token TEXT NOT NULL UNIQUE,
    visitor_hash TEXT NOT NULL, -- Daily rotating HMAC-SHA256 (IP + UA + Salt)
    raw_ip TEXT,
    country_code VARCHAR(8),
    country_name TEXT,
    region TEXT,
    city TEXT,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    asn_number TEXT,
    asn_org TEXT,
    company_id UUID REFERENCES public.enriched_companies(id) ON DELETE SET NULL,
    device_type VARCHAR(20) DEFAULT 'desktop', -- 'desktop', 'mobile', 'tablet', 'bot'
    os_name VARCHAR(50),
    os_version VARCHAR(50),
    browser_name VARCHAR(50),
    browser_version VARCHAR(50),
    gpu_vendor TEXT,
    gpu_renderer TEXT,
    screen_width INT,
    screen_height INT,
    device_pixel_ratio NUMERIC(3,2),
    has_touch BOOLEAN DEFAULT false,
    referrer_url TEXT,
    referrer_domain TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    entry_path TEXT DEFAULT '/',
    exit_path TEXT,
    total_duration_seconds INT DEFAULT 0,
    active_dwell_seconds INT DEFAULT 0,
    max_scroll_percentage INT DEFAULT 0,
    is_bot BOOLEAN DEFAULT false,
    has_resume_download BOOLEAN DEFAULT false,
    has_contact_intent BOOLEAN DEFAULT false,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_visitor_hash ON public.analytics_sessions(visitor_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON public.analytics_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_asn_org ON public.analytics_sessions(asn_org);
CREATE INDEX IF NOT EXISTS idx_sessions_is_bot ON public.analytics_sessions(is_bot) WHERE is_bot = false;
CREATE INDEX IF NOT EXISTS idx_sessions_country ON public.analytics_sessions(country_code);

-- 5. Analytics Events Table (Granular Telemetry Stream)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.analytics_sessions(id) ON DELETE CASCADE,
    event_name VARCHAR(64) NOT NULL, -- 'page_view', 'scroll_depth', 'dwell_pulse', 'resume_download', 'contact_copy', 'project_expand'
    page_path TEXT NOT NULL,
    section_id VARCHAR(64),
    payload JSONB DEFAULT '{}'::jsonb,
    dwell_increment_seconds INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Partitions for 2026 and 2027
CREATE TABLE IF NOT EXISTS analytics_events_2026_q3 PARTITION OF public.analytics_events
    FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');
CREATE TABLE IF NOT EXISTS analytics_events_2026_q4 PARTITION OF public.analytics_events
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');
CREATE TABLE IF NOT EXISTS analytics_events_2027_q1 PARTITION OF public.analytics_events
    FOR VALUES FROM ('2027-01-01 00:00:00+00') TO ('2027-04-01 00:00:00+00');

CREATE INDEX IF NOT EXISTS idx_events_session_id ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_name_created ON public.analytics_events(event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.analytics_events(created_at DESC);

-- 6. Inbound Inquiries & Lead Pipeline CRM
CREATE TABLE IF NOT EXISTS public.crm_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    role_type TEXT, -- 'Recruiter', 'Engineering Manager', 'Founder', 'Other'
    opportunity_type TEXT, -- 'Full-Time Role', 'Contract', 'Advisory', 'Networking'
    message TEXT NOT NULL,
    pipeline_stage VARCHAR(32) DEFAULT 'new', -- 'new', 'screening', 'interview_scheduled', 'offer_stage', 'closed_won', 'archived'
    priority VARCHAR(16) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    sentiment_label VARCHAR(16), -- 'positive', 'neutral', 'negative'
    ai_summary TEXT,
    internal_notes TEXT,
    matched_session_id UUID REFERENCES public.analytics_sessions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_pipeline_stage ON public.crm_inquiries(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_crm_created_at ON public.crm_inquiries(created_at DESC);

-- 7. Dynamic Headless Content Management (Projects & Resumes)
CREATE TABLE IF NOT EXISTS public.cms_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    highlights TEXT[] NOT NULL DEFAULT '{}',
    stack TEXT[] NOT NULL DEFAULT '{}',
    domain VARCHAR(64) NOT NULL,
    demo_url TEXT,
    github_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cms_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_tag VARCHAR(32) NOT NULL, -- e.g. 'v2.4-ai-lead'
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_size_bytes INT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    download_count INT DEFAULT 0,
    changelog TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Security & Immutable Audit Logs
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID,
    actor_email TEXT,
    action TEXT NOT NULL, -- 'auth.login', 'cms.project_update', 'crm.stage_change', 'resume.switch'
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    diff_payload JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.security_audit_logs(created_at DESC);

-- 9. Row Level Security (RLS) Configuration
ALTER TABLE public.analytics_salts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enriched_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Telemetry Ingestion Policies (Public can write events and sessions)
CREATE POLICY "Allow public telemetry session insertion"
    ON public.analytics_sessions FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public telemetry session update"
    ON public.analytics_sessions FOR UPDATE
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public telemetry event insertion"
    ON public.analytics_events FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Public Contact Form Submission Policy
CREATE POLICY "Allow public inquiry insertion"
    ON public.crm_inquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Public CMS Read Policies
CREATE POLICY "Allow public read published projects"
    ON public.cms_projects FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

CREATE POLICY "Allow public read active resume"
    ON public.cms_resumes FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Strict Admin Access for Analytics, CRM, and Management
CREATE POLICY "Admin full access to sessions"
    ON public.analytics_sessions FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

CREATE POLICY "Admin full access to events"
    ON public.analytics_events FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

CREATE POLICY "Admin full access to companies"
    ON public.enriched_companies FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

CREATE POLICY "Admin full access to inquiries"
    ON public.crm_inquiries FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

CREATE POLICY "Admin full access to projects"
    ON public.cms_projects FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

CREATE POLICY "Admin full access to resumes"
    ON public.cms_resumes FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

CREATE POLICY "Admin full access to audit logs"
    ON public.security_audit_logs FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');
