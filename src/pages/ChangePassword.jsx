import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const ChangePassword = () => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.put('/user/update-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      if (response.data.success) {
        toast.success(response.data.message || "Password updated successfully");
        reset();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Update your account password.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                {...register('currentPassword', { required: 'Current password is required' })}
                className={`mt-1 block w-full px-3 py-2 border ${errors.currentPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                {...register('newPassword', { 
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' }
                })}
                className={`mt-1 block w-full px-3 py-2 border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                {...register('confirmPassword', { 
                  required: 'Please confirm your new password',
                  validate: value => value === newPassword || 'The passwords do not match'
                })}
                className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
