'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
    _id: string;
    name: string;
    nameAr: string;
    slug: string;
    image?: string;
    parentId?: string | null;
    isActive: boolean;
    order: number;
    subcategories?: Category[];
}

export default function CategoriesList() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'parent', 'sub'
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/categories');
                if (!response.ok) throw new Error('Failed to fetch categories');

                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to load categories');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Delete category
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete category');
            }

            // Remove the deleted category from the list
            setCategories(prev => prev.filter(category => category._id !== id));
            setMessage('Category deleted successfully');

            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (error: any) {
            console.error('Error deleting category:', error);
            setError(error.message);

            // Clear error after 3 seconds
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle category active status
    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update category');
            }

            // Update the category in the list
            setCategories(prev =>
                prev.map(category =>
                    category._id === id
                        ? { ...category, isActive: !currentStatus }
                        : category
                )
            );

            setMessage(`Category ${!currentStatus ? 'activated' : 'deactivated'} successfully`);

            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (error: any) {
            console.error('Error updating category:', error);
            setError(error.message);

            // Clear error after 3 seconds
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter categories
    const filteredCategories = categories.filter(category => {
        // Apply search filter
        const matchesSearch =
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.slug.toLowerCase().includes(searchTerm.toLowerCase());

        // Apply category type filter
        if (filter === 'all') return matchesSearch;
        if (filter === 'parent') return matchesSearch && !category.parentId;
        if (filter === 'sub') return matchesSearch && category.parentId;

        return matchesSearch;
    });

    // Find parent category name
    const getParentName = (parentId: string | null | undefined) => {
        if (!parentId) return 'None';
        const parent = categories.find(cat => cat._id === parentId);
        return parent ? parent.name : 'Unknown';
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories Management</h1>
                <Link
                    href="/dashboard/categories/new"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Add New Category
                </Link>
            </div>

            { (error || message) && (
                <div className={ `p-4 mb-6 rounded ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}` }>
                    { error || message }
                </div>
            ) }

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={ searchTerm }
                        onChange={ (e) => setSearchTerm(e.target.value) }
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={ () => setFilter('all') }
                        className={ `px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}` }
                    >
                        All
                    </button>
                    <button
                        onClick={ () => setFilter('parent') }
                        className={ `px-4 py-2 rounded ${filter === 'parent' ? 'bg-blue-600 text-white' : 'bg-gray-200'}` }
                    >
                        Parent Categories
                    </button>
                    <button
                        onClick={ () => setFilter('sub') }
                        className={ `px-4 py-2 rounded ${filter === 'sub' ? 'bg-blue-600 text-white' : 'bg-gray-200'}` }
                    >
                        Subcategories
                    </button>
                </div>
            </div>

            { isLoading ? (
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2 text-gray-600">Loading categories...</p>
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No categories found.</p>
                    { searchTerm && (
                        <p className="mt-2 text-gray-500">
                            Try a different search term or{ ' ' }
                            <button
                                onClick={ () => setSearchTerm('') }
                                className="text-blue-500 hover:underline"
                            >
                                clear the search
                            </button>
                        </p>
                    ) }
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left">Name</th>
                                <th className="py-3 px-4 text-left">Arabic Name</th>
                                <th className="py-3 px-4 text-left">Slug</th>
                                <th className="py-3 px-4 text-left">Parent</th>
                                <th className="py-3 px-4 text-center">Order</th>
                                <th className="py-3 px-4 text-center">Status</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            { filteredCategories.map(category => (
                                <tr key={ category._id } className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            { category.image && (
                                                <img
                                                    src={ category.image }
                                                    alt={ category.name }
                                                    className="w-8 h-8 object-cover rounded"
                                                />
                                            ) }
                                            <span>{ category.name }</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4" dir="rtl">{ category.nameAr }</td>
                                    <td className="py-3 px-4">{ category.slug }</td>
                                    <td className="py-3 px-4">{ getParentName(category.parentId) }</td>
                                    <td className="py-3 px-4 text-center">{ category.order }</td>
                                    <td className="py-3 px-4 text-center">
                                        <span
                                            className={ `inline-block px-2 py-1 rounded text-xs ${category.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }` }
                                        >
                                            { category.isActive ? 'Active' : 'Inactive' }
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={ () => router.push(`/dashboard/categories/${category._id}`) }
                                                className="p-1 text-blue-600 hover:text-blue-800"
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={ () => toggleActive(category._id, category.isActive) }
                                                className={ `p-1 ${category.isActive
                                                        ? 'text-orange-600 hover:text-orange-800'
                                                        : 'text-green-600 hover:text-green-800'
                                                    }` }
                                                title={ category.isActive ? 'Deactivate' : 'Activate' }
                                            >
                                                { category.isActive ? '🔴' : '🟢' }
                                            </button>
                                            <button
                                                onClick={ () => handleDelete(category._id) }
                                                className="p-1 text-red-600 hover:text-red-800"
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>
            ) }
        </div>
    );
}
