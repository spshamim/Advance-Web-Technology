"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useForm } from "react-hook-form";

const Forgotpass = () => {
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    } = useForm();  

  const formSub = async (data:any) => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/auth/reset-request`, {
        email: data.email,
      });

      if (response.status === 201) {
        setNotification(response.data.message);
        setNotificationType('success');
      }
    } catch (error:any) {
      console.error('Request error:', error.response?.data?.message);
      setNotification(error.response?.data?.message || 'An error occurred');
      setNotificationType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Password Reset Request</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(formSub)}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-z0-9]+(\.[a-z0-9]+)*@[a-z0-9]+(\.[a-z]+)+$/,
                      message: "Email must be in lowercase, contain '@', and must not have special characters or spaces, except dots."
                    }
                })}
                type="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Type email"
              />
            {errors.email && typeof errors.email.message === "string" && (
            <span className="text-red-700 text-sm font-bold">{errors.email.message}</span>)}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button><br></br>
            <button
              type="button"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => router.push("/auth/login")}
            >
              Back
            </button>
          </div>
        </form>
        {isLoading && (
          <div
            className="alert bg-yellow-100 border-yellow-500 text-yellow-700 border-l-4 p-4 mt-4"
            role="alert"
          >
            <p>Checking...</p>
          </div>
        )}
        {!isLoading && notification && (
          <div
            className={`alert ${notificationType === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'} border-l-4 p-4 mt-4`}
            role="alert"
          >
            <p>{notification}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forgotpass;
