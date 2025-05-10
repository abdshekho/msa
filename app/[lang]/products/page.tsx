'use client';
import { useState, useEffect } from "react";
import { FiShoppingCart, FiSearch } from "react-icons/fi";
import { IoFilterSharp } from "react-icons/io5";
import ProductCard from "../../../components/products/ProductCard";

// Define the Product interface
interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
}

const ProductCatalog = () => {
    // Fix the useState type declarations
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<'default' | 'lowToHigh' | 'highToLow'>('default');

    const categories = [
        "Electronics",
        "Clothing",
        "Home & Kitchen",
        "Books",
        "Accessories",
        "Sports & Outdoors"
    ];

    useEffect(() => {
        let filtered = [...products];

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product =>
                selectedCategories.includes(product.category)
            );
        }

        filtered = filtered.filter(
            product => product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        if (sortOrder === "lowToHigh") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "highToLow") {
            filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(filtered);
    }, [selectedCategories, priceRange, sortOrder, products]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(cat => cat !== category)
                : [...prev, category]
        );
    };

    const handlePriceChange = (index: number, value: number) => {
        setPriceRange(prev => {
            const newRange = [...prev] as [number, number];
            newRange[index] = value;
            return newRange;
        });
    };

    const resetFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, 1000]);
        setSortOrder("default");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
                    <button
                        onClick={ () => setIsMobileFilterOpen(!isMobileFilterOpen) }
                        className="lg:hidden p-2 rounded-md bg-white shadow-sm"
                    >
                        <IoFilterSharp className="h-6 w-6 text-gray-600" />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar */ }
                    <div
                        className={ `lg:w-64 bg-white p-6 rounded-lg shadow-sm ${isMobileFilterOpen ? "block" : "hidden lg:block"
                            }` }
                    >
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-4">Categories</h2>
                            <div className="space-y-2">
                                { categories.map(category => (
                                    <label
                                        key={ category }
                                        className="flex items-center space-x-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={ selectedCategories.includes(category) }
                                            onChange={ () => handleCategoryChange(category) }
                                            className="rounded text-blue-600"
                                        />
                                        <span className="text-gray-700">{ category }</span>
                                    </label>
                                )) }
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-4">Price Range</h2>
                            <div className="space-y-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    value={ priceRange[0] }
                                    onChange={ e => handlePriceChange(0, parseInt(e.target.value)) }
                                    className="w-full"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    value={ priceRange[1] }
                                    onChange={ e => handlePriceChange(1, parseInt(e.target.value)) }
                                    className="w-full"
                                />
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>${ priceRange[0] }</span>
                                    <span>${ priceRange[1] }</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-4">Sort By</h2>
                            <select
                                value={ sortOrder }
                                onChange={ e => setSortOrder(e.target.value as "default" | "lowToHigh" | "highToLow") } className="w-full p-2 border rounded-md"
                            >
                                <option value="default">Default</option>
                                <option value="lowToHigh">Price: Low to High</option>
                                <option value="highToLow">Price: High to Low</option>
                            </select>
                        </div>

                        <button
                            onClick={ resetFilters }
                            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>

                    {/* Product Grid */ }
                    <div className="flex-1">
                    <ProductCard filteredProducts={ filteredProducts } />
                    </div>
                </div>
            </div>
        </div>
    );
};

const mockProducts: Product[] = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    },
    {
        id: 2,
        name: "Cotton T-Shirt",
        category: "Clothing",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
    },
    {
        id: 3,
        name: "Coffee Maker",
        category: "Home & Kitchen",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1517914309068-744e9195997c"
    },
    {
        id: 4,
        name: "Bestseller Novel",
        category: "Books",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f"
    },
    {
        id: 5,
        name: "Leather Wallet",
        category: "Accessories",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93"
    },
    {
        id: 6,
        name: "Yoga Mat",
        category: "Sports & Outdoors",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3"
    },
    {
        id: 7,
        name: "Smart Watch",
        category: "Electronics",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a"
    },
    {
        id: 8,
        name: "Running Shoes",
        category: "Sports & Outdoors",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    }
];

export default ProductCatalog;
