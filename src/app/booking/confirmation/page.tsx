import { Suspense } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BookingConfirmationClient from './booking-confirmation-client';

export default function BookingConfirmationPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="container mx-auto px-4 py-16">
          <Suspense fallback={<div className="rounded-2xl bg-white p-8 text-center shadow-lg">Loading confirmation...</div>}>
            <BookingConfirmationClient />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
