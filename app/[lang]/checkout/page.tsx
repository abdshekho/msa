'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCart } from '@/app/lib/cart/actions';
import { createOrder } from '@/app/lib/orders/actions';
import Link from 'next/link';

interface CheckoutFormData {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export default function CheckoutPage({ params }: { params: { lang: string } }) {
  // const lang = params.lang;
  const { lang } = React.use(params);
  const isArabic = lang === 'ar';
  const router = useRouter();

  const [cart, setCart] = useState<any>({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  // Fetch cart data
  useEffect(() => {

    const fetchUserData = async () => {
      try {
        setSubmitting(true)
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const userData = await response.json();
          setFormData({
            name: userData.name,
            address: userData.address,
            phone: userData.phone,
            city: "",
            postalCode: "",
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setSubmitting(false)
      }
    };

    async function loadCart() {
      try {
        setLoading(true);
        const cartData = await getCart();
        setCart(cartData);

        // Redirect to cart if empty
        if (!cartData.items || cartData.items.length === 0) {
          router.push(`/${lang}/cart`);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setError(isArabic ? 'حدث خطأ أثناء تحميل سلة التسوق' : 'Error loading cart');
      } finally {
        setLoading(false);
      }
    }

    loadCart();
    fetchUserData();



  }, [lang, router, isArabic]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Validate form
      const requiredFields = ['name', 'address', 'city', 'phone'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof CheckoutFormData]);

      if (missingFields.length > 0) {
        throw new Error(isArabic
          ? 'يرجى ملء جميع الحقول المطلوبة'
          : 'Please fill in all required fields');
      }

      // Create order
      const result = await createOrder(formData);

      if (result.success) {
        // Redirect to order confirmation
        router.push(`/${lang}/orders/${result.orderId}`);
      } else {
        throw new Error(result.error || (isArabic ? 'حدث خطأ أثناء إنشاء الطلب' : 'Error creating order'));
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setError(error.message || (isArabic ? 'حدث خطأ أثناء إنشاء الطلب' : 'Error creating order'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || submitting) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-10"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary dark:text-primary-10">
        { isArabic ? 'إتمام الطلب' : 'Checkout' }
      </h1>

      <div className="flex flex-col-reverse lg:flex-row gap-8">
        {/* Shipping Form */ }
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              { isArabic ? 'معلومات الشحن' : 'Shipping Information' }
            </h2>

            { error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                { error }
              </div>
            ) }

            <form onSubmit={ handleSubmit }>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 dark:text-white">
                    { isArabic ? 'الاسم الكامل' : 'Full Name' } *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={ formData.name }
                    onChange={ handleChange }
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 dark:text-white">
                    { isArabic ? 'رقم الهاتف' : 'Phone Number' } *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={ formData.phone }
                    onChange={ handleChange }
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    required
                  />
                </div>
              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 dark:text-white">
                    { isArabic ? 'المدينة' : 'City' } *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={ formData.city }
                    onChange={ handleChange }
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 dark:text-white">
                    { isArabic ? 'الرمز البريدي (اختياري)' : 'Postal Code (optional)' }
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={ formData.postalCode }
                    onChange={ handleChange }
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>

                {/* <div>
                  <label className="block mb-1 dark:text-white">
                    { isArabic ? 'البلد' : 'Country' } *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={ formData.country }
                    onChange={ handleChange }
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    required
                  />
                </div> */}
              </div>

              <div className="mb-4">
                <label className="block mb-1 dark:text-white">
                  { isArabic ? 'العنوان' : 'Address' } *
                </label>
                <input
                  type="text"
                  name="address"
                  value={ formData.address }
                  onChange={ handleChange }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
              <div className="flex justify-between mt-6">
                <Link
                  href={ `/${lang}/cart` }
                  className="py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
                >
                  { isArabic ? 'العودة إلى السلة' : 'Back to Cart' }
                </Link>

                <button
                  type="submit"
                  disabled={ submitting }
                  className="py-2 px-6 bg-primary dark:bg-primary text-white rounded hover:opacity-80 disabled:opacity-70"
                >
                  { submitting
                    ? (isArabic ? 'جاري المعالجة...' : 'Processing...')
                    : (isArabic ? 'إتمام الطلب' : 'Complete The Order') }
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */ }
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow sticky top-4">
            <h2 className="text-xl font-bold mb-4 text-primary dark:text-primary-10 text-center">
              { isArabic ? 'ملخص الطلب' : 'Order Summary' }
            </h2>

            <div className="space-y-3 mb-4">
              { cart.items.map((item: any) => (
                <div key={ item._id } className="flex justify-between dark:text-white">
                  <span className='text-secondary dark:text-secondary-10'>
                    { isArabic ? item.product.nameAr : item.product.name } x { item.quantity }
                  </span>
                  <span>${ (item.price * item.quantity).toFixed(2) }</span>
                </div>
              )) }
            </div>

            <div className="border-t pt-3 mb-4">
              <div className="flex justify-between dark:text-white">
                <span className='text-secondary dark:text-secondary-10'>{ isArabic ? 'المجموع الفرعي' : 'Subtotal' }</span>
                <span>${ cart.totalPrice.toFixed(2) }</span>
              </div>
              <div className="flex justify-between dark:text-white">
                <span className='text-secondary dark:text-secondary-10'>{ isArabic ? 'الشحن' : 'Shipping' }</span>
                <span>{ isArabic ? 'حسب العنوان' : 'Based on your address' }</span>
              </div>
              <div className="border-t mt-3 pt-3 font-bold flex justify-between dark:text-white">
                <span className='text-secondary dark:text-secondary-10'>{ isArabic ? 'المجموع' : 'Total' }</span>
                <span className='text-primary dark:text-primary-10 text-md md:text-lg font-bold'>${ cart.totalPrice.toFixed(2) }</span>
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              { isArabic
                ? 'سيتم إنشاء طلبك بدون طريقة دفع. يمكنك الدفع عند الاستلام أو سيتم التواصل معك لترتيب الدفع.'
                : 'Your order will be created without a payment method. You can pay on delivery or we will contact you to arrange payment.' }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}