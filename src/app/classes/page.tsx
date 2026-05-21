import Header from '../components/Header';
import Link from 'next/link';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Classes - FitZone',
  description: 'Explore our wide variety of fitness classes',
};

export default async function Classes() {
  let classesList: any[] = [];

  try {
    const res = await fetch('http://localhost:4000/api/classes');
    if (res.ok) {
      const payload = await res.json();
      classesList = Array.isArray(payload) ? payload : payload?.classes ?? payload?.data ?? [];
    }
  } catch (err) {
    console.error('Failed to fetch classes:', err);
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="bg-linear-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-950 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4 animate-slideInDown">Our Classes</h1>
            <p className="text-gray-300 animate-slideInUp delay-100">Choose from our diverse range of fitness classes designed for all skill levels.</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classesList.length === 0 && (
              <div className="col-span-full text-center text-gray-600 dark:text-gray-300">No classes found.</div>
            )}

            {classesList.map((cls, index) => (
              <div key={cls.id ?? index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition hover-scale animate-slideInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="bg-amber-500 h-32 flex items-center justify-center text-5xl transform hover:scale-110 transition-transform duration-300">
                  {cls.icon ?? ['🏃', '🧘', '🚴', '💃', '🥊', '🧖'][index]}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{cls.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{cls.description}</p>

                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                    <p><span className="font-semibold">Schedule:</span> {cls.schedule ?? cls.time}</p>
                    <p><span className="font-semibold">Duration:</span> {cls.duration}</p>
                    <p><span className="font-semibold">Capacity:</span> {cls.capacity}</p>
                    <p><span className="font-semibold">Level:</span> <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded">{cls.level}</span></p>
                  </div>

                  <Link href={`/booking?type=class&className=${encodeURIComponent(cls.name)}`} className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded transition text-center transform hover:scale-105 active:scale-95">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
