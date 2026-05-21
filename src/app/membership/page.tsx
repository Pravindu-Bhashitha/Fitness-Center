import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Membership - FitZone',
  description: 'Choose your FitZone membership plan',
};

export default function Membership() {
  const plans = [
    {
      name: 'Basic',
      price: '$29',
      billedAs: '/month',
      popular: false,
      features: [
        'Gym access (24/7)',
        'Equipment use',
        'Locker room access',
        'Basic fitness assessment',
        'Email support'
      ]
    },
    {
      name: 'Premium',
      price: '$59',
      billedAs: '/month',
      popular: true,
      features: [
        'Everything in Basic',
        'Unlimited group classes',
        'Advanced fitness assessment',
        'Monthly one-on-one consultation',
        'Priority support',
        'Nutrition guide access'
      ]
    },
    {
      name: 'Elite',
      price: '$99',
      billedAs: '/month',
      popular: false,
      features: [
        'Everything in Premium',
        'Unlimited personal training (2x/week)',
        'Custom meal plan',
        'Performance tracking',
        'Guest passes (2x/month)',
        'VIP lounge access',
        '24/7 priority support'
      ]
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Membership Plans</h1>
            <p className="text-gray-300">Choose the perfect plan for your fitness journey.</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`rounded-lg overflow-hidden ${plan.popular ? 'ring-2 ring-amber-500 transform scale-105' : ''}`}>
                <div className={`${plan.popular ? 'bg-amber-500' : 'bg-gray-900'} text-white p-6`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    {plan.popular && <span className="bg-white text-amber-600 px-3 py-1 rounded-full text-xs font-bold">POPULAR</span>}
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm opacity-90">{plan.billedAs}</span>
                  </div>
                </div>
                
                <div className="bg-white p-6">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-700">
                        <span className="text-amber-500 font-bold mr-3">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full py-3 rounded font-bold transition ${plan.popular ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}>
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Common Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Can I pause my membership?</h4>
                <p className="text-gray-600">Yes, you can pause your membership for up to 3 months per year.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Is there a contract?</h4>
                <p className="text-gray-600">No long-term contracts required. Cancel anytime with 30 days notice.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Do you offer a free trial?</h4>
                <p className="text-gray-600">Yes! Get a free 7-day trial to experience FitZone before committing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
