import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  X,
  CreditCard,
  Phone,
  Copy,
  Clock,
  Zap,
  Bot,
  GraduationCap,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SubscriptionService } from '../services/subscriptionService';
import { PlatformSettings } from '../types/subscription';
import { useToast } from './Toast';

interface UpgradeProModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightFeature?: string;
}

export const UpgradeProModal: React.FC<UpgradeProModalProps> = ({
  isOpen,
  onClose,
  highlightFeature,
}) => {
  const { user, profile, isPro, isAdmin, refreshSubscription } = useAuth();
  const toast = useToast();

  const [settings, setSettings] = useState<PlatformSettings>({
    pro_price_som: 5000,
    pro_duration_days: 30,
    free_daily_speaking_limit_minutes: 10,
    payment_card_number: '8600 4904 1234 5678',
    payment_card_holder: 'VOCABAI EDUCATION MCHJ',
    payment_phone: '+998 90 123 45 67',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'click' | 'payme' | 'uzum'>('card');
  const [phoneNumber, setPhoneNumber] = useState('+998 ');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      SubscriptionService.getConfig().then(setSettings);
      setHasSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyCard = () => {
    navigator.clipboard.writeText(settings.payment_card_number.replace(/\s+/g, ''));
    setIsCopied(true);
    toast.success("Karta raqami nusxalandi!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Iltimos, avval tizimga kiring.");
      return;
    }

    if (phoneNumber.trim().length < 9) {
      toast.error("Iltimos, to'liq telefon raqamingizni kiriting.");
      return;
    }

    setIsSubmitting(true);
    try {
      await SubscriptionService.submitPaymentRequest({
        userId: user.id,
        email: user.email || '',
        userName: profile?.name || user.email?.split('@')[0] || 'Foydalanuvchi',
        paymentMethod,
        senderPhone: phoneNumber.trim(),
        transactionRef: transactionRef.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      setHasSubmitted(true);
      toast.success("To'lov arizasi yuborildi! Administrator tez orada tasdiqlaydi.");
    } catch (err: any) {
      toast.error(err.message || "Arizani yuborishda xatolik yuz berdi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Instant demo activation for testing or admin
  const handleInstantDemoActivate = async () => {
    if (!user) return;
    try {
      await SubscriptionService.adminUpdateUser(user.id, {
        plan: 'pro',
        durationDaysToAdd: settings.pro_duration_days || 30,
      });
      await refreshSubscription();
      toast.success("💎 PRO tarifi hisobingizda darhol faollashtirildi!");
      onClose();
    } catch {
      toast.error("Faollashtirishda xatolik yuz berdi.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#090e1a] border border-amber-400/30 p-5 sm:p-7 text-left space-y-6 shadow-2xl shadow-amber-400/10 my-8 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-extrabold text-xs">
            <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
            <span>VOCABAI PRO OBUNASI</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Cheksiz bilim va erkin ingliz tili</span>
            <span className="text-amber-400">💎</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Kunlik 10 daqiqalik cheklovlardan xalos bo'ling. AI bilan 14 ta real hayotiy rolli vaziyatlarda gapiring va Level 0 dan B2 darajagacha o'sing!
          </p>

          {highlightFeature && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Maxsus tanlangan: {highlightFeature}</span>
            </div>
          )}
        </div>

        {/* Price Tag Highlight */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400/15 via-amber-500/10 to-transparent border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-400 font-medium">Hozirgi maxsus narx</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-amber-400">
                {settings.pro_price_som.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-slate-300">
                so'm / {settings.pro_duration_days} kun
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-500/30 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Rasmiy & Xavfsiz</span>
          </div>
        </div>

        {/* Feature Comparison Grid */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Rejalar taqqoslanishi
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Free Card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2.5 opacity-80">
              <div className="font-extrabold text-slate-300 text-sm flex items-center justify-between">
                <span>🌱 Oddiy (FREE)</span>
                <span className="text-slate-500 font-normal">0 so'm</span>
              </div>
              <ul className="space-y-1.5 text-slate-400">
                <li className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Kuniga 10 daqiqa gapirish limiti</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Faqat Level 0 (Boshlang'ich)</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500 line-through">
                  <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>14 ta hayotiy rolli vaziyatlar</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500 line-through">
                  <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Kengaytirilgan talaffuz tahlili</span>
                </li>
              </ul>
            </div>

            {/* Pro Card */}
            <div className="p-4 rounded-2xl bg-amber-400/10 border-2 border-amber-400/40 space-y-2.5 relative shadow-lg shadow-amber-400/10">
              <div className="font-extrabold text-amber-300 text-sm flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 fill-amber-300" />
                  <span>💎 VocabAI PRO</span>
                </span>
                <span className="text-amber-400 font-black">Cheksiz</span>
              </div>
              <ul className="space-y-1.5 text-slate-200">
                <li className="flex items-center gap-2 text-amber-300 font-bold">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Cheksiz AI Speaking (Vaqt chegarasiz!)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Level 0 dan B2 darajagacha to'liq o'sish</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>14 ta real hayotiy rolli suhbat (Roleplay)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Ovozli talaffuz va grammatika tekshiruvi</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Shaxsiy lug'at va suhbatlar to'liq tarixi</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        {hasSubmitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <h4 className="text-base font-black text-white">
              To'lov arizangiz muvaffaqiyatli yuborildi!
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Administrator to'lovni tasdiqlashi bilan hisobingizga avtomatik ravishda {settings.pro_duration_days} kunlik PRO obunasi biriktiriladi.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Yopish
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div className="text-xs font-bold text-slate-300">
              1. To'lov usulini tanlang va mablag'ni o'tkazing:
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-white/10 hover:border-white/20'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Karta</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('click')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'click'
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-white/10 hover:border-white/20'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Click</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('payme')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'payme'
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-white/10 hover:border-white/20'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Payme</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('uzum')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'uzum'
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-white/10 hover:border-white/20'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Uzum</span>
              </button>
            </div>

            {/* Payment Card Box */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {paymentMethod === 'card' ? 'Uzcard / Humo karta raqami:' : `${paymentMethod.toUpperCase()} orqali o'tkazma kartasi:`}
                </div>
                <div className="text-base sm:text-lg font-mono font-black text-amber-300 tracking-wider">
                  {settings.payment_card_number}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  Qabul qiluvchi: {settings.payment_card_holder}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyCard}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/10 shrink-0"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Nusxalandi' : 'Nusxa olish'}</span>
              </button>
            </div>

            {/* Step 2: Confirmation Form */}
            <form onSubmit={handleSubmitRequest} className="space-y-3">
              <div className="text-xs font-bold text-slate-300">
                2. To'lovni tasdiqlash uchun telefon raqamingizni kiriting:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Telefon raqamingiz (Bog'lanish uchun):
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Chek ID / O'tkazuvchi ismi (Ixtiyoriy):
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="Masalan: Jasur R. / Chek #451"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 active:scale-98 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>
                  {isSubmitting ? "Yuborilmoqda..." : `To'lovni tasdiqlash (${settings.pro_price_som.toLocaleString()} so'm)`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Quick Test Mode / Admin Shortcut */}
        {(isAdmin || !isPro) && (
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
            <span>⚡ Tezkor sinov (Demo rejim):</span>
            <button
              onClick={handleInstantDemoActivate}
              className="text-amber-400 hover:text-amber-300 font-bold underline transition-colors"
            >
              Darhol PRO-ni sinab ko'rish (1-Click Activate)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
