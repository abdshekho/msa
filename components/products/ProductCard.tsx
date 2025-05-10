import { FiSearch, FiShoppingCart } from "react-icons/fi";
interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
}
interface ProductCardProps {
    filteredProducts: Product[];
}
export default function ProductCard({ filteredProducts }: ProductCardProps) {
    console.log(filteredProducts);  
    return (
    
            filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600">No products found</p>
                    <p className="text-gray-500 mt-2">
                        Try adjusting your filters to find what you're looking for
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    { filteredProducts.map(product => (
                        <div
                            key={ product.id }
                            className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-105"
                        >
                            <div className="relative pb-[100%]">
                                <img
                                    src={ product.image }
                                    alt={ product.name }
                                    className="absolute inset-0 w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-4">
                                <span className="text-sm text-blue-600 font-medium">
                                    { product.category }
                                </span>
                                <h3 className="text-lg font-medium text-gray-900 mt-1">
                                    { product.name }
                                </h3>
                                <p className="text-xl font-bold text-gray-900 mt-2">
                                    ${ product.price }
                                </p>
                                <div className="mt-4 flex space-x-2">
                                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                                        <FiShoppingCart className="h-5 w-5" />
                                        <span>Add to Cart</span>
                                    </button>
                                    <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                        <FiSearch className="h-5 w-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) }
                </div>
            )
    )
}
