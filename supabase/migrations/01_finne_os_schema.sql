-- =========================================================================
-- FINNE OS: COMPLETE CONSOLIDATED DATABASE SCHEMA & SSO SYNC TRIGGER
-- =========================================================================

-- 1. Enable Core UUID Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Base Tables
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  full_name TEXT,
  phone TEXT,
  username TEXT,
  role TEXT,
  face_biometrics TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,
  key_hint TEXT NOT NULL,
  name TEXT NOT NULL,
  scopes TEXT[] DEFAULT '{telemetry:write}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT,
  status TEXT,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT,
  type TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.threats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  source TEXT,
  target TEXT,
  severity TEXT,
  type TEXT,
  status TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.honeypots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT,
  ip_address TEXT,
  status TEXT,
  hits INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  action TEXT,
  requested_by TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  event TEXT,
  actor TEXT,
  details TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  enabled BOOLEAN DEFAULT true
);

-- 3. Seed Default Organizations
INSERT INTO public.organizations (name) VALUES ('IDBI Customers') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.organizations (name) VALUES ('IDBI Bank Staff') ON CONFLICT (name) DO NOTHING;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.honeypots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

-- 5. Create Core Sync Trigger Function for auth.users Integration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_org_id UUID;
  profile_name TEXT;
  profile_role TEXT;
BEGIN
  -- Determine default organization based on role metadata or default
  profile_role := COALESCE(new.raw_user_meta_data ->> 'role', 'CUSTOMER');
  
  IF profile_role = 'CUSTOMER' OR profile_role = 'SAVINGS_ACCOUNT' THEN
    SELECT id INTO default_org_id FROM public.organizations WHERE name = 'IDBI Customers' LIMIT 1;
  ELSE
    SELECT id INTO default_org_id FROM public.organizations WHERE name = 'IDBI Bank Staff' LIMIT 1;
  END IF;

  -- Map Google Auth metadata or inputs
  profile_name := COALESCE(
    new.raw_user_meta_data ->> 'fullName', 
    new.raw_user_meta_data ->> 'full_name', 
    split_part(new.email, '@', 1)
  );

  INSERT INTO public.profiles (id, org_id, full_name, phone, username, role, face_biometrics)
  VALUES (
    new.id,
    COALESCE((new.raw_user_meta_data ->> 'org_id')::UUID, default_org_id),
    profile_name,
    COALESCE(new.raw_user_meta_data ->> 'phone', ''),
    COALESCE(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    profile_role,
    new.raw_user_meta_data ->> 'face_biometrics'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    username = EXCLUDED.username,
    role = EXCLUDED.role,
    face_biometrics = EXCLUDED.face_biometrics;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind Trigger to Auth.Users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Define Row Level Security Policies
-- Profiles Policies
DROP POLICY IF EXISTS select_own_profile ON public.profiles;
CREATE POLICY select_own_profile ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Organizations Policies
DROP POLICY IF EXISTS tenant_organizations_select_policy ON public.organizations;
CREATE POLICY tenant_organizations_select_policy ON public.organizations FOR SELECT USING (true);
DROP POLICY IF EXISTS tenant_organizations_insert_policy ON public.organizations;
CREATE POLICY tenant_organizations_insert_policy ON public.organizations FOR INSERT WITH CHECK (true);

-- Inner Tables Policies (check user organization membership)
DROP POLICY IF EXISTS tenant_agents_policy ON public.agents;
CREATE POLICY tenant_agents_policy ON public.agents FOR ALL USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS tenant_policies_policy ON public.policies;
CREATE POLICY tenant_policies_policy ON public.policies FOR ALL USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS tenant_integrations_policy ON public.integrations;
CREATE POLICY tenant_integrations_policy ON public.integrations FOR ALL USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS tenant_threats_policy ON public.threats;
CREATE POLICY tenant_threats_policy ON public.threats FOR ALL USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS tenant_honeypots_policy ON public.honeypots;
CREATE POLICY tenant_honeypots_policy ON public.honeypots FOR ALL USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS tenant_approvals_policy ON public.approvals;
CREATE POLICY tenant_approvals_policy ON public.approvals FOR ALL USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS tenant_audit_logs_policy ON public.audit_logs;
CREATE POLICY tenant_audit_logs_policy ON public.audit_logs FOR ALL USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS tenant_api_keys_policy ON public.api_keys;
CREATE POLICY tenant_api_keys_policy ON public.api_keys FOR ALL USING (org_id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

-- 7. Define Supabase Storage Object Policies for Biometrics
-- Allow users to upload their own biometric photo (under matching auth UUID)
DROP POLICY IF EXISTS "Allow public uploads to biometrics" ON storage.objects;
CREATE POLICY "Allow public uploads to biometrics" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'biometrics' AND name LIKE '%' || auth.uid() || '.jpg');

-- Allow users to update their own biometric photo
DROP POLICY IF EXISTS "Allow public updates to biometrics" ON storage.objects;
CREATE POLICY "Allow public updates to biometrics" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'biometrics' AND name LIKE '%' || auth.uid() || '.jpg');

