'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CategoryFormProps {
    categoryId?: string; // Optional for edit mode
}

export default function CategoryForm({ categoryId }: CategoryFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [parentCategories, setParentCategories] = useState<any[]>([]);

    const [category, setCategory] = useState({
        name: '',
        nameAr: '',
        slug: '',
        image: '',
        description: '',
        descriptionAr: '',
        parentId: '',
        isActive: true,
        order: 0
    });

    // Fetch parent categories
    useEffect(() => {
        const fetchParentCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                if (!response.ok) throw new Error('Failed to fetch categories');

                const data = await response.json();
                setParentCategories(data);
            } catch (error) {
                console.error('Error fetching parent categories:', error);
            }
        };

        fetchParentCategories();
    }, []);

    // Fetch category data if in edit mode
    useEffect(() => {
        if (categoryId) {
            const fetchCategory = async () => {
                try {
                    setIsLoading(true);
                    const response = await fetch(`/api/categories/${categoryId}`);
                    if (!response.ok) throw new Error('Failed to fetch category');

                    const data = await response.json();
                    setCategory({
                        ...data,
                        parentId: data.parentId || ''
                    });
                } catch (error) {
                    console.error('Error fetching category:', error);
                    setMessage('Failed to load category data');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchCategory();
        }
    }, [categoryId]);

    // Generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Auto-generate slug when name changes
        if (name === 'name' && !category.slug) {
            setCategory(prev => ({
                ...prev,
                [name]: value,
                slug: generateSlug(value)
            }));
        } else if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setCategory(prev => ({ ...prev, [name]: target.checked }));
        } else {
            setCategory(prev => ({ ...prev, [name]: value }));
        }
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            const url = categoryId
                ? `/api/categories/${categoryId}`
                : '/api/categories';

            const method = categoryId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(category)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save category');
            }

            setMessage('Category saved successfully!');

            // Redirect to categories list after successful save
            setTimeout(() => {
                router.push('/dashboard/categories');
            }, 2000);

        } catch (error: any) {
            console.error('Error saving category:', error);
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">
                { categoryId ? 'Edit Category' : 'Add New Category' }
            </h1>

            { message && (
                <div className={ `p-4 mb-6 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}` }>
                    { message }
                </div>
            ) }

            <form onSubmit={ handleSubmit } className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 font-medium">Name (English)</label>
                        <input
                            type="text"
                            name="name"
                            value={ category.name }
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
                            value={ category.nameAr }
                            onChange={ handleChange }
                            className="w-full p-2 border rounded"
                            required
                            dir="rtl"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={ category.slug }
                            onChange={ handleChange }
                            className="w-full p-2 border rounded"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Used in URLs. Auto-generated from name if left empty.
                        </p>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={ category.image }
                            onChange={ handleChange }
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Parent Category</label>
                        <select
                            name="parentId"
                            value={ category.parentId }
                            onChange={ handleChange }
                            className="w-full p-2 border rounded"
                        >
                            <option value="">None (Top Level Category)</option>
                            { parentCategories
                                .filter(parent => parent._id !== categoryId) // Prevent selecting self as parent
                                .map(parent => (
                                    <option key={ parent._id } value={ parent._id }>
                                        { parent.name }
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Display Order</label>
                        <input
                            type="number"
                            name="order"
                            value={ category.order }
                            onChange={ handleChange }
                            className="w-full p-2 border rounded"
                            min="0"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Categories are sorted by this number (lower numbers appear first)
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 font-medium">Description (English)</label>
                        <textarea
                            name="description"
                            value={ category.description }
                            onChange={ handleChange }
                            className="w-full p-2 border rounded h-32"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Description (Arabic)</label>
                        <textarea
                            name="descriptionAr"
                            value={ category.descriptionAr }
                            onChange={ handleChange }
                            className="w-full p-2 border rounded h-32"
                            dir="rtl"
                        ></textarea>
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={ category.isActive }
                            onChange={ (e) => setCategory(prev => ({ ...prev, isActive: e.target.checked })) }
                            className="rounded"
                        />
                        <span className="font-medium">Active</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                        Inactive categories won't be displayed on the website
                    </p>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={ () => router.push('/dashboard/categories') }
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        disabled={ isLoading }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={ isLoading }
                        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                    >
                        { isLoading ? 'Saving...' : (categoryId ? 'Update Category' : 'Create Category') }
                    </button>
                </div>
            </form>
        </div>
    );
}
