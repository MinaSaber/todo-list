import React, { useEffect, useState } from "react";
import { getUserInfo, updateUser } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/auth-context";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SettingsPage = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });
  const [loading, setLoading] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateUser(user.id, formData);
    } catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      return;
    } finally {
      setEditMode(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });
    setEditMode(false);
  };

  const getUser = async () => {
    try {
      const { data } = await getUserInfo(user.id);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
      setLoading(false);
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Settings</h2>

        {/* User Info Display */}
        {!editMode ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium text-gray-700">Name</h3>
              {loading ? (
                <Skeleton width={150} height={20} />
              ) : (
                <p className="text-gray-500">{formData.name}</p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium text-gray-700">Email</h3>
              {loading ? (
                <Skeleton width={150} height={20} />
              ) : (
                <p className="text-gray-500">{formData.email}</p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium text-gray-700">Phone</h3>
              {loading ? (
                <Skeleton width={150} height={20} />
              ) : (
                <p className="text-gray-500">{formData.phone}</p>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setEditMode(true)}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
              >
                Edit Info
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default SettingsPage;
