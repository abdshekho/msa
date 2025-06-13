import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const resolvedParam = await params;
  return {
    title: resolvedParam.lang === 'en' ? 'Terms & Conditions' : 'الشروط والأحكام',
  };
}
export default async function TermsPage({ params }: { params: { lang: Locale } }) {
  const resolvedParam = await params;
  const lang = resolvedParam.lang as Locale;
  const dictionary = await getDictionary(lang);
  const { terms } = dictionary.page;
  const isRtl = lang === 'ar';

  return (
    <main className="container mx-auto px-4 py-14" dir={ isRtl ? 'rtl' : 'ltr' }>
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-10 pb-20  mb-8 border-b-4 border-primary dark:border-primary-10">
        <h1 className="text-3xl font-bold text-primary dark:text-primary-10 text-center my-10">
          { terms.title }
        </h1>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
          { terms.lastUpdated }: 20/6/2025
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-6 text-gray-900 dark:text-white font-bold">
            { terms.introduction }
          </p>

          <div className="space-y-10">
            <section>
              <h2 className="head-21 my-4">
                { terms.sections.use.title }
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                { terms.sections.use.content }
              </p>
            </section>

            <section>
              <h2 className="head-21 my-4">
                { terms.sections.privacy.title }
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                { terms.sections.privacy.content }
              </p>
            </section>

            <section>
              <h2 className="head-21 my-4">
                { terms.sections.intellectual.title }
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                { terms.sections.intellectual.content }
              </p>
            </section>

            <section>
              <h2 className="head-21 my-4">
                { terms.sections.liability.title }
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                { terms.sections.liability.content }
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}