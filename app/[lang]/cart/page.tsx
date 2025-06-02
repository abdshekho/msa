import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Cart from '@/app/lib/models/Cart';

export default async function CartPage({ params }: { params: { lang: string } }) {
  const resolvedparams = await params;
  const lang = resolvedparams.lang
  const isArabic = lang === 'ar';

  // Get cart data directly from database to avoid circular dependencies
  let cart = { items: [], totalPrice: 0 };

  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.id) {
      await connectToDatabase();

      const userId = session.user.id.toString();
      const userCart = await Cart.findOne({ user: userId }).populate({
        path: 'items.product',
        select: 'name nameAr price imageCover'
      });

      if (userCart) {
        cart = JSON.parse(JSON.stringify(userCart));
      }
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
  }

  const hasItems = cart.items && cart.items.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">
        { isArabic ? 'سلة التسوق' : 'Shopping Cart' }
      </h1>

      { hasItems ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */ }
          <div className="lg:w-2/3">
            { cart.items.map((item: any) => (
              <div key={ item._id } className="flex items-center py-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-shrink-0 w-24 h-24 relative rounded overflow-hidden">
                  { item.product.imageCover && (
                    <Image
                      src={ item.product.imageCover.startsWith('/') ? item.product.imageCover : `/${item.product.imageCover}` }
                      alt={ isArabic ? item.product.nameAr : item.product.name }
                      fill
                      className="object-cover"
                    />
                  ) }
                </div>

                <div className="flex-grow ml-4">
                  <h3 className="text-lg font-medium text-primary dark:text-primary-10">
                    { isArabic ? item.product.nameAr : item.product.name }
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-bold">
                    ${ item.price.toFixed(2) }
                  </p>
                </div>

                <div className="flex items-center">
                  <span className="mx-3 w-8 text-center dark:text-white">
                    { item.quantity }
                  </span>
                </div>

                <div className="ml-6 text-right">
                  <p className="text-lg font-bold dark:text-white">
                    ${ (item.price * item.quantity).toFixed(2) }
                  </p>
                </div>
              </div>
            )) }
          </div>

          {/* Order Summary */ }
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4  text-primary dark:text-primary-10 text-center">
                { isArabic ? 'ملخص الطلب' : 'Order Summary' }
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between dark:text-white">
                  <span className='text-secondary dark:text-secondary-10'>{ isArabic ? 'المجموع الفرعي' : 'Subtotal' }</span>
                  <span>${ cart.totalPrice.toFixed(2) }</span>
                </div>
                <div className="flex justify-between dark:text-white">
                  <span className='text-secondary dark:text-secondary-10'>{ isArabic ? 'الشحن' : 'Shipping' }</span>
                  <span>{ isArabic ? 'حسب العنوان' : 'Based on your address' }</span>
                </div>
                <div className="border-t pt-3 text-md md:text-lg font-bold flex justify-between dark:text-white">
                  <span className='text-secondary dark:text-secondary-10'>{ isArabic ? 'المجموع' : 'Total' }</span>
                  <span className='text-primary dark:text-primary-10'>${ cart.totalPrice.toFixed(2) }</span>
                </div>
              </div>

              <Link
                href={ `/${lang}/checkout` }
                className="block w-full py-3 px-4 bg-primary dark:bg-primary text-white text-center font-medium rounded-md hover:opacity-80 transition-colors"
              >
                { isArabic ? 'إنشاء طلب' : 'Create Order' }
              </Link>

              <Link
                href={ `/${lang}/products` }
                className="block w-full mt-4 py-3 px-4 border border-gray-300 text-center font-medium rounded-md hover:bg-gray-50 transition-colors dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
              >
                { isArabic ? 'مواصلة التسوق' : 'Continue Shopping' }
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-2xl font-medium mb-4 dark:text-white">
            { isArabic ? 'سلة التسوق فارغة' : 'Your cart is empty' }
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            { isArabic
              ? 'لم تقم بإضافة أي منتجات إلى سلة التسوق بعد.'
              : 'You haven\'t added any products to your cart yet.' }
          </p>
          <Link
            href={ `/${lang}/products` }
            className="inline-block py-3 px-8 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            { isArabic ? 'تصفح المنتجات' : 'Browse Products' }
          </Link>
        </div>
      ) }
    </div>
  );
}