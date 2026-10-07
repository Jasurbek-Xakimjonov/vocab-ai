import {
  PlatformSettings,
  UserSubscriptionProfile,
  SubscriptionPaymentRequest,
  SpeakingUsageStatus,
} from '../types/subscription';

export const SubscriptionService = {
  // Get public settings & price
  async getConfig(): Promise<PlatformSettings> {
    try {
      const res = await fetch('/api/subscription/config');
      if (res.ok) {
        const data = await res.json();
        return data.settings;
      }
    } catch (e) {
      console.warn('Failed to load subscription config:', e);
    }
    return {
      pro_price_som: 5000,
      pro_duration_days: 30,
      free_daily_speaking_limit_minutes: 10,
      payment_card_number: '8600 4904 1234 5678',
      payment_card_holder: 'VOCABAI EDUCATION MCHJ',
      payment_phone: '+998 90 123 45 67',
    };
  },

  // Authoritative user profile verification
  async fetchProfile(
    userId: string,
    email: string,
    displayName?: string
  ): Promise<{ profile: UserSubscriptionProfile; usage: SpeakingUsageStatus }> {
    try {
      const res = await fetch('/api/subscription/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email, displayName }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          profile: data.profile,
          usage: data.usage,
        };
      }
    } catch (e) {
      console.warn('Subscription fetchProfile fallback:', e);
    }

    // Default fallback
    const fallbackProfile: UserSubscriptionProfile = {
      user_id: userId,
      email,
      display_name: displayName || email.split('@')[0],
      plan: 'free',
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
      created_at: new Date().toISOString(),
      pro_started_at: null,
      pro_expires_at: null,
      daily_speaking_limit: 10,
      is_blocked: false,
    };

    const fallbackUsage: SpeakingUsageStatus = {
      usedSecondsToday: 0,
      usedMinutesToday: 0,
      limitMinutes: 10,
      remainingMinutes: 10,
      canSpeak: true,
      isPro: false,
      expiresAt: null,
    };

    return { profile: fallbackProfile, usage: fallbackUsage };
  },

  // Submit payment request
  async submitPaymentRequest(params: {
    userId: string;
    email: string;
    userName: string;
    paymentMethod: 'card' | 'click' | 'payme' | 'uzum';
    senderPhone: string;
    transactionRef?: string;
    notes?: string;
  }): Promise<{ success: boolean; message: string; request?: SubscriptionPaymentRequest }> {
    const res = await fetch('/api/subscription/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'To\'lov arizasini yuborishda xatolik yuz berdi');
    }
    return data;
  },

  // Get user's payment requests
  async getMyRequests(userId: string): Promise<SubscriptionPaymentRequest[]> {
    try {
      const res = await fetch(`/api/subscription/my-requests?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        return data.requests || [];
      }
    } catch (e) {
      console.warn('Failed to load my requests:', e);
    }
    return [];
  },

  // Get user's speaking usage
  async getSpeakingUsage(userId: string): Promise<SpeakingUsageStatus> {
    try {
      const res = await fetch(`/api/subscription/speaking-usage?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        return data.usage;
      }
    } catch (e) {
      console.warn('Failed to get speaking usage:', e);
    }
    return {
      usedSecondsToday: 0,
      usedMinutesToday: 0,
      limitMinutes: 10,
      remainingMinutes: 10,
      canSpeak: true,
      isPro: false,
      expiresAt: null,
    };
  },

  // Increment usage
  async incrementUsage(userId: string, seconds: number): Promise<SpeakingUsageStatus | null> {
    try {
      const res = await fetch('/api/subscription/speaking-usage/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, seconds }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.usage;
      }
    } catch (e) {
      console.warn('Failed to increment speaking usage:', e);
    }
    return null;
  },

  // Admin: Get overview stats
  async getAdminOverview() {
    const res = await fetch('/api/admin/overview');
    if (!res.ok) throw new Error('Admin statistikani olishda xatolik');
    return res.json();
  },

  // Admin: Get all users
  async getAdminUsers(): Promise<UserSubscriptionProfile[]> {
    const res = await fetch('/api/admin/users');
    if (!res.ok) throw new Error('Foydalanuvchilarni olishda xatolik');
    const data = await res.json();
    return data.users || [];
  },

  // Admin: Update user
  async adminUpdateUser(
    userId: string,
    updates: {
      plan?: 'free' | 'pro';
      role?: 'user' | 'admin';
      is_blocked?: boolean;
      durationDaysToAdd?: number;
      daily_speaking_limit?: number;
      pro_expires_at?: string | null;
    }
  ): Promise<UserSubscriptionProfile> {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Foydalanuvchini yangilashda xatolik');
    return data.user;
  },

  // Admin: Get all requests
  async getAdminRequests(): Promise<SubscriptionPaymentRequest[]> {
    const res = await fetch('/api/admin/requests');
    if (!res.ok) throw new Error('Arizalarni olishda xatolik');
    const data = await res.json();
    return data.requests || [];
  },

  // Admin: Review request
  async adminReviewRequest(
    requestId: string,
    status: 'approved' | 'rejected',
    reviewedBy: string,
    durationDays: number = 30
  ) {
    const res = await fetch(`/api/admin/requests/${encodeURIComponent(requestId)}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reviewedBy, durationDays }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Arizani tasdiqlashda xatolik');
    return data;
  },

  // Admin: Update settings
  async adminUpdateSettings(settings: Partial<PlatformSettings>): Promise<PlatformSettings> {
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Sozlamalarni saqlashda xatolik');
    return data.settings;
  },
};
