import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-28 md:py-32 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.2),transparent_35%),linear-gradient(135deg,#0f172a_0%,#1f2937_45%,#111827_100%)]" />
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(120deg,transparent_25%,rgba(255,255,255,0.08)_40%,transparent_55%)] animate-shimmer" />
      <div className="relative container mx-auto px-4 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-amber-100 shadow-lg shadow-black/10 backdrop-blur-md animate-slideInDown">
          <span className="text-lg">✨</span>
          Premium fitness, coaching, and wellness in one place
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 animate-slideInDown">
          Transform Your Body,
          <span className="block mt-2 bg-linear-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text text-transparent animate-float">
            Transform Your Life
          </span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto animate-slideInUp delay-200">
          Join FitZone today and experience world-class fitness training with expert coaches, premium classes, and state-of-the-art equipment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideInUp delay-300">
          <Link href="/contact" className="bg-linear-to-r from-amber-400 to-orange-500 text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 hover-shadow active:scale-95 shadow-xl shadow-amber-500/20">
            Start Free Trial
          </Link>
          <Link href="/classes" className="border border-white/30 bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition hover:bg-white/20 hover-shadow active:scale-95 backdrop-blur-md">
            Explore Classes
          </Link>
        </div>
      </div>
    </section>
  );
}
