'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tooltip } from 'flowbite-react';

interface service {
    _id: string;
    title: string;
    titleAr: string;
    slug: string;
    image?: string;
    description?: string;
    descriptionAr?: string;
    isActive: boolean;
}

export default function CategoriesAdminPage() {
    const [services, setServices] = useState<service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState<service | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        titleAr: '',
        slug: '',
        image: '',
        description: '',
        descriptionAr: '',
        isActive: true,
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch services on component mount
    useEffect(() => {
        fetchSersetServices();
    }, []);

    // Fetch all services
    const fetchSersetServices = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/services');
            if (!response.ok) throw new Error('Failed to fetch services');

            const data = await response.json();
            setServices(data);
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching services');
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
            formData.append('type', 'services'); // Specify that this is a service image

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




    // Generate slug from title
    const generateSlug = () => {
        if (formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            setFormData(prev => ({ ...prev, slug }));
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            title: '',
            titleAr: '',
            slug: '',
            image: '',
            description: '',
            descriptionAr: '',
            isActive: true,
        });
        setEditingService(null);
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Open form for creating a new service
    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
    };

    // Open form for editing an existing service
    const handleEdit = (service: service) => {
        setFormData({
            title: service.title,
            titleAr: service.titleAr,
            slug: service.slug,
            image: service.image || '',
            description: service.description || '',
            descriptionAr: service.descriptionAr || '',
            isActive: service.isActive || true
        });
        setEditingService(service);
        setImagePreview(service.image || null);
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

            const url = editingService
                ? `/api/services/${editingService._id}`
                : '/api/services';



            const method = editingService ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save service');
            }

            // Success
            setSuccessMessage(editingService
                ? 'Services updated successfully!'
                : 'Services created successfully!');

            // Reset and refresh
            resetForm();
            setShowForm(false);
            fetchSersetServices();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'An error occurred while saving the service');

            // Clear error message after 3 seconds
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    // Delete service
    const handleDelete = async (serviceId: string) => {
        if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`/api/services/${serviceId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete service');
            }

            // Success
            setSuccessMessage('Services deleted successfully!');

            // Refresh services
            fetchSersetServices();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'An error occurred while deleting the service');

            // Clear error message after 3 seconds
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    // Render service and its subcategories recursively
    const renderservice = (service: service, level = 0) => {
        return (
            <div key={ service._id } className="mb-2">
                <div
                    className={ `flex items-center justify-between p-3 rounded ${level === 0 ? 'bg-blue-50' : 'bg-white border border-gray-200 ml-6'
                        }` }
                >
                    <div className="flex items-center">
                        { service.image && (
                            <div className="w-10 h-10 mr-3 relative">
                                <Image
                                    src={ service.image }
                                    alt={ service.title }
                                    fill
                                    sizes="40px"
                                    className="object-cover rounded"
                                />
                            </div>
                        ) }
                        <div>
                            <div className="font-medium">{ service.title } / { service.titleAr }</div>
                            <div className="text-sm text-gray-500">
                                { service.isActive ? (
                                    <span className="text-green-500">Active</span>
                                ) : (
                                    <span className="text-red-500">Inactive</span>
                                ) } |
                                Slug:<span> { service.slug } </span> |
                                description:<span> { service.description }</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={ () => handleEdit(service) }
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={ () => handleDelete(service._id) }
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
                <h1 className="text-2xl font-bold">Services Management</h1>
                <button
                    onClick={ handleAddNew }
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Add New Services
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

            {/* service form */ }
            { showForm &&
                (
                    <div className="mb-6 p-4 bg-gray-50 rounded shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                { editingService ? 'Edit Services' : 'Add New Services' }
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
                                        name="title"
                                        value={ formData.title }
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
                                        name="titleAr"
                                        value={ formData.titleAr }
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

                                {/* Image Upload */ }
                                <div>
                                    <label className="block mb-1 font-medium">Services Image</label>
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
                                                    alt="Services image preview"
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
                                    disabled={ loading || uploadingImage }
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                                >
                                    { loading || uploadingImage
                                        ? 'Saving...'
                                        : editingService
                                            ? 'Update Services'
                                            : 'Create Services' }
                                </button>
                            </div>
                        </form>
                    </div>
                )
            }

            {/* service list */ }
            { loading && !showForm ? (
                <div>Loading services…</div>
            ) : (
                <div>{ services.map(cat => renderservice(cat)) }</div>
            ) }
        </div>
    );
}
