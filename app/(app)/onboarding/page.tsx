"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ChevronRight, Check, Leaf, Dumbbell, Baby, FlaskConical } from "lucide-react";

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

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [avoidList, setAvoidList] = useState<string[]>([]);
  const [mode, setMode] = useState("BEGINNER");
  const [saving, setSaving] = useState(false);

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
    router.push("/scan");
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
                className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${
                  selected
                    ? "border-orange-400 bg-orange-50 text-orange-900"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="text-sm font-medium">{opt.label}</span>
                {selected && <Check className="w-4 h-4 ml-auto text-orange-500 flex-shrink-0" />}
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
                className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${
                  selected
                    ? "border-red-400 bg-red-50 text-red-900"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="text-sm font-medium">{opt.label}</span>
                {selected && <Check className="w-4 h-4 ml-auto text-red-500 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: "How do you like your explanations?",
      subtitle: "You can change this anytime in settings.",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const selected = mode === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setMode(opt.id)}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                  selected
                    ? "border-green-500 bg-green-50 text-green-900"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selected ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">{opt.label}</p>
                  <p className="text-xs opacity-60">{opt.description}</p>
                </div>
                {selected && <Check className="w-5 h-5 ml-auto text-green-500 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-600 text-white mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Personalise NutriScan</h1>
          <p className="text-gray-500 mt-2 text-sm">Takes 30 seconds · You can change these anytime</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-green-600" : i < step ? "w-2 bg-green-400" : "w-2 bg-gray-200"
              }`}
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
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-1">{steps[step].title}</h2>
            <p className="text-sm text-gray-500 mb-6">{steps[step].subtitle}</p>
            {steps[step].content}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => step === 0 ? router.push("/scan") : setStep(step - 1)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            {step === 0 ? "Skip for now" : "Back"}
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition-colors"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={finish}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : "Finish setup"} <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
