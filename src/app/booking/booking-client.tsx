'use client';

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type BookingPayload = {
  type: 'trainer' | 'class';
  trainerOrClass: string;
  specialty: string;
  date: string;
  time: string;
  duration: string;
  fullName: string;
  email: string;
  phone: string;
  goals: string;
  notes: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_BOOKING_API_URL ?? 'http://localhost:4000';

const initialState: BookingPayload = {
  type: 'trainer',
  trainerOrClass: '',
  specialty: '',
  date: '',
  time: '',
  duration: '60',
  fullName: '',
  email: '',
  phone: '',
  goals: '',
  notes: '',
};

export default function BookingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<BookingPayload>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedTrainer = searchParams.get('trainer') ?? '';
  const selectedSpecialty = searchParams.get('specialty') ?? '';
  const bookingType = (searchParams.get('type') ?? 'trainer') as 'trainer' | 'class';
  const selectedClassName = searchParams.get('className') ?? '';

  useEffect(() => {
    setFormData(previous => ({
      ...previous,
      type: bookingType,
      trainerOrClass: selectedTrainer || selectedClassName || previous.trainerOrClass,
      specialty: selectedSpecialty || (bookingType === 'class' ? selectedClassName : previous.specialty),
    }));
  }, [selectedSpecialty, selectedTrainer, bookingType, selectedClassName]);

  const bookingSummary = useMemo(
    () => ({
      type: formData.type,
      trainerOrClass: formData.trainerOrClass || (formData.type === 'trainer' ? 'Select a trainer' : 'Select a class'),
      specialty: formData.specialty || 'Personal Training',
      date: formData.date || 'Choose a date',
      time: formData.time || 'Choose a time',
      duration: formData.duration,
    }),
    [formData],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(previous => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message ?? 'Unable to create booking');
      }

      router.push(`/booking/confirmation?id=${result.booking.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Booking failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">{bookingType === 'trainer' ? 'Trainer' : 'Class'}</span>
            <input
              name="trainerOrClass"
              value={formData.trainerOrClass}
              onChange={handleChange}
              placeholder={bookingType === 'trainer' ? 'Selected trainer from the previous page' : 'Selected class from the previous page'}
              readOnly={Boolean(selectedTrainer || selectedClassName)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 outline-none transition focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 read-only:bg-gray-100 dark:read-only:bg-gray-700 read-only:text-gray-700 dark:read-only:text-gray-300"
              required
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">This is prefilled from the {bookingType === 'trainer' ? 'trainer' : 'class'} card you selected.</p>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Specialty</span>
            <input
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="Selected specialty from the previous page"
              readOnly={Boolean(selectedSpecialty)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 outline-none transition focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 read-only:bg-gray-100 dark:read-only:bg-gray-700 read-only:text-gray-700 dark:read-only:text-gray-300"
              required
            />
            <p className="mt-2 text-xs text-gray-500">This should match the trainer specialty you chose.</p>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Date</span>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="Choose a date"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 outline-none transition focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Time</span>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="Choose a time"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 outline-none transition focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Duration</span>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 outline-none transition focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Full name</span>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 outline-none transition focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 outline-none transition focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Phone</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567 or 5551234567"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 outline-none transition focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              required
            />
          </label>
        </div>

        <label className="mt-6 block">
          <span className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Goals</span>
          <textarea
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            rows={3}
            placeholder="Strength, fat loss, mobility, performance, recovery..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 outline-none transition focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Notes</span>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Any injuries, preferences, or requests for the trainer?"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 outline-none transition focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </label>

        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-3 text-sm text-red-700 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Submitting...' : 'Confirm booking'}
        </button>
      </form>

      <aside className="rounded-2xl bg-gray-900 p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold">Booking summary</h2>
        <div className="mt-6 space-y-4 text-sm text-gray-300">
          <div>
            <p className="text-gray-500">Type</p>
            <p className="text-base font-semibold text-white">{bookingSummary.type}</p>
          </div>
          <div>
            <p className="text-gray-500">Trainer / Class</p>
            <p className="text-base font-semibold text-white">{bookingSummary.trainerOrClass}</p>
          </div>
          <div>
            <p className="text-gray-500">Specialty</p>
            <p className="text-base font-semibold text-white">{bookingSummary.specialty}</p>
          </div>
          <div>
            <p className="text-gray-500">Date</p>
            <p className="text-base font-semibold text-white">{bookingSummary.date}</p>
          </div>
          <div>
            <p className="text-gray-500">Time</p>
            <p className="text-base font-semibold text-white">{bookingSummary.time}</p>
          </div>
          <div>
            <p className="text-gray-500">Duration</p>
            <p className="text-base font-semibold text-white">{bookingSummary.duration} minutes</p>
          </div>
        </div>
      </aside>
    </>
  );
}
