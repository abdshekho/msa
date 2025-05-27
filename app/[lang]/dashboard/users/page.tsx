'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaUser, FaEdit, FaTrash, FaTimes, FaUserPlus } from 'react-icons/fa';
import { Avatar, Tooltip } from 'flowbite-react';
import Image from 'next/image';
import profileImage from "@/public/en/profile.webp"

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  image: string;
  // status: 'active' | 'inactive';
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [image, setImage] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    image: '',
    role: 'User',
    // status: 'active',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError('Error loading users');
      setLoading(false);
      console.error(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const openAddModal = () => {
    setCurrentUser(null);
    setFormData({
      name: '',
      email: '',
      image: '',
      role: 'User',
      username: '',
      // status: 'active',
      password: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      image: user?.image,
      username: user.username,
      // status: user.status,
      password: ''
    });
    setIsModalOpen(true);
  };
  // For cover image
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Create a FormData object
      const formDataImage = new FormData();
      formDataImage.append('image', file);
      formDataImage.append('type', 'porfiles');

      try {
        setIsLoading(true);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataImage,
        });

        if (!response.ok) throw new Error('Image upload failed');

        const data = await response.json();

        setImage(data?.imageUrl);
      } catch (error: any) {
        console.error('Error uploading image:', error);
        setError(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (currentUser) {
        // Edit existing user
        const response = await fetch('/api/users', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _id: currentUser._id,
            ...formData,
            image,
            // Don't send password if it's empty
            ...(formData.password ? {} : { password: undefined })
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update user');
        }
        setImage('');
      } else {
        // Add new user
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...formData,image}),
        });

        if (!response.ok) {
          throw new Error('Failed to create user');
        }
      }

      // Refresh user list
      fetchUsers();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving user:', err);
      alert('Failed to save user. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-primary">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-red-500">{ error }</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="head-1">Users Management</h1>
        <button onClick={ openAddModal } className="flex items-center gap-2 text-white  bg-green-600 dark:bg-green-700 px-4 py-3  rounded-lg">
          <FaUserPlus className="text-sm" />
          <span>Add New User</span>
        </button>
      </div>

      <div className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                {/* <th className="px-6 py-3">Status</th> */ }
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              { users.map((user) => (
                <tr key={ user._id } className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4">
                    <Avatar
                      alt={ "User" }
                      img={ user?.image || "/profile.webp" }
                      rounded
                      className="flex justify-start"
                    />
                    {/* { user.image } */ }
                  </td>
                  <td className="px-6 py-4 font-medium">{ user.name }</td>
                  <td className="px-6 py-4">{ user.email }</td>
                  <td className="px-6 py-4">{ user.role }</td>
                  {/* <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {user.status}
                    </span>
                  </td> */}
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={ () => openEditModal(user) }
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              )) }
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */ }
      { isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                { currentUser ? 'Edit User' : 'Add New User' }
              </h2>
              <button
                onClick={ () => setIsModalOpen(false) }
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={ handleSubmit }>
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24 overflow-hidden">
                  <Image
                    src={ image ? image :  (formData.image ? formData.image : profileImage) }
                    alt="صورة المستخدم"
                    width={ 96 }
                    height={ 96 }
                    className="rounded-full object-cover"
                  />
                </div>
                <Tooltip content={ image ? "Edit profile image" : "Add profile image" }>
                  <label className="cursor-pointer" htmlFor="profile-image"><FaEdit /></label>
                </Tooltip>
              </div>
              <div className='hidden'>
                <label className="block mb-2 font-medium" htmlFor="profile-image">صورة الملف الشخصي</label>
                <input
                  type="file"
                  name="image"
                  id="profile-image"
                  onChange={ handleFileChange }
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={ formData.name }
                  onChange={ handleInputChange }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={ formData.email }
                  onChange={ handleInputChange }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="username"
                  name="username"
                  value={ formData.username }
                  onChange={ handleInputChange }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password { currentUser && '(leave blank to keep current)' }
                </label>
                <input
                  type="password"
                  name="password"
                  value={ formData.password }
                  onChange={ handleInputChange }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required={ !currentUser }
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={ formData.role }
                  onChange={ handleInputChange }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="User">User</option>
                  {/* <option value="Editor">Editor</option> */ }
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={ formData.status }
                  onChange={ handleInputChange }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div> */}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={ () => setIsModalOpen(false) }
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="fButton"
                >
                  { isLoading ? 'loadding' : (currentUser ? 'Update User' : 'Add User') }

                </button>
              </div>
            </form>
          </div>
        </div>
      ) }
    </div>
  );
}