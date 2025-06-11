//@ts-nocheck
'use client';
import { useState, useEffect, useCallback, memo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Dynamically import TableEditor for better code splitting
const TableEditor = dynamic(() => import('./TableEditor'), {
    loading: () => <div className="animate-pulse h-40 bg-gray-100 rounded"></div>,
    ssr: false
});

// Zod schema for validation
const productSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    nameAr: z.string().min(1, 'Arabic name is required').max(100, 'Arabic name must be less than 100 characters'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    price: z.number().min(0.01, 'Price must be positive'),
    imageCover: z.string().min(1, 'Cover image is required'),
    images: z.array(z.string()).min(1, 'At least one additional image is required'),
    category: z.string().min(1, 'Category is required'),
    brand: z.string().min(1, 'Brand is required'),
    desc: z.string().min(10, 'Description must be at least 10 characters'),
    descAr: z.string().min(10, 'Arabic description must be at least 10 characters'),
    features: z.array(z.string().min(1, 'Feature cannot be empty')).min(1, 'At least one feature is required'),
    featuresAr: z.array(z.string().min(1, 'Arabic feature cannot be empty')).min(1, 'At least one Arabic feature is required'),
    table: z.object({
        headers: z.array(z.string()),
        rows: z.array(z.object({
            parameter: z.string(),
            values: z.array(z.string()),
            isSectionHeader: z.boolean()
        }))
    })
});

type ProductFormData = z.infer<typeof productSchema>;

interface TableData {
    headers: string[];
    rows: {
        parameter: string;
        values: string[];
        isSectionHeader?: boolean;
    }[];
}

interface ProductFormProps {
    productId?: string;
}

// Error message component
const ErrorMessage = memo(({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-red-500 text-sm mt-1">{ message }</p>;
});

ErrorMessage.displayName = 'ErrorMessage';

// Form field wrapper
const FieldWrapper = memo(({
    label,
    error,
    children,
    required = false
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
    required?: boolean;
}) => (
    <div>
        <label className="block mb-2 font-medium dark:text-white">
            { label } { required && <span className="text-red-500">*</span> }
        </label>
        { children }
        <ErrorMessage message={ error } />
    </div>
));

FieldWrapper.displayName = 'FieldWrapper';

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
                values: ['', '', ''],
                isSectionHeader: false,
            },
            {
                parameter: 'Battery Type',
                values: ['', '', ''],
                isSectionHeader: false,
            },
            {
                parameter: 'Battery Type',
                values: ['', '', ''],
                isSectionHeader: false,
            },
        ]
    });

    // Initialize form with default values
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        reset
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            nameAr: '',
            slug: '',
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
        }
    });

    // Field arrays for dynamic fields
    const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
        control,
        name: 'images'
    });

    const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
        control,
        name: 'features'
    });

    const { fields: featureArFields, append: appendFeatureAr, remove: removeFeatureAr } = useFieldArray({
        control,
        name: 'featuresAr'
    });

    // Watch name field for slug generation
    const nameValue = watch('name');

    // Generate slug from name
    const generateSlug = useCallback(() => {
        if (nameValue) {
            const slug = nameValue
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setValue('slug', slug);
        }
    }, [nameValue, setValue]);

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
                        reset(data);
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
    }, [productId, reset]);

    // Fetch categories and brands
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
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

    // Update table data
    const updateTableData = useCallback((data: TableData) => {
        setTableData(data);
        setValue('table', data);
    }, [setValue]);

    // Handle file upload for cover image
    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
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
                setValue('imageCover', data.imageUrl);
            } catch (error: any) {
                console.error('Error uploading image:', error);
                setMessage(`Error: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    }, [setValue]);

    // Handle file upload for additional images
    const handleFileArrayChange = useCallback(async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
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
                setValue(`images.${index}`, data.imageUrl);
            } catch (error: any) {
                console.error('Error uploading image:', error);
                setMessage(`Error: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    }, [setValue]);

    // Submit form
    const onSubmit = async (data: ProductFormData) => {
        console.log(data);
        try {
            setIsLoading(true);

            const productData = {
                ...data,
                table: tableData
            };

            const url = productId ? `/api/products/${productId}` : '/api/products';
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
                setTimeout(() => {
                    router.push('/en/dashboard/products');
                }, 500);
            }
        } catch (error: any) {
            console.error('Error saving product:', error);
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 mt-20 max-w-4xl mx-auto dark:text-white">
                { productId ? 'Edit Product' : 'Add New Product' }
            </h1>

            { message && (
                <div className={ `p-4 mb-6 rounded max-w-4xl mx-auto ${message.includes('Error')
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                    : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}` }>
                    { message }
                </div>
            ) }

            { (isLoading || isPending) && (
                <div className="p-4 mb-6 rounded bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 max-w-4xl mx-auto">
                    Processing...
                </div>
            ) }

            <form onSubmit={ handleSubmit(onSubmit) } className="space-y-6" suppressHydrationWarning>
                {/* Basic Information */ }
                <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Controller
                            name="name"
                            control={ control }
                            render={ ({ field }) => (
                                <FieldWrapper label="Name (English)" error={ errors.name?.message } required>
                                    <input
                                        { ...field }
                                        type="text"
                                        disabled={ isLoading || isPending || isSubmitting }
                                        onBlur={ (e) => {
                                            field.onBlur();
                                            generateSlug();
                                        } }
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </FieldWrapper>
                            ) }
                        />

                        <Controller
                            name="nameAr"
                            control={ control }
                            render={ ({ field }) => (
                                <FieldWrapper label="Name (Arabic)" error={ errors.nameAr?.message } required>
                                    <input
                                        { ...field }
                                        type="text"
                                        dir="rtl"
                                        disabled={ isLoading || isPending || isSubmitting }
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </FieldWrapper>
                            ) }
                        />

                        <Controller
                            name="slug"
                            control={ control }
                            render={ ({ field }) => (
                                <FieldWrapper label="Slug" error={ errors.slug?.message } required>
                                    <input
                                        { ...field }
                                        type="text"
                                        disabled={ isLoading || isPending || isSubmitting }
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Used in URLs. Auto-generated from name, but you can customize it.
                                    </p>
                                </FieldWrapper>
                            ) }
                        />

                        <Controller
                            name="price"
                            control={ control }
                            render={ ({ field }) => (
                                <FieldWrapper label="Price" error={ errors.price?.message } required>
                                    <input
                                        { ...field }
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        disabled={ isLoading || isPending || isSubmitting }
                                        onChange={ (e) => field.onChange(parseFloat(e.target.value) || 0) }
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </FieldWrapper>
                            ) }
                        />

                        <Controller
                            name="category"
                            control={ control }
                            render={ ({ field }) => (
                                <FieldWrapper label="Category" error={ errors.category?.message } required>
                                    <select
                                        { ...field }
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        disabled={ isLoading || isPending || isSubmitting }
                                    >
                                        <option value="">Select category</option>
                                        { parentCategories?.map(parent => (
                                            <option key={ parent._id } value={ parent._id }>
                                                { parent.name }
                                            </option>
                                        )) }
                                    </select>
                                </FieldWrapper>
                            ) }
                        />

                        <Controller
                            name="brand"
                            control={ control }
                            render={ ({ field }) => (
                                <FieldWrapper label="Brand" error={ errors.brand?.message } required>
                                    <select
                                        { ...field }
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        disabled={ isLoading || isPending || isSubmitting }
                                    >
                                        <option value="">Select brand</option>
                                        { brands?.map(brand => (
                                            <option key={ brand._id } value={ brand._id }>
                                                { brand.name }
                                            </option>
                                        )) }
                                    </select>
                                </FieldWrapper>
                            ) }
                        />

                        <Controller
                            name="imageCover"
                            control={ control }
                            render={ ({ field }) => (
                                <FieldWrapper label="Cover Image" error={ errors.imageCover?.message } required>
                                    <input
                                        type="file"
                                        onChange={ handleFileChange }
                                        disabled={ isLoading || isPending || isSubmitting }
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white file:bg-blue-500 file:text-white file:border-0 file:rounded file:px-2 file:py-1 dark:file:bg-blue-600"
                                        accept="image/*"
                                    />
                                    { field.value && (
                                        <div className="mt-2">
                                            <img
                                                width={ 100 }
                                                height={ 100 }
                                                src={ field.value }
                                                alt="Cover preview"
                                                className="h-20 w-auto"
                                            />
                                        </div>
                                    ) }
                                </FieldWrapper>
                            ) }
                        />
                    </div>

                    {/* Additional Images */ }
                    <div className="mb-6">
                        <FieldWrapper label="Additional Images" error={ errors.images?.message } required>
                            <div>
                                { imageFields.map((field, index) => (
                                    <div key={ field.id } className="flex mb-2 items-center">
                                        <input
                                            type="file"
                                            onChange={ (e) => handleFileArrayChange(index, e) }
                                            className="flex-grow p-2 border rounded-l dark:bg-gray-700 dark:border-gray-600 dark:text-white file:bg-blue-500 file:text-white file:border-0 file:rounded file:px-2 file:py-1 dark:file:bg-blue-600"
                                            accept="image/*"
                                            disabled={ isLoading || isPending || isSubmitting }
                                        />
                                        { watch(`images.${index}`) && (
                                            <img
                                                src={ watch(`images.${index}`) }
                                                alt={ `Preview ${index}` }
                                                className="h-12 w-12 mx-2 object-cover"
                                            />
                                        ) }
                                        <button
                                            type="button"
                                            onClick={ () => removeImage(index) }
                                            className="px-4 py-2 bg-red-500 text-white rounded mx-1 dark:bg-red-700 dark:hover:bg-red-800"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )) }
                                <button
                                    type="button"
                                    onClick={ () => appendImage('') }
                                    className="px-4 py-2 bg-blue-500 text-white rounded dark:bg-blue-700 dark:hover:bg-blue-800"
                                >
                                    Add Image
                                </button>
                            </div>
                        </FieldWrapper>
                    </div>

                    {/* Descriptions */ }
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Controller
                            name="desc"
                            control={ control }
                            render={ ({ field }) => (
                                <FieldWrapper label="Description (English)" error={ errors.desc?.message } required>
                                    <textarea
                                        { ...field }
                                        disabled={isLoading || isPending || isSubmitting}
                                        className="w-full p-2 border rounded h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </FieldWrapper>
                            ) }
                        />

                        <Controller
                            name="descAr"
                            control={ control }
                            render={ ({ field }) => (
                                <FieldWrapper label="Description (Arabic)" error={ errors.descAr?.message } required>
                                    <textarea
                                        { ...field }
                                        disabled={isLoading || isPending || isSubmitting}
                                        dir="rtl"
                                        className="w-full p-2 border rounded h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </FieldWrapper>
                            ) }
                        />
                    </div>

                    {/* Features */ }
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FieldWrapper label="Features (English)" error={ errors.features?.message } required>
                            <div>
                                { featureFields.map((field, index) => (
                                    <div key={ field.id } className="flex mb-2">
                                        <Controller
                                            name={ `features.${index}` }
                                            control={ control }
                                            render={ ({ field: inputField }) => (
                                                <input
                                                    { ...inputField }
                                                    type="text"
                                                    className="flex-grow p-2 border rounded-l dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                />
                                            ) }
                                        />
                                        <button
                                            type="button"
                                            onClick={ () => removeFeature(index) }
                                            className="px-4 py-2 bg-red-500 text-white rounded-r dark:bg-red-700 dark:hover:bg-red-800"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )) }
                                <button
                                    type="button"
                                    onClick={ () => appendFeature('') }
                                    className="px-4 py-2 bg-blue-500 text-white rounded dark:bg-blue-700 dark:hover:bg-blue-800"
                                >
                                    Add Feature
                                </button>
                            </div>
                        </FieldWrapper>

                        <FieldWrapper label="Features (Arabic)" error={ errors.featuresAr?.message } required>
                            <div>
                                { featureArFields.map((field, index) => (
                                    <div key={ field.id } className="flex mb-2">
                                        <Controller
                                            name={ `featuresAr.${index}` }
                                            control={ control }
                                            render={ ({ field: inputField }) => (
                                                <input
                                                    { ...inputField }
                                                    type="text"
                                                    dir="rtl"
                                                    className="flex-grow p-2 border rounded-l dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                />
                                            ) }
                                        />
                                        <button
                                            type="button"
                                            onClick={ () => removeFeatureAr(index) }
                                            className="px-4 py-2 bg-red-500 text-white rounded-r dark:bg-red-700 dark:hover:bg-red-800"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )) }
                                <button
                                    type="button"
                                    onClick={ () => appendFeatureAr('') }
                                    className="px-4 py-2 bg-blue-500 text-white rounded dark:bg-blue-700 dark:hover:bg-blue-800"
                                >
                                    Add Feature (Arabic)
                                </button>
                            </div>
                        </FieldWrapper>
                    </div>
                </div>

                {/* Technical Specifications Table */ }
                <div className='max-w-8xl'>
                    <h2 className="text-xl font-semibold mb-4 pl-[100px] dark:text-white">Technical Specifications</h2>
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
                        className="px-6 py-3 max-w-4xl mx-auto bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 dark:bg-green-700 dark:hover:bg-green-800 dark:disabled:bg-gray-600"
                    >
                        { isLoading || isPending || isSubmitting ? 'Saving...' : 'Save Product' }
                    </button>
                </div>
            </form>
        </div>
    );
}