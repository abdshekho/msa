import React from 'react';
import Link from 'next/link';

export default function CallToAction({ lang }: { lang: string }) {
  const isArabic = lang === 'ar';

  return (
    <div className="relative overflow-hidden my-30">
      {/* Gradient Background */ }
      {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-yellow-500 to-amber-600"></div> */ }
      {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-yellow-600 to-amber-600"></div> */ }
      {/* <div className="absolute inset-0 bg-gradient-to-br from-cyan-800 via-green-500 to-cyan-600"></div> */ }
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950 via-sky-900 to-cyan-600"></div>

      {/* Animated Sun Rays */ }
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-white rounded-full blur-lg animate-pulse" style={ { animationDelay: '1s' } }></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full blur-md animate-pulse" style={ { animationDelay: '2s' } }></div>
      </div>

      {/* Floating Solar Panel Icon */ }
      <div className="absolute top-8 left-8 opacity-40 transform rotate-12">
        <svg width="80" height="60" viewBox="0 0 80 60" fill="currentColor" className="text-white animate-bounce">
          <rect x="10" y="15" width="60" height="30" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="25" y1="15" x2="25" y2="45" stroke="currentColor" strokeWidth="1" />
          <line x1="40" y1="15" x2="40" y2="45" stroke="currentColor" strokeWidth="1" />
          <line x1="55" y1="15" x2="55" y2="45" stroke="currentColor" strokeWidth="1" />
          <line x1="10" y1="25" x2="70" y2="25" stroke="currentColor" strokeWidth="1" />
          <line x1="10" y1="35" x2="70" y2="35" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

        <div className="custom-shape-divider-top-1749812276">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
          </svg>
        </div>
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */ }
          <div className="text-center mb-12">
            {/* Badge */ }
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white font-medium text-sm">
                { isArabic ? 'حلول طاقة ذكية' : 'Smart Energy Solutions' }
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              { isArabic
                ? ' ☀️ اكتشف قوة الشمس معنا '
                : ' ☀️ Harness the Power of the Sun' }
            </h2>

            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              { isArabic
                ? 'احسب نظامك الشمسي المثالي في دقائق! أدخل أجهزتك واحصل على توصيات مخصصة للألواح والبطاريات والمحوّلات'
                : 'Calculate your perfect solar system in minutes! Enter your devices and get personalized recommendations for panels, batteries, and inverters' }
            </p>
          </div>

          {/* Interactive Cards */ }
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Calculator Card */ }
            <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 9h6v6H9z" />
                    <path d="M9 3v18" />
                    <path d="M3 9h18" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg">
                  { isArabic ? 'حاسبة الطاقة الذكية' : 'Smart Energy Calculator' }
                </h3>
              </div>
              <p className="text-white/80 text-sm">
                { isArabic
                  ? 'احسب احتياجاتك بدقة واحصل على نظام مثالي'
                  : 'Calculate your needs precisely and get the perfect system' }
              </p>
            </div>

            {/* Consultation Card */ }
            <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg">
                  { isArabic ? 'استشارة مجانية' : 'Free Consultation' }
                </h3>
              </div>
              <p className="text-white/80 text-sm">
                { isArabic
                  ? 'تحدث مع خبرائنا واحصل على نصائح مخصصة'
                  : 'Talk to our experts and get personalized advice' }
              </p>
            </div>
          </div>

          {/* Action Buttons */ }
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={ `/${lang}/solar-calculator` }
              className="group relative px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center gap-2">
                { isArabic ? 'احسب نظامك الآن' : 'Calculate Now' }
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                  <path d={ isArabic ? "M19 12H5M12 19l-7-7 7-7" : "M5 12h14M12 5l7 7-7 7" } />
                </svg>
              </span>
            </Link>

            <Link
              href={ `/${lang}/contact` }
              className="group px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                { isArabic ? 'تواصل معنا' : 'Contact Us' }
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-12 transition-transform">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Trust Indicators */ }
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-80">
            <div className="flex items-center gap-2 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                <path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                <path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
              </svg>
              <span className="text-sm font-medium">
                { isArabic ? '100% دقة في الحسابات' : '100% Accurate Calculations' }
              </span>
            </div>

            <div className="flex items-center gap-2 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="text-sm font-medium">
                { isArabic ? 'نتائج فورية' : 'Instant Results' }
              </span>
            </div>

            <div className="flex items-center gap-2 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-sm font-medium">
                { isArabic ? 'موثوق ومضمون' : 'Trusted & Guaranteed' }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}