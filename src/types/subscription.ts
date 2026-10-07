export type SubscriptionPlan = 'free' | 'pro';
export type UserRole = 'user' | 'admin';

export interface UserSubscriptionProfile {
  user_id: string;
  email: string;
  display_name: string;
  plan: SubscriptionPlan;
  role: UserRole;
  created_at: string;
  pro_started_at: string | null;
  pro_expires_at: string | null;
  daily_speaking_limit: number; // in minutes (default 10)
  is_blocked: boolean;
}

export interface PlatformSettings {
  pro_price_som: number; // default: 5000
  pro_duration_days: number; // default: 30
  free_daily_speaking_limit_minutes: number; // default: 10
  payment_card_number: string; // e.g. "8600 4904 1234 5678"
  payment_card_holder: string; // e.g. "VOCABAI EDUCATION MCHJ"
  payment_phone: string; // e.g. "+998 90 123 45 67"
}

export interface SubscriptionPaymentRequest {
  id: string;
  user_id: string;
  email: string;
  user_name: string;
  amount_som: number;
  duration_days: number;
  payment_method: 'card' | 'click' | 'payme' | 'uzum';
  sender_phone: string;
  transaction_ref?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface SpeakingUsageStatus {
  usedSecondsToday: number;
  usedMinutesToday: number;
  limitMinutes: number;
  remainingMinutes: number;
  canSpeak: boolean;
  isPro: boolean;
  expiresAt: string | null;
}
