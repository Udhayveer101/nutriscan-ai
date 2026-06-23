"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    text: "Finally I understand what's actually in my son's juice. NutriScan made me a more informed parent.",
    author: "Priya M.",
    role: "Parent of 2",
    rating: 5,
  },
  {
    text: "As a competitive runner I need to know exactly what I'm putting in my body. This tool is incredible.",
    author: "James T.",
    role: "Marathon Runner",
    rating: 5,
  },
  {
    text: "I use it at the grocery store every single time. I've completely changed what I buy because of this.",
    author: "Sarah K.",
    role: "Health-conscious shopper",
    rating: 5,
  },
  {
    text: "The scientific mode is exactly what I needed as a nutritionist. Evidence sources are top notch.",
    author: "Dr. A. Patel",
    role: "Nutritionist, RD",
    rating: 5,
  },
];

const stats = [
  { value: "2M+", label: "Scans performed" },
  { value: "2,000+", label: "Ingredients catalogued" },
  { value: "98%", label: "User satisfaction" },
  { value: "150+", label: "Research references" },
];

export function SocialProof() {
  return (
    <section className="py-24 bg-gradient-to-br from-navy-900 to-green-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-green-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Trusted by health-conscious consumers
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-200 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div>
                <p className="text-white font-semibold text-sm">{t.author}</p>
                <p className="text-green-300 text-xs">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
