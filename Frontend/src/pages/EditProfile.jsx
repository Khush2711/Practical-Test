import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const EditProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName);
      setValue('lastName', user.lastName);
      setValue('email', user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.put('/user/update', data);
      if (response.data.success) {
        toast.success(response.data.message || "Profile updated");
        setUser(response.data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    setIsUploading(true);
    try {
      const response = await api.post('/user/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        toast.success("Profile picture updated");
        setUser({ ...user, profilePicture: response.data.profilePicture });
        setSelectedFile(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePicture = async () => {
    try {
      const response = await api.delete('/user/remove-profile-picture');
      if (response.data.success) {
        toast.success("Profile picture removed");
        setUser({ ...user, profilePicture: null });
      }
    } catch (error) {
      toast.error('Failed to remove picture');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Update your personal information and profile picture.</p>
        </div>
        
        {/* Profile Picture Section */}
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {user?.profilePicture ? (
                <img
                  className="h-24 w-24 rounded-full object-cover border border-gray-300"
                  src={`${import.meta.env.VITE_API_BASE_URL}/${user.profilePicture}`}
                  alt="Profile"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-3xl border border-gray-300">
                  {user?.firstName?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              {user?.profilePicture && (
                <button
                  type="button"
                  onClick={handleRemovePicture}
                  className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Remove current picture
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info Form Section */}
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">First name</label>
                <input
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Last name</label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
              </div>

              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
