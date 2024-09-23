"use client";
import { useRouter } from 'next/navigation';
import React from 'react';

const PatientLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col p-4 sticky top-0 h-screen">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
            onClick={() => router.push('/patient/info')}
          >
            Dashboard
          </button>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
            onClick={() => router.push('/patient/profile')}
          >
            Profile
          </button>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
            onClick={() => router.push('/appointment/show')}
          >
            Appointment Details
          </button>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
            onClick={() => router.push('/orders')}
          >
            Orders
          </button>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
            onClick={() => router.push('/appointment/book')}
          >
            Book Appointment
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            onClick={() => router.push('/auth/logout')}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-grow bg-gray-200 p-6">{children}</div>
    </div>
  );
};

export default PatientLayout;