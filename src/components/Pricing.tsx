import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useTranslation, isRTL } from '../utils/translations';

const Pricing = () => {
  const { t, currentLanguage } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(true);

  const pricingData = [
    {
      name: "Free",
      price: 0,
      description: "Basic features for students just getting started.",
      features: [
        "AI Mock Interviews (3/month)",
        "Basic Flashcard Creation",
        "Video Chat (30 min/day)",
        "Email Support",
      ],
      isPopular: false,
    },
    {
      name: "Pro",
      price: isAnnual ? 29 : 14.5,
      description: "Perfect for individual learners and students.",
      features: [
        "Unlimited AI Mock Interviews",
        "Advanced Flashcard System",
        "Unlimited Video Chat",
        "Progress Analytics",
        "Priority Support",
      ],
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: isAnnual ? 38 : 19,
      description: "Best for institutions, teams, or schools.",
      features: [
        "Everything in Pro",
        "Admin dashboard",
        "Team analytics",
        "Priority support",
      ],
      isPopular: false,
    },
  ];

  return (
    <>
      <section className={`py-16 md:py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`} id="pricing">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('pricing')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Choose the plan that fits your learning goals, with no hidden fees.
            </p>

            <div className="inline-flex items-center p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  !isAnnual ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                }`}
                onClick={() => setIsAnnual(false)}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isAnnual ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                }`}
                onClick={() => setIsAnnual(true)}
              >
                Annual <span className="text-blue-600 dark:text-blue-400 text-xs font-medium ml-1">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingData.map((plan, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border transition-all duration-300 ${
                  plan.isPopular ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-100 dark:border-gray-700'
                }`}
              >
                {plan.isPopular && (
                  <div className="bg-blue-600 text-white text-center text-sm font-medium py-1">
                    Most Popular
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{plan.description}</p>

                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    ${plan.price}
                    <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  </div>

                  <ul className="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-2 rounded-md font-medium transition-colors ${
                      plan.isPopular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {plan.name === "Free" ? t('signUp') : t('getStarted')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Need a custom solution?{" "}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                Contact us
              </a>{" "}
              for personalized pricing.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;