'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tooltip } from 'flowbite-react';

interface brand {
    _id: string;
    name: string;
    nameAr: string;
    slug: string;
    image?: string;
    description?: string;
    descriptionAr?: string;
}
function truncate(text, maxLength = 50) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export default function CategoriesAdminPage() {
    const [brands, setBrands] = useState<brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingbrand, setEditingbrand] = useState<brand | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        nameAr: '',
        slug: '',
        image: '',
        description: '',
        descriptionAr: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch brands on component mount
    useEffect(() => {
        fetchBrands();
    }, []);

    // Fetch all brands
    const fetchBrands = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/brands');
            if (!response.ok) throw new Error('Failed to fetch brands');

            const data = await response.json();
            setBrands(data);
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching brands');
        } finally {
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle image file selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);

        // Create a preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    // Handle image upload
    const handleImageUpload = async () => {
        if (!imageFile) return;

        try {
            setUploadingImage(true);

            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('type', 'brand'); // Specify that this is a brand image

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
        });
        setEditingbrand(null);
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Open form for creating a new brand
    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
    };

    // Open form for editing an existing brand
    const handleEdit = (brand: brand) => {
        setFormData({
            name: brand.name,
            nameAr: brand.nameAr,
            slug: brand.slug,
            image: brand.image || '',
            description: brand.description || '',
            descriptionAr: brand.descriptionAr || '',
        });
        setEditingbrand(brand);
        setImagePreview(brand.image || null);
        setShowForm(true);
    };

    // Submit form (create or update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            // If there's a new image file, upload it first
            const data = formData;
            if (imageFile) {
                const imageUrl = await handleImageUpload();
                data.image = imageUrl;

                if (!imageUrl) {
                    // If image upload failed, stop the submission
                    setLoading(false);
                    return;
                }
            }

            const url = editingbrand
                ? `/api/brands/${editingbrand._id}`
                : '/api/brands';

            const method = editingbrand ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save brand');
            }

            // Success
            setSuccessMessage(editingbrand
                ? 'Brand updated successfully!'
                : 'Brand created successfully!');

            // Reset and refresh
            resetForm();
            setShowForm(false);
            fetchBrands();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'An error occurred while saving the brand');

            // Clear error message after 3 seconds
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    // Delete brand
    const handleDelete = async (brandId: string) => {
        if (!confirm('Are you sure you want to delete this brand? This action cannot be undone.')) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`/api/brands/${brandId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete brand');
            }

            // Success
            setSuccessMessage('Brand deleted successfully!');

            // Refresh brands
            fetchBrands();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'An error occurred while deleting the brand');

            // Clear error message after 3 seconds
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    // Render brand and its subcategories recursively
    const renderbrand = (brand: brand, level = 0) => {
        return (
            <div key={ brand._id } className="mb-2">
                <div
                    className={ `flex items-center justify-between p-3 rounded ${level === 0 ? 'bg-blue-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ml-6'
                        }` }
                >
                    <div className="flex items-center">
                        { brand.image && (
                            <div className="w-20 h-15 mr-3 relative">
                                <Image
                                    src={ brand.image }
                                    alt={ brand.name }
                                    fill
                                    sizes="120px"
                                    className="object-contain rounded"
                                />
                            </div>
                        ) }
                        <div>
                            <div className="font-medium dark:text-white">{ brand.name } / { brand.nameAr }</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Slug:<span> { brand.slug } </span> |
                                description:<span> { truncate(brand.description) }</span> |
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={ () => handleEdit(brand) }
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={ () => handleDelete(brand._id) }
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Brands Management</h1>
                <button
                    onClick={ handleAddNew }
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Add New Brand
                </button>
            </div>

            {/* Success message */ }
            { successMessage && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                    { successMessage }
                </div>
            ) }

            {/* Error message */ }
            { error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                    { error }
                </div>
            ) }

            {/* brand form */ }
            { showForm &&
                (
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold dark:text-white">
                                { editingbrand ? 'Edit Brand' : 'Add New Brand' }
                            </h2>
                            <Tooltip content='Cancel'>
                                <button
                                    onClick={ () => setShowForm(false) }
                                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                                >
                                    ✕
                                </button>
                            </Tooltip>
                        </div>

                        <form onSubmit={ handleSubmit } className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Name */ }
                                <div>
                                    <label className="block mb-1 font-medium dark:text-white">Name (English)</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={ formData.name }
                                        onChange={ handleInputChange }
                                        onBlur={ generateSlug }
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                </div>

                                {/* Arabic Name */ }
                                <div>
                                    <label className="block mb-1 font-medium dark:text-white">Name (Arabic)</label>
                                    <input
                                        type="text"
                                        name="nameAr"
                                        value={ formData.nameAr }
                                        onChange={ handleInputChange }
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                        dir="rtl"
                                    />
                                </div>

                                {/* Slug */ }
                                <div>
                                    <label className="block mb-1 font-medium dark:text-white">Slug</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={ formData.slug }
                                        onChange={ handleInputChange }
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Used in URLs. Auto-generated from name, but you can customize it.
                                    </p>
                                </div>

                                {/* Image Upload */ }
                                <div>
                                    <label className="block mb-1 font-medium dark:text-white">Brand Image</label>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={ handleImageChange }
                                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            ref={ fileInputRef }
                                        />
                                    </div>

                                    {/* Image Preview */ }
                                    { (imagePreview || formData.image) && (
                                        <div className="mt-2">
                                            <p className="text-sm font-medium mb-1 dark:text-white">Image Preview:</p>
                                            <div className="relative w-32 h-32 border rounded overflow-hidden dark:border-gray-600">
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
                                        <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">
                                            Or enter image URL manually:
                                        </label>
                                        <input
                                            type="text"
                                            name="image"
                                            value={ formData.image }
                                            onChange={ handleInputChange }
                                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Enter image URL (optional if uploading)"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */ }
                            <div>
                                <label className="block mb-1 font-medium dark:text-white">Description (English)</label>
                                <textarea
                                    name="description"
                                    value={ formData.description }
                                    onChange={ handleInputChange }
                                    className="w-full p-2 border rounded h-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                ></textarea>
                            </div>

                            {/* Arabic Description */ }
                            <div>
                                <label className="block mb-1 font-medium dark:text-white">Description (Arabic)</label>
                                <textarea
                                    name="descriptionAr"
                                    value={ formData.descriptionAr }
                                    onChange={ handleInputChange }
                                    className="w-full p-2 border rounded h-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    dir="rtl"
                                ></textarea>
                            </div>

                            {/* Form buttons */ }
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={ () => setShowForm(false) }
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={ loading || uploadingImage }
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-800"
                                >
                                    { loading || uploadingImage
                                        ? 'Saving...'
                                        : editingbrand
                                            ? 'Update Brand'
                                            : 'Create Brand' }
                                </button>
                            </div>
                        </form>
                    </div>
                )
            }

            {/* brand list */ }
            { loading && !showForm ? (
                <div className="text-center py-8 dark:text-white">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary dark:border-primary-10 mb-2"></div>
                    <p>Loading brands...</p>
                </div>
            ) : (
                <div>{ brands.map(cat => renderbrand(cat)) }</div>
            ) }
        </div>
    );
}