'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to database via API
    fetch('http://localhost:4000/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Message saved:', data);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }, 3000);
    })
    .catch(error => console.error('Error saving message:', error));
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-linear-to-r from-gray-900 to-gray-800 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-gray-300">Get in touch with FitZone. We'd love to hear from you!</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-900">Get In Touch</h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="text-3xl">📍</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Location</h3>
                    <p className="text-gray-600 dark:text-gray-400">123 Fitness Street<br />Wellness City, WC 12345</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-3xl">📞</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-400">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-3xl">📧</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">hello@fitzone.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-3xl">⏰</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Hours</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Mon - Fri: 6:00 AM - 10:00 PM<br />
                      Sat - Sun: 8:00 AM - 8:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Follow Us</h3>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center hover:bg-amber-600 transition">📘</a>
                  <a href="#" className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center hover:bg-amber-600 transition">📷</a>
                  <a href="#" className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center hover:bg-amber-600 transition">🎬</a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md transition-colors">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Send us a Message</h2>
              
              {submitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  Thank you! Your message has been received. We'll get back to you soon!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
