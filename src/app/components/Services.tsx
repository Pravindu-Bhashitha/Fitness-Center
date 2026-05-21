export default function Services() {
  const services = [
    {
      icon: '🏋️',
      title: 'Strength Training',
      description: 'Build muscle and increase your strength with our comprehensive weightlifting programs.'
    },
    {
      icon: '🧘',
      title: 'Yoga & Flexibility',
      description: 'Improve flexibility and mental clarity with guided yoga and stretching classes.'
    },
    {
      icon: '❤️',
      title: 'Cardio Programs',
      description: 'Boost your endurance and cardiovascular health with dynamic cardio workouts.'
    },
    {
      icon: '🥋',
      title: 'Martial Arts',
      description: 'Learn self-defense and gain confidence through professional martial arts training.'
    },
    {
      icon: '🏊',
      title: 'Swimming',
      description: 'Full-body workouts in our Olympic-sized swimming pool with certified instructors.'
    },
    {
      icon: '🤸',
      title: 'Personal Training',
      description: 'One-on-one coaching tailored to your specific goals and fitness level.'
    }
  ];

  return (
    <section className="py-20 bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_28%)]" />
      <div className="container relative mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12 animate-slideInUp">
          <p className="inline-flex items-center rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
            Built for every fitness goal
          </p>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-gray-900 dark:text-white">Our Services</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Structured programs, expert guidance, and a motivating environment to keep members coming back.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group bg-white/90 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-8 shadow-lg shadow-gray-200/70 dark:shadow-black/20 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition transform hover:-translate-y-2 hover-scale animate-slideInUp" style={{ animationDelay: `${index * 0.08}s` }}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-3xl mb-5 shadow-lg shadow-amber-500/20 transition group-hover:scale-110">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
