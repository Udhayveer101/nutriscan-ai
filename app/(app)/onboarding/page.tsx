"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check, Leaf, Dumbbell, Baby, FlaskConical, ShieldAlert } from "lucide-react";

const ALLERGEN_OPTIONS = [
  { id: "Gluten / Wheat", label: "Gluten / Wheat", emoji: "🌾" },
  { id: "Milk / Dairy", label: "Milk & Dairy", emoji: "🥛" },
  { id: "Eggs", label: "Eggs", emoji: "🥚" },
  { id: "Peanuts", label: "Peanuts", emoji: "🥜" },
  { id: "Tree Nuts", label: "Tree Nuts", emoji: "🌰" },
  { id: "Soy", label: "Soy", emoji: "🫘" },
  { id: "Fish", label: "Fish", emoji: "🐟" },
  { id: "Shellfish", label: "Shellfish", emoji: "🦐" },
  { id: "Sesame", label: "Sesame", emoji: "🌿" },
  { id: "Mustard", label: "Mustard", emoji: "🌱" },
  { id: "Celery", label: "Celery", emoji: "🥬" },
  { id: "Sulphites", label: "Sulphites", emoji: "⚗️" },
  { id: "Lupin", label: "Lupin", emoji: "🌸" },
  { id: "Molluscs", label: "Molluscs", emoji: "🐚" },
];

const AVOID_OPTIONS = [
  { id: "palm oil", label: "Palm Oil", emoji: "🌴" },
  { id: "msg", label: "MSG", emoji: "🧂" },
  { id: "artificial colors", label: "Artificial Colors", emoji: "🎨" },
  { id: "artificial sweeteners", label: "Artificial Sweeteners", emoji: "🍬" },
  { id: "high fructose corn syrup", label: "High Fructose Corn Syrup", emoji: "🌽" },
  { id: "preservatives", label: "Preservatives", emoji: "🧪" },
  { id: "hydrogenated oils", label: "Hydrogenated / Trans Fats", emoji: "🫙" },
  { id: "sodium nitrite", label: "Sodium Nitrite", emoji: "🥩" },
  { id: "sugar", label: "Added Sugar", emoji: "🍭" },
  { id: "sodium", label: "High Sodium / Salt", emoji: "🧂" },
  { id: "caffeine", label: "Caffeine", emoji: "☕" },
  { id: "alcohol", label: "Alcohol", emoji: "🍷" },
];

const MODE_OPTIONS = [
  { id: "BEGINNER", label: "Simple", description: "Plain English, no jargon", icon: Leaf },
  { id: "PARENT", label: "Parent", description: "Family & child safety focus", icon: Baby },
  { id: "ATHLETE", label: "Athlete", description: "Performance & nutrition focus", icon: Dumbbell },
  { id: "SCIENTIFIC", label: "Scientific", description: "Full technical detail", icon: FlaskConical },
];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "1";

  const [step, setStep] = useState(0);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [avoidList, setAvoidList] = useState<string[]>([]);
  const [mode, setMode] = useState("BEGINNER");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!editMode);

  useEffect(() => {
    if (!editMode) return;
    (async () => {
      try {
        const res = await fetch("/api/user/preferences");
        if (res.ok) {
          const data = await res.json();
          setAllergens(data.allergens ?? []);
          setAvoidList(data.avoidList ?? []);
          setMode(data.preferredMode ?? "BEGINNER");
        }
      } finally {
        setLoaded(true);
      }
    })();
  }, [editMode]);

  function toggle(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  async function finish() {
    setSaving(true);
    await fetch("/api/user/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allergens, avoidList, preferredMode: mode }),
    });
    router.push(editMode ? "/dashboard" : "/scan");
  }

  const steps = [
    {
      title: "Do you have any food allergies?",
      subtitle: "We'll highlight these in every scan so you never miss them.",
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ALLERGEN_OPTIONS.map((opt) => {
            const selected = allergens.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggle(allergens, setAllergens, opt.id)}
                className="flex items-center gap-3 p-3 rounded-2xl border-[1.5px] text-left transition-all"
                style={selected
                  ? { borderColor: "var(--brand-600)", background: "rgba(22,163,74,.08)", color: "var(--ink-2)" }
                  : { borderColor: "rgba(20,70,45,.12)", background: "rgba(255,255,255,.6)", color: "var(--muted)" }}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="text-sm font-medium">{opt.label}</span>
                {selected && <Check className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: "var(--brand-600)" }} />}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: "Anything you prefer to avoid?",
      subtitle: "We'll flag these ingredients in your scans even if they're not allergens.",
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AVOID_OPTIONS.map((opt) => {
            const selected = avoidList.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggle(avoidList, setAvoidList, opt.id)}
                className="flex items-center gap-3 p-3 rounded-2xl border-[1.5px] text-left transition-all"
                style={selected
                  ? { borderColor: "var(--brand-600)", background: "rgba(22,163,74,.08)", color: "var(--ink-2)" }
                  : { borderColor: "rgba(20,70,45,.12)", background: "rgba(255,255,255,.6)", color: "var(--muted)" }}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="text-sm font-medium">{opt.label}</span>
                {selected && <Check className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: "var(--brand-600)" }} />}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: "How do you like your explanations?",
      subtitle: "You can change this anytime from your dashboard.",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const selected = mode === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setMode(opt.id)}
                className="flex items-center gap-4 p-5 rounded-2xl border-[1.5px] text-left transition-all"
                style={selected
                  ? { borderColor: "var(--brand-600)", background: "rgba(22,163,74,.08)" }
                  : { borderColor: "rgba(20,70,45,.12)", background: "rgba(255,255,255,.6)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={selected ? { background: "var(--brand-600)", color: "#fff" } : { background: "rgba(20,70,45,.08)", color: "var(--muted-2)" }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-heading font-bold text-sm" style={{ color: "var(--ink-2)" }}>{opt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-2)" }}>{opt.description}</p>
                </div>
                {selected && <Check className="w-5 h-5 ml-auto flex-shrink-0" style={{ color: "var(--brand-600)" }} />}
              </button>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-28"
      style={{ background: "radial-gradient(120% 50% at 50% -10%, #e9f5ec 0%, #f6f5f1 45%, #f6f5f1 100%)" }}
    >
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white mb-4"
            style={{ background: "linear-gradient(160deg,#1a7a3e,#0f5228)", boxShadow: "0 10px 24px -8px rgba(15,82,40,.5)" }}
          >
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold" style={{ color: "var(--ink)" }}>
            {editMode ? "Update your preferences" : "Personalise NutriScan"}
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--muted-2)" }}>
            {editMode ? "Change your allergies, avoid-list, or explanation mode anytime." : "Takes 30 seconds · You can change these anytime"}
          </p>
        </div>

        {!loaded ? (
          <div className="glass rounded-3xl p-8 text-center text-sm" style={{ color: "var(--muted-2)" }}>Loading your preferences…</div>
        ) : (
          <>
            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? 32 : 8,
                    background: i === step ? "var(--brand-600)" : i < step ? "var(--brand-400)" : "rgba(20,70,45,.15)",
                  }}
                />
              ))}
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="glass rounded-3xl p-8"
              >
                <h2 className="font-heading text-xl font-bold mb-1" style={{ color: "var(--ink)" }}>{steps[step].title}</h2>
                <p className="text-sm mb-6" style={{ color: "var(--muted-2)" }}>{steps[step].subtitle}</p>
                {steps[step].content}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => (step === 0 ? router.push(editMode ? "/dashboard" : "/scan") : setStep(step - 1))}
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--muted-3)" }}
              >
                {step === 0 ? (editMode ? "Cancel" : "Skip for now") : "Back"}
              </button>

              {step < steps.length - 1 ? (
                <button onClick={() => setStep(step + 1)} className="btn-primary py-3 px-6 text-sm">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={finish} disabled={saving} className="btn-primary py-3 px-6 text-sm disabled:opacity-60">
                  {saving ? "Saving..." : editMode ? "Save changes" : "Finish setup"} <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingContent />
    </Suspense>
  );
}
