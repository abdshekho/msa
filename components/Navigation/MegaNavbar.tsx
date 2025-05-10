'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
    _id: string;
    name: string;
    nameAr: string;
    slug: string;
    imageCover: string;
    price: number;
}

interface Category {
    _id: string;
    name: string;
    nameAr: string;
    slug: string;
    image?: string;
    parentId?: string | null;
    isActive: boolean;
    subcategories?: Category[];
    products?: Product[];
}

interface MegaNavbarProps {
    lang: string;
}

export default function MegaNavbar({ lang }: MegaNavbarProps) {
    const [mainCategories, setMainCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Record<string, Category[]>>({});
    const [categoryProducts, setCategoryProducts] = useState<Record<string, Product[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 1. جلب التصنيفات الرئيسية
    useEffect(() => {
        const fetchMainCategories = async () => {
            try {
                const response = await fetch('/api/categories?parentId=null');
                if (!response.ok) throw new Error('Failed to fetch main categories');

                const data = await response.json();
                // فلترة التصنيفات النشطة فقط
                const activeCategories = data.filter((cat: Category) => cat.isActive);
                setMainCategories(activeCategories);
            } catch (error) {
                console.error('Error fetching main categories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMainCategories();
    }, []);

    // 2. جلب التصنيفات الفرعية عند التحويم على تصنيف رئيسي
    const handleCategoryHover = async (categoryId: string) => {
        setActiveCategory(categoryId);

        // إذا كنا قد جلبنا التصنيفات الفرعية لهذا التصنيف من قبل، لا داعي لجلبها مرة أخرى
        if (subcategories[categoryId]) return;

        try {
            const response = await fetch(`/api/categories?parentId=${categoryId}`);
            if (!response.ok) throw new Error('Failed to fetch subcategories');

            const data = await response.json();
            // فلترة التصنيفات الفرعية النشطة فقط
            const activeSubcategories = data.filter((cat: Category) => cat.isActive);

            setSubcategories(prev => ({
                ...prev,
                [categoryId]: activeSubcategories
            }));
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    // 3. جلب المنتجات عند التحويم على تصنيف فرعي
    const handleSubcategoryHover = async (subcategoryId: string) => {
        setActiveSubcategory(subcategoryId);

        // إذا كنا قد جلبنا منتجات هذا التصنيف الفرعي من قبل، لا داعي لجلبها مرة أخرى
        if (categoryProducts[subcategoryId]) return;

        try {
            const response = await fetch(`/api/products?subcategory=${subcategoryId}&limit=6`);
            if (!response.ok) throw new Error('Failed to fetch products');

            const data = await response.json();

            setCategoryProducts(prev => ({
                ...prev,
                [subcategoryId]: data.products || []
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // التعامل مع إغلاق القوائم عند مغادرة المنطقة
    const handleMouseLeave = () => {
        setActiveCategory(null);
        setActiveSubcategory(null);
    };

    if (isLoading) {
        return <div className="h-16 bg-white shadow-md"></div>;
    }

    return (
        <nav className="bg-white shadow-md relative z-50">
            {/* قائمة سطح المكتب */ }
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    {/* زر القائمة للجوال */ }
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={ () => setIsMobileMenuOpen(!isMobileMenuOpen) }
                            className="text-gray-700 hover:text-blue-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* الشعار */ }
                    <div className="flex items-center">
                        <Link href={ `/${lang}` } className="flex-shrink-0">
                            <Image src="/logo.png" alt="Logo" width={ 120 } height={ 40 } />
                        </Link>
                    </div>

                    {/* قائمة التصنيفات الرئيسية */ }
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        { mainCategories.map((category) => (
                            <div
                                key={ category._id }
                                className="relative group"
                                onMouseEnter={ () => handleCategoryHover(category._id) }
                                onMouseLeave={ handleMouseLeave }
                            >
                                <Link
                                    href={ `/${lang}/category/${category.slug}` }
                                    className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                                >
                                    { lang === 'ar' ? category.nameAr : category.name }
                                </Link>

                                {/* قائمة التصنيفات الفرعية */ }
                                { activeCategory === category._id && subcategories[category._id] && (
                                    <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-md overflow-hidden z-50">
                                        <div className="py-2">
                                            { subcategories[category._id].map((subcategory) => (
                                                <div
                                                    key={ subcategory._id }
                                                    className="relative group"
                                                    onMouseEnter={ () => handleSubcategoryHover(subcategory._id) }
                                                >
                                                    <Link
                                                        href={ `/${lang}/category/${subcategory.slug}` }
                                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        { lang === 'ar' ? subcategory.nameAr : subcategory.name }
                                                    </Link>

                                                    {/* قائمة المنتجات */ }
                                                    { activeSubcategory === subcategory._id && categoryProducts[subcategory._id] && (
                                                        <div className="absolute left-56 top-0 w-64 bg-white shadow-lg rounded-md overflow-hidden z-50">
                                                            <div className="py-2">
                                                                { categoryProducts[subcategory._id].length > 0 ? (
                                                                    categoryProducts[subcategory._id].map((product) => (
                                                                        <Link
                                                                            key={ product._id }
                                                                            href={ `/${lang}/product/${product.slug}` }
                                                                            className="flex items-center px-4 py-2 hover:bg-blue-50"
                                                                        >
                                                                            { product.imageCover && (
                                                                                <div className="w-10 h-10 mr-3">
                                                                                    <Image
                                                                                        src={ product.imageCover }
                                                                                        alt={ lang === 'ar' ? product.nameAr : product.name }
                                                                                        width={ 40 }
                                                                                        height={ 40 }
                                                                                        className="object-cover rounded"
                                                                                    />
                                                                                </div>
                                                                            ) }
                                                                            <div>
                                                                                <p className="text-sm font-medium text-gray-700">
                                                                                    { lang === 'ar' ? product.nameAr : product.name }
                                                                                </p>
                                                                                <p className="text-xs text-blue-600">${ product.price }</p>
                                                                            </div>
                                                                        </Link>
                                                                    ))
                                                                ) : (
                                                                    <p className="px-4 py-2 text-sm text-gray-500">No products found</p>
                                                                ) }

                                                                <div className="border-t mt-2 pt-2">
                                                                    <Link
                                                                        href={ `/${lang}/category/${subcategory.slug}` }
                                                                        className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                                                    >
                                                                        { lang === 'ar' ? 'عرض كل المنتجات' : 'View all products' }
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) }
                                                </div>
                                            )) }

                                            <div className="border-t mt-2 pt-2">
                                                <Link
                                                    href={ `/${lang}/category/${category.slug}` }
                                                    className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                                >
                                                    { lang === 'ar' ? 'عرض كل التصنيفات الفرعية' : 'View all subcategories' }
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ) }
                            </div>
                        )) }
                    </div>

                    {/* أزرار إضافية (بحث، سلة التسوق، إلخ) */ }
                    <div className="flex items-center">
                        <button className="p-2 text-gray-700 hover:text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <Link href={ `/${lang}/cart` } className="p-2 text-gray-700 hover:text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* قائمة الجوال */ }
            <div className={ `md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}` }>
                <div className="px-2 pt-2 pb-3 space-y-1">
                    { mainCategories.map((category) => (
                        <div key={ category._id }>
                            <button
                                onClick={ () => setActiveCategory(activeCategory === category._id ? null : category._id) }
                                className="w-full flex justify-between items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <span>{ lang === 'ar' ? category.nameAr : category.name }</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className={ `h-4 w-4 transition-transform ${activeCategory === category._id ? 'transform rotate-180' : ''}` } viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            { activeCategory === category._id && subcategories[category._id] && (
                                <div className="pl-4 space-y-1 mt-1">
                                    { subcategories[category._id].map((subcategory) => (
                                        <div key={ subcategory._id }>
                                            <button
                                                onClick={ () => setActiveSubcategory(activeSubcategory === subcategory._id ? null : subcategory._id) }
                                                className="w-full flex justify-between items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                            >
                                                <span>{ lang === 'ar' ? subcategory.nameAr : subcategory.name }</span>
                                                {/* <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${activeSubcategory === subcategory._id ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule */}
                                            </button>
                                        </div>
                                    ))}
                            </div>
                            ) }
                        </div>
                    )) }

                </div>
            </div>
        </nav>
    )
}