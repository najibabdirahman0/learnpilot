import { Button } from "../ui/button"
import { PhoneMockUp } from "./PhoneMockUp"
import { useTranslation, isRTL } from '../../utils/translations';

export default function HowItWorks() {
  const { t, currentLanguage } = useTranslation();

  return (
    <section className={`flex flex-col md:flex-row items-center justify-between gap-8 px-4 py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`} id="how-it-works">
      {/* Left side: Phone Mockup */}
      <div className="w-full md:w-1/2 flex justify-center">
        <PhoneMockUp />
      </div>

      {/* Right side: Steps */}
      <div className="w-full md:w-1/2 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Learn on the go with our mobile app
        </h2>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Sign up and set your goals</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Create your profile and tell us what you want to learn. We'll customize your experience.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Practice with AI tools</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Use our AI interview coach or study buddy to master your subjects at your own pace.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Connect with peers</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Join video sessions with other learners to discuss concepts and solve problems together.
              </p>
            </div>
          </div>
        </div>

        <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
          Download the App
        </Button>
      </div>
    </section>
  )
}