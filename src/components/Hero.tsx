import { ArrowRight } from 'lucide-react';
import { useTranslation, isRTL } from '../utils/translations';
import * as Sentry from '@sentry/react';

interface HeroProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

const triggerTestError = () => {
  throw new Error('Test Sentry MCP Error: This is a simulated error for MCP setup confirmation.');
};

export default function Hero({ onGetStarted, onLearnMore }: HeroProps) {
  const { t, currentLanguage } = useTranslation();

  return (
    <div className={`relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 overflow-hidden pt-16 transition-colors duration-300 ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">{t('learnFasterWith')} </span>
                <span className="block text-blue-600 dark:text-blue-400">{t('aiPowered')}</span>
                <span className="block">{t('education')}</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                {t('heroDescription')}
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button
                    onClick={onGetStarted}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    {t('getStarted')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    onClick={onLearnMore}
                    className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    {t('learnMore')}
                  </button>
                </div>
              </div>

              <div className="mt-12 text-center lg:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('trustedByThousands')}</p>
              </div>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                onClick={triggerTestError}
              >
                Trigger Sentry MCP Test Error
              </button>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="relative h-64 w-full sm:h-72 md:h-96 lg:w-full lg:h-full">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}