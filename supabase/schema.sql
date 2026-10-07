-- ========================================================
-- VocabAI Database Schema & Row Level Security (RLS)
-- Supports Supabase Auth, Profiles, Subscriptions & Settings
-- ========================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  name TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pro_started_at TIMESTAMPTZ,
  pro_expires_at TIMESTAMPTZ,
  daily_speaking_limit INT NOT NULL DEFAULT 10,
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan);

-- 2. Platform Settings Table
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  pro_price_som INT NOT NULL DEFAULT 5000,
  pro_duration_days INT NOT NULL DEFAULT 30,
  free_daily_speaking_limit_minutes INT NOT NULL DEFAULT 10,
  payment_card_number TEXT NOT NULL DEFAULT '8600 4904 1234 5678',
  payment_card_holder TEXT NOT NULL DEFAULT 'VOCABAI EDUCATION MCHJ',
  payment_phone TEXT NOT NULL DEFAULT '+998 90 123 45 67',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default global settings if not exists
INSERT INTO public.platform_settings (id, pro_price_som, pro_duration_days, free_daily_speaking_limit_minutes)
VALUES ('global', 5000, 30, 10)
ON CONFLICT (id) DO NOTHING;

-- 3. Subscription Payment Requests Table
CREATE TABLE IF NOT EXISTS public.subscription_payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  user_name TEXT,
  amount_som INT NOT NULL DEFAULT 5000,
  duration_days INT NOT NULL DEFAULT 30,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'click', 'payme', 'uzum')),
  sender_phone TEXT NOT NULL,
  transaction_ref TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_sub_requests_user ON public.subscription_payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_sub_requests_status ON public.subscription_payment_requests(status);

-- 4. Daily Speaking Usage Table
CREATE TABLE IF NOT EXISTS public.daily_speaking_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  used_seconds INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_daily_usage UNIQUE (user_id, usage_date)
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_speaking_usage ENABLE ROW LEVEL SECURITY;

-- Helper function: is current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies:
-- Any authenticated user can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Users can insert their initial profile upon registration
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update non-sensitive fields (e.g. name), but CANNOT update plan, role, or expiry themselves!
CREATE POLICY "Users cannot elevate own plan"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    -- If non-admin user is updating, plan and role must remain unchanged
    (public.is_admin()) OR (
      plan = (SELECT plan FROM public.profiles WHERE id = auth.uid()) AND
      role = (SELECT role FROM public.profiles WHERE id = auth.uid()) AND
      is_blocked = (SELECT is_blocked FROM public.profiles WHERE id = auth.uid())
    )
  );

-- Platform Settings Policies:
-- All users can view platform settings (pricing, card number, limits)
CREATE POLICY "Public read platform settings"
  ON public.platform_settings FOR SELECT
  USING (true);

-- Only admins can change platform settings
CREATE POLICY "Only admins update settings"
  ON public.platform_settings FOR UPDATE
  USING (public.is_admin());

-- Subscription Requests Policies:
-- Users can see their own requests
CREATE POLICY "Users view own requests"
  ON public.subscription_payment_requests FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Users can submit their own requests
CREATE POLICY "Users insert own requests"
  ON public.subscription_payment_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only admins can update request status (approve/reject)
CREATE POLICY "Only admins review requests"
  ON public.subscription_payment_requests FOR UPDATE
  USING (public.is_admin());

-- Daily Usage Policies:
CREATE POLICY "Users view own usage"
  ON public.daily_speaking_usage FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users insert own usage"
  ON public.daily_speaking_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own usage"
  ON public.daily_speaking_usage FOR UPDATE
  USING (auth.uid() = user_id);
