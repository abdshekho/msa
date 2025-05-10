'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tooltip } from 'flowbite-react';

interface Category {
    _id: string;
    name: string;
    nameAr: string;
    slug: string;
    image?: string;
    description?: string;
    descriptionAr?: string;
    parentId?: string | null;
    isActive: boolean;
    order: number;
    subcategories?: Category[];
}

export default function CategoriesAdminPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
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
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);


    // Fetch all categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');

            const data = await response.json();
            setCategories(data);
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching categories');
        } finally {
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
        } else if (name === 'order') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Generate slug from name
    const generateSlug = () => {
        if (formData.name) {
            const slug = formData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            setFormData(prev => ({ ...prev, slug }));
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
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
        setEditingCategory(null);
    };

    // Open form for creating a new category
    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
    };

    // Open form for editing an existing category
    const handleEdit = (category: Category) => {
        setFormData({
            name: category.name,
            nameAr: category.nameAr,
            slug: category.slug,
            image: category.image || '',
            description: category.description || '',
            descriptionAr: category.descriptionAr || '',
            parentId: category.parentId || '',
            isActive: category.isActive,
            order: category.order
        });
        setEditingCategory(category);
        setShowForm(true);
    };

    // Handle image upload
    const handleImageUpload = async () => {

        if (!imageFile) return;

        try {
            setUploadingImage(true);

            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('type', 'category'); // Specify that this is a brand image

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload image');
            }

            const data = await response.json();

            // Update form data with the image URL
            setFormData(prev => ({ ...prev, image: data.imageUrl }));

            return data.imageUrl;
        } catch (err: any) {
            setError(err.message || 'An error occurred while uploading the image');
            return null;
        } finally {
            setUploadingImage(false);
        }

    };


    // Submit form (create or update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const data = formData;
            if (imageFile) {
                const imageUrl = await handleImageUpload();
                data.image = imageUrl;
                // setFormData(prev => ({ ...prev, image:imageUrl }));
                // console.log('🚀 ~ page.tsx ~ handleSubmit ~ imageUrl:', imageUrl);

                if (!imageUrl) {
                    // If image upload failed, stop the submission
                    setLoading(false);
                    return;
                }
            }
            const url = editingCategory
                ? `/api/categories/${editingCategory._id}`
                : '/api/categories';

            const method = editingCategory ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save category');
            }

            // Success
            setSuccessMessage(editingCategory
                ? 'Category updated successfully!'
                : 'Category created successfully!');

            // Reset and refresh
            resetForm();
            setShowForm(false);
            fetchCategories();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'An error occurred while saving the category');

            // Clear error message after 3 seconds
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    // Delete category
    const handleDelete = async (categoryId: string) => {
        if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`/api/categories/${categoryId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete category');
            }

            // Success
            setSuccessMessage('Category deleted successfully!');

            // Refresh categories
            fetchCategories();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'An error occurred while deleting the category');

            // Clear error message after 3 seconds
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);

        // Create a preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };
    // Render category and its subcategories recursively
    const renderCategory = (category: Category, level = 0) => {
        return (
            <div key={ category._id } className="mb-2">
                <div
                    className={ `flex items-center justify-between p-3 rounded ${level === 0 ? 'bg-blue-50' : 'bg-white border border-gray-200 ml-6'
                        }` }
                >
                    <div className="flex items-center">
                        { category.image && (
                            <div className="w-10 h-10 mr-3">
                                <img
                                    src={ category.image }
                                    alt={ category.name }
                                    width={ 40 }
                                    height={ 40 }
                                    className="object-cover rounded"
                                />
                            </div>
                        ) }
                        <div>
                            <div className="font-medium">{ category.name } / { category.nameAr }</div>
                            <div className="text-sm text-gray-500">
                                Slug:<span> { category.slug } </span> |
                                Order:<span> { category.order }</span> |
                                { category.isActive ? (
                                    <span className="text-green-500">Active</span>
                                ) : (
                                    <span className="text-red-500">Inactive</span>
                                ) }
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={ () => handleEdit(category) }
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={ () => handleDelete(category._id) }
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {/* Render subcategories if any */ }
                { category.subcategories && category.subcategories.length > 0 && (
                    <div className="mt-2">
                        { category.subcategories.map(subcat => renderCategory(subcat, level + 1)) }
                    </div>
                ) }
            </div>
        );
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories Management</h1>
                <button
                    onClick={ handleAddNew }
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Add New Category
                </button>
            </div>

            {/* Success message */ }
            { successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    { successMessage }
                </div>
            ) }

            {/* Error message */ }
            { error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    { error }
                </div>
            ) }

            {/* Category form */ }
            { showForm &&
                (
                    <div className="mb-6 p-4 bg-gray-50 rounded shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                { editingCategory ? 'Edit Category' : 'Add New Category' }
                            </h2>
                            <Tooltip content='Cancel'>
                                <button
                                    onClick={ () => setShowForm(false) }
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    ✕
                                </button>
                            </Tooltip>
                        </div>

                        <form onSubmit={ handleSubmit } className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Name */ }
                                <div>
                                    <label className="block mb-1 font-medium">Name (English)</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={ formData.name }
                                        onChange={ handleInputChange }
                                        onBlur={ generateSlug }
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                {/* Arabic Name */ }
                                <div>
                                    <label className="block mb-1 font-medium">Name (Arabic)</label>
                                    <input
                                        type="text"
                                        name="nameAr"
                                        value={ formData.nameAr }
                                        onChange={ handleInputChange }
                                        className="w-full p-2 border rounded"
                                        required
                                        dir="rtl"
                                    />
                                </div>

                                {/* Slug */ }
                                <div>
                                    <label className="block mb-1 font-medium">Slug</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={ formData.slug }
                                        onChange={ handleInputChange }
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Used in URLs. Auto-generated from name, but you can customize it.
                                    </p>
                                </div>

                                {/* Image URL */ }
                                {/* <div>
                                    <label className="block mb-1 font-medium">Image URL</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={ formData.image }
                                        onChange={ handleInputChange }
                                        className="w-full p-2 border rounded"
                                    />
                                </div> */}
                                {/* Image Upload */ }
                                <div>
                                    <label className="block mb-1 font-medium">Brand Image</label>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={ handleImageChange }
                                            className="w-full p-2 border rounded"
                                            ref={ fileInputRef }
                                        />
                                    </div>

                                    {/* Image Preview */ }
                                    { (imagePreview || formData.image) && (
                                        <div className="mt-2">
                                            <p className="text-sm font-medium mb-1">Image Preview:</p>
                                            <div className="relative w-32 h-32 border rounded overflow-hidden">
                                                <Image
                                                    src={ imagePreview || formData.image }
                                                    alt="Brand image preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    ) }

                                    {/* Manual Image URL input (optional) */ }
                                    <div className="mt-2">
                                        <label className="block mb-1 text-sm text-gray-600">
                                            Or enter image URL manually:
                                        </label>
                                        <input
                                            type="text"
                                            name="image"
                                            value={ formData.image }
                                            onChange={ handleInputChange }
                                            className="w-full p-2 border rounded"
                                            placeholder="Enter image URL (optional if uploading)"
                                        />
                                    </div>
                                </div>

                                {/* Parent Category */ }
                                <div>
                                    <label className="block mb-1 font-medium">Parent Category</label>
                                    <select
                                        name="parentId"
                                        value={ formData.parentId }
                                        onChange={ handleInputChange }
                                        className="w-full p-2 border rounded"
                                        disabled={ !(categories && categories?.length) }
                                    >
                                        <option value="">None (Top Level Category)</option>
                                        { categories?.map(cat => (
                                            <option
                                                key={ cat._id }
                                                value={ cat._id }
                                                disabled={ editingCategory ? editingCategory._id === cat._id : undefined }
                                            >
                                                { cat.name }
                                            </option>
                                        )) }                                </select>
                                </div>

                                {/* Order */ }
                                <div>
                                    <label className="block mb-1 font-medium">Display Order</label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={ formData.order }
                                        onChange={ handleInputChange }
                                        className="w-full p-2 border rounded"
                                        min="0"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Lower numbers appear first
                                    </p>
                                </div>

                                {/* Active Status */ }
                                <div className="flex items-center space-x-2 mt-6">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        name="isActive"
                                        checked={ formData.isActive }
                                        onChange={ handleInputChange }
                                        className="h-4 w-4"
                                    />
                                    <label htmlFor="isActive" className="font-medium">
                                        Active (visible to users)
                                    </label>
                                </div>
                            </div>

                            {/* Description */ }
                            <div>
                                <label className="block mb-1 font-medium">Description (English)</label>
                                <textarea
                                    name="description"
                                    value={ formData.description }
                                    onChange={ handleInputChange }
                                    className="w-full p-2 border rounded h-20"
                                ></textarea>
                            </div>

                            {/* Arabic Description */ }
                            <div>
                                <label className="block mb-1 font-medium">Description (Arabic)</label>
                                <textarea
                                    name="descriptionAr"
                                    value={ formData.descriptionAr }
                                    onChange={ handleInputChange }
                                    className="w-full p-2 border rounded h-20"
                                    dir="rtl"
                                ></textarea>
                            </div>

                            {/* Form buttons */ }
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={ () => setShowForm(false) }
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={ loading }
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                                >
                                    { loading
                                        ? 'Saving...'
                                        : editingCategory
                                            ? 'Update Category'
                                            : 'Create Category' }
                                </button>
                            </div>
                        </form>
                    </div>
                )

            }

            {/* Category list */ }
            { loading && !showForm ? (
                <div>Loading categories…</div>
            ) : (
                <div>{ categories.map(cat => renderCategory(cat)) }</div>
            ) }
        </div>
    );
}
