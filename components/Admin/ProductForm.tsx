//@ts-nocheck
'use client';
import { useState, useEffect, useCallback, memo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import TableEditor for better code splitting
const TableEditor = dynamic(() => import('./TableEditor'), {
    loading: () => <div className="animate-pulse h-40 bg-gray-100 rounded"></div>,
    ssr: false
});

// Define proper TypeScript types
interface Product {
    _id?: string;
    name: string;
    nameAr: string;
    price: number;
    imageCover: string;
    images: string[];
    category: string;
    brand?: string;
    desc: string;
    descAr: string;
    features: string[];
    featuresAr: string[];
    table: TableData;
}

interface TableData {
    headers: string[];
    rows: {
        parameter: string;
        values: string[];
        isSectionHeader?: boolean;
    }[];
}

interface ProductFormProps {
    productId?: string; // Optional for edit mode
}

// Memoized form sections for better performance
const BasicInfoSection = memo(({
    product,
    handleChange,
    isLoading,
    parentCategories,
    brands,
    handleFileChange
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block mb-2 font-medium">Name (English)</label>
                <input
                    type="text"
                    name="name"
                    value={ product.name }
                    onChange={ handleChange }
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">Name (Arabic)</label>
                <input
                    type="text"
                    name="nameAr"
                    value={ product.nameAr }
                    onChange={ handleChange }
                    className="w-full p-2 border rounded"
                    required
                    dir="rtl"
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">Price</label>
                <input
                    type="number"
                    name="price"
                    value={ product.price }
                    onChange={ handleChange }
                    className="w-full p-2 border rounded"
                    required
                    min="0"
                    step="0.01"
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">Category</label>
                <select
                    name="category"
                    value={ product.category }
                    onChange={ handleChange }
                    className="w-full p-2 border rounded"
                    disabled={ isLoading }
                >
                    { parentCategories?.map(parent => (
                        <option key={ parent._id } value={ parent._id }>
                            { parent.name }
                        </option>
                    )) }
                </select>
            </div>

            <div>
                <label className="block mb-2 font-medium">Brand</label>
                <select
                    name="brand"
                    value={ product.brand }
                    onChange={ handleChange }
                    className="w-full p-2 border rounded"
                    disabled={ isLoading }
                >
                    { brands?.map(parent => (
                        <option key={ parent._id } value={ parent._id }>
                            { parent.name }
                        </option>
                    )) }
                </select>
            </div>

            <div>
                <label className="block mb-2 font-medium">Cover Image</label>
                <input
                    type="file"
                    name="imageCoverFile"
                    onChange={ handleFileChange }
                    className="w-full p-2 border rounded"
                    accept="image/*"
                />
                { product.imageCover && (
                    <div className="mt-2">
                        <img width={ 100 } height={ 100 } src={ `${product.imageCover}` } alt="Cover preview" className="h-20 w-auto" />
                    </div>
                ) }
            </div>
        </div>
    );
});

// Set display name for memo components
BasicInfoSection.displayName = 'BasicInfoSection';

const ImagesSection = memo(({
    product,
    handleFileArrayChange,
    addArrayItem,
    removeArrayItem
}) => {
    return (
        <div>
            <label className="block mb-2 font-medium">Additional Images</label>
            { product.images.map((image, index) => (
                <div key={ index } className="flex mb-2 items-center">
                    <input
                        type="file"
                        onChange={ (e) => handleFileArrayChange('images', index, e) }
                        className="flex-grow p-2 border rounded-l"
                        accept="image/*"
                    />
                    { image && (
                        <img src={ image } alt={ `Preview ${index}` } className="h-12 w-12 mx-2 object-cover" />
                    ) }
                    <button
                        type="button"
                        onClick={ () => removeArrayItem('images', index) }
                        className="px-4 py-2 bg-red-500 text-white rounded-r"
                    >
                        Remove
                    </button>
                </div>
            )) }
            <button
                type="button"
                onClick={ () => addArrayItem('images') }
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Add Image
            </button>
        </div>
    );
});

ImagesSection.displayName = 'ImagesSection';

const DescriptionSection = memo(({ product, handleChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block mb-2 font-medium">Description (English)</label>
                <textarea
                    name="desc"
                    value={ product.desc }
                    onChange={ handleChange }
                    className="w-full p-2 border rounded h-32"
                    required
                ></textarea>
            </div>

            <div>
                <label className="block mb-2 font-medium">Description (Arabic)</label>
                <textarea
                    name="descAr"
                    value={ product.descAr }
                    onChange={ handleChange }
                    className="w-full p-2 border rounded h-32"
                    required
                    dir="rtl"
                ></textarea>
            </div>
        </div>
    );
});

DescriptionSection.displayName = 'DescriptionSection';

const FeaturesSection = memo(({
    product,
    handleArrayChange,
    addArrayItem,
    removeArrayItem
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block mb-2 font-medium">Features (English)</label>
                { product.features.map((feature, index) => (
                    <div key={ index } className="flex mb-2">
                        <input
                            type="text"
                            value={ feature }
                            onChange={ (e) => handleArrayChange('features', index, e.target.value) }
                            className="flex-grow p-2 border rounded-l"
                        />
                        <button
                            type="button"
                            onClick={ () => removeArrayItem('features', index) }
                            className="px-4 py-2 bg-red-500 text-white rounded-r"
                        >
                            Remove
                        </button>
                    </div>
                )) }
                <button
                    type="button"
                    onClick={ () => addArrayItem('features') }
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Add Feature
                </button>
            </div>

            <div>
                <label className="block mb-2 font-medium">Features (Arabic)</label>
                { product.featuresAr.map((feature, index) => (
                    <div key={ index } className="flex mb-2">
                        <input
                            type="text"
                            value={ feature }
                            onChange={ (e) => handleArrayChange('featuresAr', index, e.target.value) }
                            className="flex-grow p-2 border rounded-l"
                            dir="rtl"
                        />
                        <button
                            type="button"
                            onClick={ () => removeArrayItem('featuresAr', index) }
                            className="px-4 py-2 bg-red-500 text-white rounded-r"
                        >
                            Remove
                        </button>
                    </div>
                )) }
                <button
                    type="button"
                    onClick={ () => addArrayItem('featuresAr') }
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Add Feature (Arabic)
                </button>
            </div>
        </div>
    );
});

FeaturesSection.displayName = 'FeaturesSection';

export default function ProductForm({ productId }: ProductFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [parentCategories, setParentCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [isPending, startTransition] = useTransition();

    const [tableData, setTableData] = useState<TableData>({
        headers: ['Model', "Product id1", "Product id2", "Product id3"],
        rows: [
            {
                parameter: 'Battery Type',
                values: ['', '', ''],
                isSectionHeader: true,
            },
            {
                parameter: 'Battery Type',
                values: ['', '', '',],
                isSectionHeader: false,
            },
            {
                parameter: 'Battery Type',
                values: ['', '', ''],
                isSectionHeader: false,
            },
            {
                parameter: 'Battery Type',
                values: ['', '', '',],
                isSectionHeader: false,
            },
        ]
    });

    const [product, setProduct] = useState<Product>({
        name: '',
        nameAr: '',
        price: 0,
        imageCover: '',
        images: [''],
        category: '',
        brand: '',
        desc: '',
        descAr: '',
        features: [''],
        featuresAr: [''],
        table: tableData
    });

    // Fetch product data if in edit mode
    useEffect(() => {
        if (productId) {
            const fetchProduct = async () => {
                try {
                    setIsLoading(true);
                    const response = await fetch(`/api/products/${productId}`);
                    if (!response?.ok) throw new Error('Failed to fetch product');

                    const data = await response?.json();

                    startTransition(() => {
                        setProduct(data);

                        // Set table data for TableEditor
                        if (data.table) {
                            setTableData(data.table);
                        }
                    });
                } catch (error) {
                    console.error('Error fetching product:', error);
                    setMessage('Failed to load product data');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchProduct();
        } else {
            setIsLoading(false);
        }
    }, [productId]);

    // Fetch categories and brands in parallel
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                // Fetch both resources in parallel
                const [categoriesResponse, brandsResponse] = await Promise.all([
                    fetch('/api/categories?notNull=true'),
                    fetch('/api/brands')
                ]);

                if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
                if (!brandsResponse.ok) throw new Error('Failed to fetch brands');

                const categoriesData = await categoriesResponse.json();
                const brandsData = await brandsResponse.json();

                startTransition(() => {
                    setParentCategories(categoriesData);
                    setBrands(brandsData);
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle input changes
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setProduct(prev => ({ ...prev, [name]: value }));
    }, []);

    // Handle array inputs (features, images)
    const handleArrayChange = useCallback((name: string, index: number, value: string) => {
        setProduct(prev => {
            const newArray = [...prev[name as keyof typeof prev] as string[]];
            newArray[index] = value;
            return { ...prev, [name]: newArray };
        });
    }, []);

    // Add new item to array
    const addArrayItem = useCallback((name: string) => {
        setProduct(prev => {
            const newArray = [...prev[name as keyof typeof prev] as string[], ''];
            return { ...prev, [name]: newArray };
        });
    }, []);

    // Remove item from array
    const removeArrayItem = useCallback((name: string, index: number) => {
        setProduct(prev => {
            const newArray = [...prev[name as keyof typeof prev] as string[]];
            newArray.splice(index, 1);
            return { ...prev, [name]: newArray };
        });
    }, []);

    // Update table data from TableEditor
    const updateTableData = useCallback((data: TableData) => {
        setTableData(data);
        setProduct(prev => ({ ...prev, table: data }));
    }, []);

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            // Include table data in the product
            const productData = {
                ...product,
                table: tableData
            };

            const url = productId
                ? `/api/products/${productId}`
                : '/api/products';

            const method = productId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            const result = await response?.json();

            if (result?.error) {
                setMessage(result?.error);
                throw new Error(result.error || 'Failed to save product');
            } else {
                setMessage('Product saved successfully!');
            }

            // Redirect to products list after successful save
            setTimeout(() => {
                router.push('/en/dashboard/products');
            }, 500);
        } catch (error: any) {
            console.error('Error saving product:', error);
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // For cover image
    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Create a FormData object
            const formData = new FormData();
            formData.append('image', file);
            formData.append('type', 'product');

            try {
                setIsLoading(true);
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('Image upload failed');

                const data = await response.json();
                setProduct(prev => ({ ...prev, imageCover: data.imageUrl }));
            } catch (error: any) {
                console.error('Error uploading image:', error);
                setMessage(`Error: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    }, []);

    // For additional images
    const handleFileArrayChange = useCallback(async (name: string, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Create a FormData object
            const formData = new FormData();
            formData.append('image', file);
            formData.append('type', 'productAdd');

            try {
                setIsLoading(true);
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('Image upload failed');

                const data = await response.json();

                setProduct(prev => {
                    const newArray = [...prev[name as keyof typeof prev] as string[]];
                    newArray[index] = data.imageUrl;
                    return { ...prev, [name]: newArray };
                });
            } catch (error: any) {
                console.error('Error uploading image:', error);
                setMessage(`Error: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 mt-20 max-w-4xl mx-auto">
                { productId ? 'Edit Product' : 'Add New Product' }
            </h1>

            { message && (
                <div className={ `p-4 mb-6 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}` }>
                    { message }
                </div>
            ) }

            {/* Loading state */ }
            { (isLoading || isPending) && (
                <div className="p-4 mb-6 rounded bg-blue-50 text-blue-700">
                    Processing...
                </div>
            ) }

            <form onSubmit={ handleSubmit } className="space-y-6">
                {/* Basic Information */ }
                <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
                    <BasicInfoSection
                        product={ product }
                        handleChange={ handleChange }
                        isLoading={ isLoading || isPending }
                        parentCategories={ parentCategories }
                        brands={ brands }
                        handleFileChange={ handleFileChange }
                    />

                    {/* Images */ }
                    <ImagesSection
                        product={ product }
                        handleFileArrayChange={ handleFileArrayChange }
                        addArrayItem={ addArrayItem }
                        removeArrayItem={ removeArrayItem }
                    />

                    {/* Description */ }
                    <DescriptionSection
                        product={ product }
                        handleChange={ handleChange }
                    />

                    {/* Features */ }
                    <FeaturesSection
                        product={ product }
                        handleArrayChange={ handleArrayChange }
                        addArrayItem={ addArrayItem }
                        removeArrayItem={ removeArrayItem }
                    />
                </div>

                {/* Technical Specifications Table */ }
                <div className='max-w-8xl'>
                    <h2 className="text-xl font-semibold mb-4 pl-[100px]">Technical Specifications</h2>
                    <TableEditor
                        tableData={ tableData }
                        setTableData={ updateTableData }
                    />
                </div>

                {/* Submit Button */ }
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={ isLoading || isPending }
                        className="px-6 py-3 max-w-4xl mx-auto bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                    >
                        { isLoading || isPending ? 'Saving...' : 'Save Product' }
                    </button>
                </div>
            </form>
        </div>
    );
}