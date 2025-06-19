'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tooltip } from 'flowbite-react';
import { useTheme } from 'next-themes';

interface projects {
    _id: string;
    title: string;
    titleAr: string;
    slug: string;
    image?: string;
    description?: string;
    descriptionAr?: string;
    isActive: boolean;
}

export default function ProjectsAdminPage() {
    const { theme, setTheme } = useTheme();
    const [projects, setProjects] = useState<projects[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState<projects | null>(null);
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

    // Fetch projects on component mount
    useEffect(() => {
        fetchSersetProjects();
    }, []);

    // Fetch all projects
    const fetchSersetProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/projects');
            if (!response.ok) throw new Error('Failed to fetch projects');

            const data = await response.json();
            setProjects(data);
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching projects');
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
            formData.append('type', 'projects'); // Specify that this is a projects image

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

    // Open form for creating a new projects
    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
    };

    // Open form for editing an existing projects
    const handleEdit = (projects: projects) => {
        setFormData({
            title: projects.title,
            titleAr: projects.titleAr,
            slug: projects.slug,
            image: projects.image || '',
            description: projects.description || '',
            descriptionAr: projects.descriptionAr || '',
            isActive: projects.isActive || true
        });
        setEditingService(projects);
        setImagePreview(projects.image || null);
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
                ? `/api/projects/${editingService._id}`
                : '/api/projects';



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
                throw new Error(errorData.error || 'Failed to save projects');
            }

            // Success
            setSuccessMessage(editingService
                ? 'projects updated successfully!'
                : 'projects created successfully!');

            // Reset and refresh
            resetForm();
            setShowForm(false);
            fetchSersetProjects();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'An error occurred while saving the projects');

            // Clear error message after 3 seconds
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    // Delete projects
    const handleDelete = async (projectsId: string) => {
        if (!confirm('Are you sure you want to delete this projects? This action cannot be undone.')) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`/api/projects/${projectsId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete projects');
            }

            // Success
            setSuccessMessage('Projects deleted successfully!');

            // Refresh projects
            fetchSersetProjects();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'An error occurred while deleting the projects');

            // Clear error message after 3 seconds
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    // Render projects and its subcategories recursively
    const renderprojects = (projects: projects, level = 0) => {
        return (
            <div key={ projects._id } className="mb-2">
                <div
                    className={ `flex items-center justify-between p-3 rounded ${level === 0 ? 'bg-blue-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 ml-6'
                        }` }
                >
                    <div className="flex items-center">
                        { projects.image && (
                            <div className="w-10 h-10 mr-3 relative">
                                <Image
                                    src={ projects.image }
                                    alt={ projects.title }
                                    fill
                                    sizes="40px"
                                    className="object-cover rounded"
                                />
                            </div>
                        ) }
                        <div>
                            <div className="font-medium dark:text-white">{ projects.title } / { projects.titleAr }</div>
                            <div className="text-sm text-gray-500 dark:text-gray-300">
                                { projects.isActive ? (
                                    <span className="text-green-500">Active</span>
                                ) : (
                                    <span className="text-red-500">Inactive</span>
                                ) } |
                                Slug:<span> { projects.slug } </span> |
                                description:<span> { projects.description }</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={ () => handleEdit(projects) }
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={ () => handleDelete(projects._id) }
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
        <div className="p-6 max-w-6xl mx-auto dark:text-white">
            {/* <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Projects Management</h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        aria-label="Toggle dark mode"
                    >
                        {theme === 'dark' ? '🌞' : '🌙'}
                    </button>
                    <button
                        onClick={ handleAddNew }
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Add New Projects
                    </button>
                </div>
            </div> */}

            {/* Success message */ }
            { successMessage && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                    { successMessage }
                </div>
            ) }

            {/* Error message */ }
            { error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
                    { error }
                </div>
            ) }

            {/* projects form */ }
            { showForm &&
                (
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold dark:text-white">
                                { editingService ? 'Edit Projects' : 'Add New Projects' }
                            </h2>
                            <Tooltip content='Cancel'>
                                <button
                                    onClick={ () => setShowForm(false) }
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
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
                                        name="title"
                                        value={ formData.title }
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
                                        name="titleAr"
                                        value={ formData.titleAr }
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
                                    <label className="block mb-1 font-medium dark:text-white">Projects Image</label>
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
                                                    alt="Projects image preview"
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
                                    <label htmlFor="isActive" className="font-medium dark:text-white">
                                        Active (visible to users)
                                    </label>
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
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
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
                                            ? 'Update Projects'
                                            : 'Create Projects' }
                                </button>
                            </div>
                        </form>
                    </div>
                )
            }

            {/* projects list */ }
            { loading && !showForm ? (
                <div>Loading projects…</div>
            ) : (
                <div>{ projects.map(cat => renderprojects(cat)) }</div>
            ) }
        </div>
    );
}
