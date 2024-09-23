"use client"
import React, { useState } from 'react';
import AppmntHelper from './AppmntHelper';
import PatientLayout from '@/components/PatientLayout';

const AppointmentDetails = () => {
  let [DocName, setDocName] = useState('');

  return (
    <PatientLayout>
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Appointment List</h2>
            <input
            id='docname'
            name='docname'
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-t-md focus:outline-none focus:ring-indigo-700 focus:border-indigo-700 focus:z-10 sm:text-sm"
            type="text"
            required
            placeholder="Type doctor name"
            value={DocName}
            onChange={(e) => setDocName(e.target.value)}
            />
        <br />
        <AppmntHelper dName={DocName} />
      </div>
    </div>
    </PatientLayout>
  );
};

export default AppointmentDetails;
