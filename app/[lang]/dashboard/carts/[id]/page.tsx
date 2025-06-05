import { getCartById } from '@/app/lib/cart/getCartsForAdmin';
import { getDictionary } from '@/get-dictionary';
import Image from 'next/image';
import Link from 'next/link';

export default async function CartDetailsPage({
  params
}: {
  params: { lang: string; id: string }
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  const id = resolvedParams.id;
  // const dict = await getDictionary(lang);
  const cart = await getCartById(id);

  // console.log('🚀 ~ page.tsx ~ cart:', cart);


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          { lang === 'en' ? 'Cart Details' : 'تفاصيل السلة' }
        </h1>
        <Link
          href={ `/${lang}/dashboard/carts` }
          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md text-sm"
        >
          { lang === 'en' ? 'Back to Carts' : 'العودة إلى السلات' }
        </Link>
      </div>

      <div className="bg-white dark:bg-card rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">
          { lang === 'en' ? 'User Information' : 'معلومات المستخدم' }
        </h2>
        { cart.user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                { lang === 'en' ? 'Name' : 'الاسم' }
              </p>
              <p className="font-medium">{ cart.user.name }</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                { lang === 'en' ? 'Email' : 'البريد الإلكتروني' }
              </p>
              <p className="font-medium">{ cart.user.email }</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            { lang === 'en' ? 'User information not available' : 'معلومات المستخدم غير متوفرة' }
          </p>
        ) }
      </div>

      <div className="bg-white dark:bg-card rounded-lg shadow overflow-hidden mb-6">
        <h2 className="text-lg font-medium p-6 border-b border-gray-200 dark:border-gray-700">
          { lang === 'en' ? 'Cart Items' : 'عناصر السلة' }
        </h2>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          { cart.items.map((item, index) => (
            <div key={ index } className="p-6 flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                { item.product.imageCover && (
                  <div className="relative w-20 h-20">
                    <Image
                      src={ item.product.imageCover }
                      alt={ lang === 'en' ? item.product.name : item.product.nameAr }
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                ) }
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">
                  { lang === 'en' ? item.product.name : item.product.nameAr }
                </h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <p>{ lang === 'en' ? 'Quantity' : 'الكمية' }: { item.quantity }</p>
                  <p>{ lang === 'en' ? 'Price' : 'السعر' }: ${ item.price.toFixed(2) }</p>
                  <p>{ lang === 'en' ? 'Subtotal' : 'المجموع الفرعي' }: ${ (item.price * item.quantity).toFixed(2) }</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <Link
                  href={ `/${lang}/products/${item.product._id}` }
                  className="text-primary hover:text-primary-10 text-sm font-medium"
                >
                  { lang === 'en' ? 'View Product' : 'عرض المنتج' }
                </Link>
              </div>
            </div>
          )) }
        </div>
      </div>

      <div className="bg-white dark:bg-card rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">
          { lang === 'en' ? 'Cart Summary' : 'ملخص السلة' }
        </h2>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-between items-center">
            <p className="font-medium">
              { lang === 'en' ? 'Total Items' : 'إجمالي العناصر' }
            </p>
            <p>{ cart.items.reduce((sum, item) => sum + item.quantity, 0) }</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="font-medium">
              { lang === 'en' ? 'Total Price' : 'السعر الإجمالي' }
            </p>
            <p className="text-xl font-bold">${ cart.totalPrice.toFixed(2) }</p>
          </div>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <p>{ lang === 'en' ? 'Created At' : 'تاريخ الإنشاء' }</p>
            <p>{ new Date(cart.createdAt).toLocaleString() }</p>
          </div>
        </div>
      </div>
    </div>
  );
}