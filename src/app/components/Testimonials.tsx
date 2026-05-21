export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Member since 2023',
      text: 'FitZone completely transformed my fitness journey. The trainers are incredibly supportive and the facilities are top-notch!',
      avatar: '👩‍🦰'
    },
    {
      name: 'Mike Chen',
      role: 'Member since 2022',
      text: 'Best investment I\'ve made in my health. The variety of classes keeps me motivated and the community is amazing.',
      avatar: '👨‍💼'
    },
    {
      name: 'Emma Davis',
      role: 'Member since 2024',
      text: 'I was nervous starting out, but the trainers made me feel comfortable. I\'ve already seen great results in just 3 months!',
      avatar: '👩‍🎓'
    }
  ];

  return (
    <section className="relative py-20 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_28%),linear-gradient(135deg,#111827_0%,#0f172a_55%,#030712_100%)]" />
      <div className="absolute inset-0 opacity-25 bg-[linear-gradient(115deg,transparent_25%,rgba(255,255,255,0.08)_45%,transparent_65%)] animate-shimmer" />
      <div className="container relative mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12 animate-slideInUp">
          <p className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur-md border border-white/10">
            Trusted by real members
          </p>
          <h2 className="text-4xl md:text-5xl font-black mt-4">What Our Members Say</h2>
          <p className="mt-4 text-gray-300">
            Real feedback from people who train with us every week.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-md shadow-2xl shadow-black/20 hover-scale hover-shadow animate-slideInUp" style={{ animationDelay: `${index * 0.12}s` }}>
              <div className="flex items-center mb-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-4xl mr-3 shadow-lg shadow-black/10">
                  {testimonial.avatar}
                </span>
                <div>
                  <h4 className="font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-amber-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-200 italic leading-relaxed">"{testimonial.text}"</p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400">⭐</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
