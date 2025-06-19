import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation, isRTL } from '../utils/translations';

const testimonials = [
  {
    id: 1,
    name: 'Phyu Sin Yadanar Thein',
    role: 'Founder & IELTS Instructor',
    image: '/images/photo_2025-05-17_00-18-08.jpg',
    quote: 'LearnPilot transformed my interview preparation. The AI mock interviews gave me confidence and helped me land my dream internship at a top tech company.'
  },
  {
    id: 2,
    name: 'Najib Abdirahman',
    role: 'Student',
    image: '/images/photo_2025-05-17_00-14-42.jpg',
    quote: 'The AI study buddy is like having a personal tutor available 24/7. It helps me create effective flashcards and focus on my weak areas. My grades have improved significantly.'
  },
  {
    id: 3,
    name: 'Ismail Abdirahman',
    role: 'Medical Student',
    image: '/images/photo_2025-05-17_00-14-23.jpg',
    quote: 'The video chat feature with real-time transcription is a game-changer for our study group. We can focus on discussions while LearnPilot captures all the important notes.'
  }
];

const Testimonials = () => {
  const { t, currentLanguage } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className={`py-16 md:py-24 bg-white dark:bg-gray-900 transition-colors duration-300 ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`} id="testimonials">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('testimonials')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Thousands of students and professionals are accelerating their learning with LearnPilot.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Desktop view - all testimonials */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>

          {/* Mobile view - carousel */}
          <div className="md:hidden">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center mb-4">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonials[currentIndex].name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonials[currentIndex].role}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic">"{testimonials[currentIndex].quote}"</p>
            </div>

            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;