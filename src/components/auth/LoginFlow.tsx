"use client";

import { useState } from "react";
import { ArrowLeft, BadgeCheck, ShieldCheck } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { PinInput } from "@/components/ui/PinInput";

type Step = "mobile" | "otp" | "pin";

/**
 * Mock Indian mobile-OTP + PIN login (demo only — no real SMS, PIN held in
 * client state). Gate rendered by AuthGate when the session isn't authenticated.
 * Returning users (a PIN already exists) enter their PIN instead of creating one.
 */
export function LoginFlow() {
  const { session, login, language, setLanguage } = useWealth();
  const returning = !!session.pin;

  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState(session.mobile ?? "");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const sendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) return setError(t("auth.invalidMobile", language));
    setError("");
    setStep("otp");
  };

  const verifyOtp = () => {
    if (otp.length !== 6) return;
    setError("");
    setStep("pin");
  };

  const submitPin = () => {
    if (returning) {
      if (pin !== session.pin) return setError(t("auth.pinWrong", language));
      login(mobile, pin);
      return;
    }
    if (pin.length !== 4) return;
    if (pin !== confirm) return setError(t("auth.pinMismatch", language));
    login(mobile, pin);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto scroll-slim bg-background px-6 pb-8 pt-10">
      {/* Brand + language */}
      <div className="mb-8 flex items-center justify-between">
        <img src="/brand/idbi-logo.png" alt="IDBI Bank" width={120} height={30} decoding="async" className="h-7 w-auto object-contain" />
        <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
          {(["en", "hi"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${language === l ? "bg-primary text-primary-foreground" : "text-text-muted"}`}
            >
              {l === "en" ? "EN" : "हिं"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {step === "mobile" && (
          <Step title={t("auth.mobileTitle", language)} subtitle={t("auth.tagline", language)}>
            <label className="mb-1 block text-xs font-medium text-text-muted">{t("auth.mobileLabel", language)}</label>
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 focus-within:border-primary">
              <span className="text-sm font-medium text-text-muted">+91</span>
              <input
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setError("");
                }}
                inputMode="numeric"
                placeholder="98765 43210"
                autoFocus
                className="h-11 flex-1 bg-transparent text-sm tracking-wider text-text-primary outline-none"
              />
            </div>
            <p className="mt-2 text-xs text-text-muted">{t("auth.smsNote", language)}</p>
            {error && <p className="mt-2 text-xs text-error">{error}</p>}
            <Button className="mt-5 w-full" onClick={sendOtp} disabled={mobile.length !== 10}>
              {t("auth.sendOtp", language)}
            </Button>
          </Step>
        )}

        {step === "otp" && (
          <Step title={t("auth.otpTitle", language)} subtitle={`${t("auth.otpSentTo", language)} +91 ${mobile}`}>
            <PinInput value={otp} onChange={setOtp} length={6} autoFocus />
            <p className="mt-3 text-center text-xs text-text-muted">{t("auth.otpDemo", language)}</p>
            <Button className="mt-5 w-full" onClick={verifyOtp} disabled={otp.length !== 6}>
              {t("auth.verify", language)}
            </Button>
            <button onClick={() => { setStep("mobile"); setOtp(""); }} className="mx-auto mt-3 flex items-center gap-1 text-xs text-text-muted hover:text-text-primary">
              <ArrowLeft size={13} /> {t("auth.changeNumber", language)}
            </button>
          </Step>
        )}

        {step === "pin" && (
          <Step
            title={returning ? t("auth.pinEnterTitle", language) : t("auth.pinCreateTitle", language)}
            subtitle={returning ? t("auth.pinEnterHint", language) : t("auth.pinCreateHint", language)}
            banner={
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                <BadgeCheck size={14} /> {t("auth.verified", language)}
              </span>
            }
          >
            <PinInput value={pin} onChange={(v) => { setPin(v); setError(""); }} length={4} mask autoFocus />
            {!returning && (
              <div className="mt-4">
                <p className="mb-2 text-center text-xs text-text-muted">{t("auth.pinConfirm", language)}</p>
                <PinInput value={confirm} onChange={(v) => { setConfirm(v); setError(""); }} length={4} mask />
              </div>
            )}
            {error && <p className="mt-3 text-center text-xs text-error">{error}</p>}
            <Button
              className="mt-5 w-full"
              onClick={submitPin}
              disabled={returning ? pin.length !== 4 : pin.length !== 4 || confirm.length !== 4}
            >
              {t("auth.continue", language)}
            </Button>
          </Step>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-text-muted">
        <ShieldCheck size={13} className="text-primary" /> RBI / KYC-compliant demo login
      </div>
    </div>
  );
}

function Step({
  title,
  subtitle,
  banner,
  children,
}: {
  title: string;
  subtitle: string;
  banner?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      {banner && <div className="mb-4 flex justify-center">{banner}</div>}
      <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
      <p className="mb-6 mt-1 text-sm text-text-muted">{subtitle}</p>
      {children}
    </div>
  );
}
