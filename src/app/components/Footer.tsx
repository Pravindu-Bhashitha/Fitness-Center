import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-amber-500">💪</span> FitZone
            </h3>
            <p className="text-gray-400">Transform your body, transform your life.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-amber-500 transition">Home</Link></li>
              <li><Link href="/classes" className="hover:text-amber-500 transition">Classes</Link></li>
              <li><Link href="/trainers" className="hover:text-amber-500 transition">Trainers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/membership" className="hover:text-amber-500 transition">Membership</Link></li>
              <li><Link href="/contact" className="hover:text-amber-500 transition">Contact Us</Link></li>
              <li><a href="#" className="hover:text-amber-500 transition">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400 text-sm">
              📍 123 Fitness Street<br />
              📞 (555) 123-4567<br />
              📧 hello@fitzone.com
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; <span id="year"></span> FitZone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
