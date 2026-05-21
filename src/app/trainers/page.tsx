import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Trainers - FitZone',
  description: 'Meet our expert fitness trainers',
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_BOOKING_API_URL ?? 'http://localhost:4000';

export default async function Trainers() {
  let trainers: any[] = [];
  console.log('Fetching trainers from API...',trainers);

  try {
    const res = await fetch(`${API_BASE_URL}/api/trainers`);
    console.log('Fetched trainers response:', res);
    if (res.ok) {
      const payload = await res.json();
      trainers = Array.isArray(payload) ? payload : payload?.trainers ?? payload?.data ?? [];
    }
  } catch (err) {
    // ignore — trainers will be empty
    console.error('Failed to fetch trainers:', err);
  }

  const getBookingUrl = (trainer: any) => {
    const params = new URLSearchParams({
      trainer: trainer.name || '',
      specialty: trainer.specialty || '',
    });

    return `/booking?${params.toString()}`;
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="bg-linear-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-950 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4 animate-slideInDown">Our Expert Trainers</h1>
            <p className="text-gray-300 animate-slideInUp delay-100">Meet the dedicated professionals who will help you achieve your fitness goals.</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.length === 0 && (
              <div className="col-span-full text-center text-gray-600 dark:text-gray-300">No trainers found.</div>
            )}

            {trainers.map((trainer, index) => (
              <div key={trainer.id ?? index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition hover-scale animate-slideInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="bg-linear-to-r from-amber-500 to-amber-600 h-40 flex items-center justify-center text-6xl transform hover:scale-110 transition-transform duration-300">
                  {trainer.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    trainer.avatar
                  ) : (
                    '🏋️'
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{trainer.name}</h3>
                  <p className="text-amber-600 dark:text-amber-400 font-semibold mb-3">{trainer.specialty}</p>
                  
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p><span className="font-semibold">Experience:</span> {trainer.experience}</p>
                    <p><span className="font-semibold">Certifications:</span> {trainer.certifications}</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-3 italic">{trainer.bio}</p>
                  </div>
                  
                  <Link
                    href={getBookingUrl(trainer)}
                    className="inline-flex w-full items-center justify-center rounded bg-amber-500 hover:bg-amber-600 py-2 font-semibold text-white transition transform hover:scale-105 active:scale-95"
                  >
                    Book Session
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
