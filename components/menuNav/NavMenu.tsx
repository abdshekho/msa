//@ts-nocheck
'use client';
import React, { useState, useEffect, useRef } from 'react';
import MainMenuItem from './MainMenuItem';

interface Product {
    id: string;
    name: string;
    slug: string;
    image: string;
}

interface SubCategory {
    id: string;
    name: string;
    slug: string;
    image?: string;
    items: Product[];
}

interface ParentCategory {
    id: string;
    name: string;
    slug: string;
    image?: string;
    items: SubCategory[];
}

const NavMenu = ({ lang }) => {
    const [visible, setVisible] = useState(false);
    const [categories, setCategories] = useState<ParentCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef2 = useRef<NodeJS.Timeout | null>(null);
    const handleMouseEnter = () => {
        setVisible(true)
        if (timeoutRef.current) { clearTimeout(timeoutRef.current); }
        if (timeoutRef2.current) { clearTimeout(timeoutRef2.current); }
    };
    const handleMouseLeave = () => {

        timeoutRef2.current = setTimeout(() => {
            document.getElementsByClassName('dropDown_Product')[0].style.animationName = 'BottomToTop'
        }, 400);
        timeoutRef.current = setTimeout(() => {
            setVisible(false);
        }, 500);
    };
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/categories?nested=true&withProducts=true');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                // localStorage.setItem("cachedCategories", JSON.stringify(data));
                localStorage.setItem("cachedCategories", JSON.stringify({
                    data: data,
                    cachedAt: Date.now()
                }));
                setCategories(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching categories:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div>
            { !loading && (
                <div className="relative menu__link"
                    onMouseEnter={ handleMouseEnter }
                    onMouseLeave={ handleMouseLeave }
                    style={ { direction: 'ltr' } }
                >
                    <span className=''>
                        { lang === 'en' ? 'Product ▾' : '▾ المنتجات' }
                    </span>

                    { visible && (
                        <div className="dropDown_Product relative md:absolute top-0 left-0 md:right-0 min-w-[200px] bg-white text-gray-800  z-[1000] 
                        origin-top animate-[topToBottom_0.6s_alternate_forwards]">
                            { categories.map((item) => (
                                <MainMenuItem item={ item } key={ item._id } lang={ lang } />
                            )) }
                        </div>
                    ) }
                </div>
            ) }
        </div>
    );
};

export default NavMenu;
const mockProducts2 = [
    {
        id: 1,
        name: "UPS",
        items: [
            {
                id: 11,
                name: "lithemo UPS1",
                items: [
                    { id: 111, name: "one tow three ", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f" },
                    { id: 112, name: "two", image: "https://images.unsplash.com/photo-1627123424574-724758594e93" },
                    { id: 113, name: "three", image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3" },
                ]
            },
            {
                id: 12,
                name: "lithemo UPS2",
                items: [
                    { id: 121, name: "four", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
                    { id: 122, name: "five", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
                    { id: 123, name: "six", image: "https://images.unsplash.com/photo-1517914309068-744e9195997c" },
                ]
            }
        ]
    },
    {
        id: 2,
        name: "PV inverter",
        items: [
            {
                id: 21,
                name: "lithemo UPS3",
                items: [
                    { id: 211, name: "one2", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f" },
                    { id: 212, name: "two2", image: "https://images.unsplash.com/photo-1627123424574-724758594e93" },
                    { id: 213, name: "three2", image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3" },
                ]
            },
            {
                id: 12,
                name: "lithemo UPS4",
                items: [
                    { id: 221, name: "four2", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
                    { id: 222, name: "five2", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
                    { id: 223, name: "six2", image: "https://images.unsplash.com/photo-1517914309068-744e9195997c" },
                ]
            }
        ]

    }
];