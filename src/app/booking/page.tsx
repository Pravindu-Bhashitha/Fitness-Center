import { Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingClient from './booking-client';

export default function BookingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <section className="bg-linear-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 py-12 text-white">
          <div className="container mx-auto px-4">
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-amber-400">Book a session</p>
            <h1 className="text-4xl font-bold">Complete your trainer booking</h1>
            <p className="mt-3 max-w-2xl text-gray-300 dark:text-gray-400">
              Choose your trainer, date, and time, then submit the request to save it into the backend database.
            </p>
          </div>
        </section>

        <section className="container mx-auto grid gap-8 px-4 py-12 lg:grid-cols-[1.25fr_0.75fr]">
          <Suspense fallback={<div className="rounded-2xl bg-white p-8 text-center shadow-lg">Loading booking form...</div>}>
            <BookingClient />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
