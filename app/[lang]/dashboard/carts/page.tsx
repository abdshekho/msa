import { getCartsStats } from '@/app/lib/cart/getCartsStats';
import { getCartsForAdmin } from '@/app/lib/cart/getCartsForAdmin';
import { getDictionary } from '@/get-dictionary';
import Link from 'next/link';
import Image from 'next/image';

export default async function CartsPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const dict = await getDictionary(lang || 'en');
  const stats = await getCartsStats();
  const carts = await getCartsForAdmin();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{ lang === 'en' ? 'Carts Overview' : 'نظرة عامة على السلات' }</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Carts Card */ }
        <div className="bg-white dark:bg-card p-4 rounded-lg shadow">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm">{ lang === 'en' ? 'Total Carts' : 'إجمالي السلات' }</h2>
          <p className="text-2xl font-bold">{ stats.totalCarts }</p>
        </div>

        {/* Active Carts Card */ }
        <div className="bg-white dark:bg-card p-4 rounded-lg shadow">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm">{ lang === 'en' ? 'Active Carts (30 days)' : 'السلات النشطة (30 يوم)' }</h2>
          <p className="text-2xl font-bold">{ stats.activeCarts }</p>
        </div>

        {/* Average Cart Value */ }
        <div className="bg-white dark:bg-card p-4 rounded-lg shadow">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm">{ lang === 'en' ? 'Average Cart Value' : 'متوسط قيمة السلة' }</h2>
          <p className="text-2xl font-bold">${ stats.avgCartValue }</p>
        </div>

        {/* Total Cart Value */ }
        <div className="bg-white dark:bg-card p-4 rounded-lg shadow">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm">{ lang === 'en' ? 'Total Cart Value' : 'إجمالي قيمة السلات' }</h2>
          <p className="text-2xl font-bold">${ stats.totalCartValue }</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">{ lang === 'en' ? 'All Carts' : 'جميع السلات' }</h2>

      <div className="overflow-x-auto" dir='ltr'>
        <table className="min-w-full bg-white dark:bg-card rounded-lg shadow">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">{ lang === 'en' ? 'User' : 'المستخدم' }</th>
              <th className="py-3 px-4 text-left">{ lang === 'en' ? 'Items' : 'العناصر' }</th>
              <th className="py-3 px-4 text-left">{ lang === 'en' ? 'Total' : 'المجموع' }</th>
              <th className="py-3 px-4 text-left">{ lang === 'en' ? 'Date' : 'التاريخ' }</th>
              <th className="py-3 px-4 text-left">{ lang === 'en' ? 'Actions' : 'الإجراءات' }</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            { carts.map((cart) => (
              <tr key={ cart._id } className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="py-3 px-4">
                  { cart.user ? (
                    <div className='flex gap-2'>
                      <Image src={ cart.user.image || "/profile.webp" } alt={ "user" } width={ 40 } height={ 40 } className="rounded-full" />
                      <div>
                        <p className="font-medium">{ cart.user.name }</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{ cart.user.email }</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">{ lang === 'en' ? 'Unknown User' : 'مستخدم غير معروف' }</span>
                  ) }
                </td>
                <td className="py-3 px-4">
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 py-1 px-2 rounded-full text-xs">
                    { cart.items.length } { lang === 'en' ? 'items' : 'عنصر' }
                  </span>
                </td>
                <td className="py-3 px-4 font-medium">${ cart.totalPrice.toFixed(2) }</td>
                <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                  { new Date(cart.createdAt).toLocaleDateString() }
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={ `/${lang}/dashboard/carts/${cart._id}` }
                    className="text-primary hover:text-primary-10 font-medium"
                  >
                    { lang === 'en' ? 'View Details' : 'عرض التفاصيل' }
                  </Link>
                </td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  );
}