'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

type Booking = {
  id: string;
  trainer: string;
  specialty: string;
  date: string;
  time: string;
  duration: string;
  fullName: string;
  email: string;
  phone: string;
  goals: string;
  notes: string;
  createdAt: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_BOOKING_API_URL ?? 'http://localhost:4000';

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        setError('Missing booking id');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message ?? 'Unable to load booking');
        }

        setBooking(result.booking);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load booking');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="container mx-auto px-4 py-16">
          {loading ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-lg">Loading confirmation...</div>
          ) : error ? (
            <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg">
              <h1 className="text-3xl font-bold text-gray-900">Booking not found</h1>
              <p className="mt-3 text-gray-600">{error}</p>
              <Link
                href="/booking"
                className="mt-6 inline-flex rounded-lg bg-amber-500 px-6 py-3 font-semibold text-gray-900"
              >
                Back to booking
              </Link>
            </div>
          ) : booking ? (
            <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-xl">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-4xl text-white">
                  ✓
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Booking confirmed</h1>
                <p className="mt-2 text-gray-600">Your trainer session has been saved in the database.</p>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-6">
                  <h2 className="text-xl font-bold text-gray-900">Session details</h2>
                  <dl className="mt-4 space-y-3 text-sm text-gray-700">
                    <div>
                      <dt className="text-gray-500">Booking ID</dt>
                      <dd className="font-semibold">{booking.id}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Trainer</dt>
                      <dd className="font-semibold">{booking.trainer}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Specialty</dt>
                      <dd className="font-semibold">{booking.specialty}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Date</dt>
                      <dd className="font-semibold">{booking.date}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Time</dt>
                      <dd className="font-semibold">{booking.time}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Duration</dt>
                      <dd className="font-semibold">{booking.duration} minutes</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-xl bg-gray-900 p-6 text-white">
                  <h2 className="text-xl font-bold">Client details</h2>
                  <dl className="mt-4 space-y-3 text-sm text-gray-300">
                    <div>
                      <dt className="text-gray-400">Name</dt>
                      <dd className="font-semibold text-white">{booking.fullName}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Email</dt>
                      <dd className="font-semibold text-white">{booking.email}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Phone</dt>
                      <dd className="font-semibold text-white">{booking.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Goals</dt>
                      <dd className="font-semibold text-white">{booking.goals || 'Not provided'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-gray-800">
                Notes: {booking.notes || 'No additional notes provided.'}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/booking" className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-gray-900">
                  Book another session
                </Link>
                <Link href="/trainers" className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-900">
                  Back to trainers
                </Link>
              </div>
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </>
  );
}