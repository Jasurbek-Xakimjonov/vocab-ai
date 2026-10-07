import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

interface PlatformDatabaseState {
  settings: PlatformSettings;
  users: Record<string, UserSubscriptionProfile>;
  payment_requests: SubscriptionPaymentRequest[];
  daily_speaking_usage: Record<string, number>; // key: `${userId}_${YYYY-MM-DD}` -> seconds
}

const DB_FILE_PATH = path.resolve(__dirname, 'data', 'platform_db.json');

const DEFAULT_SETTINGS: PlatformSettings = {
  pro_price_som: 5000,
  pro_duration_days: 30,
  free_daily_speaking_limit_minutes: 10,
  payment_card_number: '8600 4904 1234 5678',
  payment_card_holder: 'VOCABAI EDUCATION MCHJ',
  payment_phone: '+998 90 123 45 67',
};

class PlatformStore {
  private state: PlatformDatabaseState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): PlatformDatabaseState {
    try {
      const dataDir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          users: parsed.users || {},
          payment_requests: parsed.payment_requests || [],
          daily_speaking_usage: parsed.daily_speaking_usage || {},
        };
      }
    } catch (e) {
      console.warn('Failed to load platform_db.json, initializing defaults:', e);
    }

    return {
      settings: { ...DEFAULT_SETTINGS },
      users: {},
      payment_requests: [],
      daily_speaking_usage: {},
    };
  }

  private saveState(): void {
    try {
      const dataDir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write platform_db.json:', e);
    }
  }

  // Get current date string in UTC: YYYY-MM-DD
  private getTodayKey(userId: string): string {
    const today = new Date().toISOString().split('T')[0];
    return `${userId}_${today}`;
  }

  // Settings
  public getSettings(): PlatformSettings {
    return { ...this.state.settings };
  }

  public updateSettings(partial: Partial<PlatformSettings>): PlatformSettings {
    this.state.settings = {
      ...this.state.settings,
      ...partial,
      // Enforce positive numbers
      pro_price_som: Math.max(1000, Number(partial.pro_price_som ?? this.state.settings.pro_price_som)),
      free_daily_speaking_limit_minutes: Math.max(1, Number(partial.free_daily_speaking_limit_minutes ?? this.state.settings.free_daily_speaking_limit_minutes)),
    };
    this.saveState();
    return this.getSettings();
  }

  // User Profile
  public getUser(userId: string): UserSubscriptionProfile | null {
    const user = this.state.users[userId];
    if (!user) return null;

    // Check expiration if PRO
    if (user.plan === 'pro' && user.pro_expires_at) {
      const expires = new Date(user.pro_expires_at).getTime();
      const now = Date.now();
      if (now > expires) {
        user.plan = 'free';
        this.saveState();
      }
    }

    return { ...user };
  }

  public upsertUser(
    userId: string,
    email: string,
    displayName?: string
  ): UserSubscriptionProfile {
    let user = this.getUser(userId);

    if (!user) {
      const isInitialAdmin =
        email.toLowerCase().includes('admin') ||
        Object.keys(this.state.users).length === 0;

      user = {
        user_id: userId,
        email,
        display_name: displayName || email.split('@')[0],
        plan: 'free',
        role: isInitialAdmin ? 'admin' : 'user',
        created_at: new Date().toISOString(),
        pro_started_at: null,
        pro_expires_at: null,
        daily_speaking_limit: this.state.settings.free_daily_speaking_limit_minutes,
        is_blocked: false,
      };
      this.state.users[userId] = user;
      this.saveState();
    } else {
      let changed = false;
      if (displayName && user.display_name !== displayName) {
        user.display_name = displayName;
        changed = true;
      }
      if (email && user.email !== email) {
        user.email = email;
        changed = true;
      }
      if (changed) {
        this.state.users[userId] = user;
        this.saveState();
      }
    }

    return this.getUser(userId)!;
  }

  public updateUser(
    userId: string,
    updates: Partial<UserSubscriptionProfile> & { durationDaysToAdd?: number }
  ): UserSubscriptionProfile | null {
    const user = this.state.users[userId];
    if (!user) return null;

    if (updates.plan !== undefined) {
      user.plan = updates.plan;
      if (updates.plan === 'pro') {
        const now = new Date();
        user.pro_started_at = user.pro_started_at || now.toISOString();

        const days = updates.durationDaysToAdd || this.state.settings.pro_duration_days;
        let baseDate = now;
        if (user.pro_expires_at && new Date(user.pro_expires_at) > now) {
          baseDate = new Date(user.pro_expires_at);
        }
        const newExpiry = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);
        user.pro_expires_at = newExpiry.toISOString();
      } else {
        user.pro_expires_at = null;
      }
    }

    if (updates.role !== undefined) user.role = updates.role;
    if (updates.is_blocked !== undefined) user.is_blocked = updates.is_blocked;
    if (updates.daily_speaking_limit !== undefined) {
      user.daily_speaking_limit = Math.max(1, Number(updates.daily_speaking_limit));
    }
    if (updates.pro_expires_at !== undefined) user.pro_expires_at = updates.pro_expires_at;

    this.state.users[userId] = user;
    this.saveState();
    return this.getUser(userId);
  }

  public getAllUsers(): UserSubscriptionProfile[] {
    const list: UserSubscriptionProfile[] = [];
    for (const id of Object.keys(this.state.users)) {
      const u = this.getUser(id);
      if (u) list.push(u);
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // Payment Requests
  public addPaymentRequest(req: {
    userId: string;
    email: string;
    userName: string;
    paymentMethod: 'card' | 'click' | 'payme' | 'uzum';
    senderPhone: string;
    transactionRef?: string;
    notes?: string;
  }): SubscriptionPaymentRequest {
    const newReq: SubscriptionPaymentRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: req.userId,
      email: req.email,
      user_name: req.userName,
      amount_som: this.state.settings.pro_price_som,
      duration_days: this.state.settings.pro_duration_days,
      payment_method: req.paymentMethod,
      sender_phone: req.senderPhone,
      transaction_ref: req.transactionRef,
      notes: req.notes,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    this.state.payment_requests.unshift(newReq);
    this.saveState();
    return newReq;
  }

  public getPaymentRequests(): SubscriptionPaymentRequest[] {
    return [...this.state.payment_requests];
  }

  public reviewPaymentRequest(
    requestId: string,
    status: 'approved' | 'rejected',
    reviewedBy: string,
    customDays?: number
  ): { success: boolean; request?: SubscriptionPaymentRequest; user?: UserSubscriptionProfile } {
    const req = this.state.payment_requests.find((r) => r.id === requestId);
    if (!req) return { success: false };

    req.status = status;
    req.reviewed_at = new Date().toISOString();
    req.reviewed_by = reviewedBy;

    let updatedUser: UserSubscriptionProfile | null = null;

    if (status === 'approved') {
      const days = customDays || req.duration_days || this.state.settings.pro_duration_days;
      updatedUser = this.updateUser(req.user_id, {
        plan: 'pro',
        durationDaysToAdd: days,
      });
    }

    this.saveState();
    return { success: true, request: req, user: updatedUser || undefined };
  }

  // Speaking Usage Tracking
  public getSpeakingUsage(userId: string): SpeakingUsageStatus {
    const user = this.getUser(userId);
    const isPro = user?.plan === 'pro';
    const limitMinutes = user ? user.daily_speaking_limit : this.state.settings.free_daily_speaking_limit_minutes;

    const usageKey = this.getTodayKey(userId);
    const usedSeconds = this.state.daily_speaking_usage[usageKey] || 0;
    const usedMinutes = Math.floor(usedSeconds / 60);

    const remainingMinutes = isPro ? 9999 : Math.max(0, limitMinutes - usedMinutes);
    const canSpeak = isPro || remainingMinutes > 0;

    return {
      usedSecondsToday: usedSeconds,
      usedMinutesToday: usedMinutes,
      limitMinutes,
      remainingMinutes,
      canSpeak,
      isPro,
      expiresAt: user?.pro_expires_at || null,
    };
  }

  public incrementSpeakingUsage(userId: string, secondsToAdd: number): SpeakingUsageStatus {
    const usageKey = this.getTodayKey(userId);
    const currentSeconds = this.state.daily_speaking_usage[usageKey] || 0;
    this.state.daily_speaking_usage[usageKey] = currentSeconds + Math.max(0, secondsToAdd);
    this.saveState();
    return this.getSpeakingUsage(userId);
  }

  // Admin Dashboard Overview
  public getAdminOverview() {
    const users = this.getAllUsers();
    const proUsers = users.filter((u) => u.plan === 'pro').length;
    const freeUsers = users.length - proUsers;
    const blockedUsers = users.filter((u) => u.is_blocked).length;
    const requests = this.getPaymentRequests();
    const pendingRequests = requests.filter((r) => r.status === 'pending').length;
    const approvedRequests = requests.filter((r) => r.status === 'approved').length;
    const totalRevenueSom = approvedRequests * this.state.settings.pro_price_som;

    return {
      totalUsers: users.length,
      proUsers,
      freeUsers,
      blockedUsers,
      pendingRequests,
      approvedRequests,
      totalRevenueSom,
      settings: this.getSettings(),
    };
  }
}

export const platformStore = new PlatformStore();
