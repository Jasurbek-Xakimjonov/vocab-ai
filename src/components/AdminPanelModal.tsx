import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  CreditCard,
  Settings,
  Sparkles,
  Check,
  X,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SubscriptionService } from '../services/subscriptionService';
import {
  PlatformSettings,
  UserSubscriptionProfile,
  SubscriptionPaymentRequest,
} from '../types/subscription';
import { useToast } from './Toast';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, refreshSubscription } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'requests' | 'settings'>('stats');
  const [loading, setLoading] = useState(false);

  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [usersList, setUsersList] = useState<UserSubscriptionProfile[]>([]);
  const [requestsList, setRequestsList] = useState<SubscriptionPaymentRequest[]>([]);
  const [settingsForm, setSettingsForm] = useState<PlatformSettings>({
    pro_price_som: 5000,
    pro_duration_days: 30,
    free_daily_speaking_limit_minutes: 10,
    payment_card_number: '8600 4904 1234 5678',
    payment_card_holder: 'VOCABAI EDUCATION MCHJ',
    payment_phone: '+998 90 123 45 67',
  });

  const [searchQuery, setSearchQuery] = useState('');

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [ov, users, requests, config] = await Promise.all([
        SubscriptionService.getAdminOverview(),
        SubscriptionService.getAdminUsers(),
        SubscriptionService.getAdminRequests(),
        SubscriptionService.getConfig(),
      ]);

      setOverview(ov);
      setUsersList(users);
      setRequestsList(requests);
      setSettingsForm(config);
    } catch (e: any) {
      console.warn('Admin load note:', e);
      toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAllAdminData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Actions for users
  const handleTogglePlan = async (u: UserSubscriptionProfile) => {
    try {
      const newPlan = u.plan === 'pro' ? 'free' : 'pro';
      await SubscriptionService.adminUpdateUser(u.user_id, {
        plan: newPlan,
        durationDaysToAdd: newPlan === 'pro' ? 30 : 0,
      });
      toast.success(
        newPlan === 'pro'
          ? `${u.email} foydalanuvchisiga PRO berildi! 💎`
          : `${u.email} PRO tarifi bekor qilindi.`
      );
      await loadAllAdminData();
      if (user && u.user_id === user.id) refreshSubscription();
    } catch {
      toast.error("Tarifni o'zgartirishda xatolik yuz berdi.");
    }
  };

  const handleToggleRole = async (u: UserSubscriptionProfile) => {
    try {
      const newRole = u.role === 'admin' ? 'user' : 'admin';
      await SubscriptionService.adminUpdateUser(u.user_id, {
        role: newRole,
      });
      toast.success(`${u.email} roli ${newRole.toUpperCase()} ga o'zgartirildi.`);
      await loadAllAdminData();
      if (user && u.user_id === user.id) refreshSubscription();
    } catch {
      toast.error("Rolni o'zgartirishda xatolik yuz berdi.");
    }
  };

  const handleToggleBlock = async (u: UserSubscriptionProfile) => {
    try {
      const nextBlocked = !u.is_blocked;
      await SubscriptionService.adminUpdateUser(u.user_id, {
        is_blocked: nextBlocked,
      });
      toast.info(
        nextBlocked
          ? `${u.email} bloklandi!`
          : `${u.email} blokdan chiqarildi.`
      );
      await loadAllAdminData();
    } catch {
      toast.error("Blok holatini o'zgartirishda xatolik yuz berdi.");
    }
  };

  // Actions for requests
  const handleReviewRequest = async (
    reqId: string,
    status: 'approved' | 'rejected'
  ) => {
    try {
      await SubscriptionService.adminReviewRequest(
        reqId,
        status,
        user?.email || 'Admin',
        settingsForm.pro_duration_days || 30
      );
      toast.success(
        status === 'approved'
          ? "Ariza tasdiqlandi va PRO berildi! 💎"
          : "Ariza rad etildi."
      );
      await loadAllAdminData();
      if (user) refreshSubscription();
    } catch {
      toast.error("Arizani ko'rib chiqishda xatolik yuz berdi.");
    }
  };

  // Actions for settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await SubscriptionService.adminUpdateSettings(settingsForm);
      setSettingsForm(updated);
      toast.success("Tizim sozlamalari muvaffaqiyatli saqlandi! ✅");
      await loadAllAdminData();
    } catch {
      toast.error("Sozlamalarni saqlashda xatolik yuz berdi.");
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#090e1a] border border-amber-400/30 p-5 sm:p-7 text-left space-y-6 shadow-2xl shadow-amber-400/10 my-8 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-extrabold text-xs">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>BOSHQARUV PANELI</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              VocabAI Administrator Paneli 🛡️
            </h2>
            <p className="text-xs text-slate-400">
              Foydalanuvchilar, PRO obunalar, to'lovlar va narxlarni boshqarish
            </p>
          </div>

          <button
            onClick={loadAllAdminData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Yangilash</span>
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'stats'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Statistika</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'users'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Foydalanuvchilar ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'requests'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>To'lov arizalari ({requestsList.filter((r) => r.status === 'pending').length} yangi)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Tizim sozlamalari</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW STATS */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <div className="text-[11px] text-slate-400 font-medium">Jami foydalanuvchilar</div>
                <div className="text-2xl font-black text-white">{overview?.totalUsers ?? usersList.length}</div>
                <div className="text-[10px] text-slate-500">Ro'yxatdan o'tganlar</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 space-y-1">
                <div className="text-[11px] text-amber-300 font-medium">Faol PRO obunachilar</div>
                <div className="text-2xl font-black text-amber-400">{overview?.proUsers ?? 0}</div>
                <div className="text-[10px] text-amber-300/60">Cheksiz Speaking</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <div className="text-[11px] text-slate-400 font-medium">Kutilayotgan arizalar</div>
                <div className="text-2xl font-black text-orange-400">{overview?.pendingRequests ?? 0}</div>
                <div className="text-[10px] text-orange-300/60">Ko'rib chiqilishi kerak</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <div className="text-[11px] text-emerald-300 font-medium">Jami tushum (taxminiy)</div>
                <div className="text-2xl font-black text-emerald-400">
                  {((overview?.totalRevenueSom ?? 0)).toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-300/60">so'm</div>
              </div>
            </div>

            {/* Quick Pricing Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-white">PRO obuna tarifi parametrlari:</div>
                <div className="text-xs text-slate-400">
                  Narxi: <strong className="text-amber-300">{settingsForm.pro_price_som.toLocaleString()} so'm</strong> • 
                  Muddati: <strong className="text-amber-300">{settingsForm.pro_duration_days} kun</strong> • 
                  Bepul kunlik limit: <strong className="text-amber-300">{settingsForm.free_daily_speaking_limit_minutes} daqiqa</strong>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('settings')}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
              >
                Narxni o'zgartirish
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: USERS LIST */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Foydalanuvchini email yoki ism bo'yicha qidirish..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold border-b border-white/10">
                  <tr>
                    <th className="p-3">Foydalanuvchi</th>
                    <th className="p-3">Tarif (Plan)</th>
                    <th className="p-3">Rol</th>
                    <th className="p-3">PRO muddati</th>
                    <th className="p-3">Holat</th>
                    <th className="p-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => {
                    const isUPro = u.plan === 'pro';
                    return (
                      <tr key={u.user_id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white">{u.display_name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              isUPro
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isUPro ? '💎 PRO' : '🌱 FREE'}
                          </span>
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              u.role === 'admin'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>

                        <td className="p-3 text-[11px] text-slate-400">
                          {u.pro_expires_at
                            ? new Date(u.pro_expires_at).toLocaleDateString()
                            : 'Mavjud emas'}
                        </td>

                        <td className="p-3">
                          {u.is_blocked ? (
                            <span className="text-rose-400 font-bold text-[11px]">Bloklangan</span>
                          ) : (
                            <span className="text-emerald-400 font-bold text-[11px]">Faol</span>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleTogglePlan(u)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                                isUPro
                                  ? 'bg-slate-800 text-rose-300 hover:bg-rose-500/20'
                                  : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                              }`}
                            >
                              {isUPro ? 'PRO bekor qilish' : '+30 kun PRO'}
                            </button>

                            <button
                              onClick={() => handleToggleRole(u)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                              title="Rolni o'zgartirish"
                            >
                              {u.role === 'admin' ? 'User' : 'Admin'}
                            </button>

                            <button
                              onClick={() => handleToggleBlock(u)}
                              className={`px-2 py-1 rounded-lg text-[11px] ${
                                u.is_blocked
                                  ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                              }`}
                            >
                              {u.is_blocked ? 'Ochish' : 'Blok'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {requestsList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs rounded-2xl bg-slate-900/50">
                To'lov arizalari hozircha mavjud emas.
              </div>
            ) : (
              <div className="space-y-2.5">
                {requestsList.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{req.user_name}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{req.email}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            req.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : req.status === 'rejected'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-400/20 text-amber-300'
                          }`}
                        >
                          {req.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-slate-300 flex flex-wrap items-center gap-3 text-[11px]">
                        <span>📞 {req.sender_phone}</span>
                        <span>💳 {req.payment_method.toUpperCase()}</span>
                        <span>💰 {req.amount_som.toLocaleString()} so'm</span>
                        <span>📅 {new Date(req.created_at).toLocaleString()}</span>
                      </div>

                      {req.transaction_ref && (
                        <div className="text-amber-300/90 text-[11px]">
                          Chek / Izoh: {req.transaction_ref}
                        </div>
                      )}
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleReviewRequest(req.id, 'approved')}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Tasdiqlash (+30 kun)</span>
                        </button>

                        <button
                          onClick={() => handleReviewRequest(req.id, 'rejected')}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-300 font-bold text-xs transition-colors"
                        >
                          Rad etish
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SYSTEM SETTINGS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  PRO obuna narxi (so'mda):
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={settingsForm.pro_price_som}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, pro_price_som: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono font-bold focus:outline-none focus:border-amber-400/50"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Standart tavsiya: 5,000 so'm
                </span>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Obuna muddati (kunlarda):
                </label>
                <input
                  type="number"
                  min="1"
                  value={settingsForm.pro_duration_days}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, pro_duration_days: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono font-bold focus:outline-none focus:border-amber-400/50"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Standart tavsiya: 30 kun
                </span>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  FREE foydalanuvchilar uchun kunlik suhbat limiti (daqiqa):
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settingsForm.free_daily_speaking_limit_minutes}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      free_daily_speaking_limit_minutes: Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono font-bold focus:outline-none focus:border-amber-400/50"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Standart: 10 daqiqa / kun
                </span>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  To'lov qabul qiluvchi karta raqami:
                </label>
                <input
                  type="text"
                  value={settingsForm.payment_card_number}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, payment_card_number: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono font-bold focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Karta egasi ismi / Tashkilot:
                </label>
                <input
                  type="text"
                  value={settingsForm.payment_card_holder}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, payment_card_holder: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Aloqa / Qo'llab-quvvatlash telefoni:
                </label>
                <input
                  type="text"
                  value={settingsForm.payment_phone}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, payment_phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors shadow-lg shadow-amber-400/20"
              >
                Sozlamalarni saqlash ✅
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
