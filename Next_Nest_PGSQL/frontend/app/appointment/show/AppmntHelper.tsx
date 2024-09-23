"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Appointment {
  appointment_status: string;
  appointment_date: string;
  appointment_time: string;
  patient: {
    p_name: string;
  };
  doctor: {
    d_name: string;
  };
}

interface AppmntHelperProps {
  dName: string; // Type the prop `dName` as a string
}

const AppmntHelper: React.FC<AppmntHelperProps> = ({ dName }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]); // State is typed as an array of `Appointment`

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (dName === '') {
          const showAll = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/appoint/show`, { withCredentials: true });
          setAppointments(showAll.data);
        } else {
          const showSpecific = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/appoint/showbydoct/${dName}`, { withCredentials: true });
          setAppointments(showSpecific.data);
        }
      } catch (error) {
        console.log("Error fetching appointments.");
      }
    };

    fetchAppointments();
  }, [dName]); // `useEffect` dependency array watches for changes in `dName`

  return (
    <div>
      {appointments.length === 0 ? ( // Conditional rendering using ternary operator
        <p className="text-gray-800">No Appointments...</p>
      ) : (
        <div>
          {appointments.map((appoint, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold text-indigo-700">Status: {appoint.appointment_status}</h3>
              <p>Scheduled: {appoint.appointment_date} at {appoint.appointment_time}</p>
              <p>Patient Name: {appoint.patient?.p_name || 'User'}</p>
              <p>Doctor Name: {appoint.doctor.d_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppmntHelper;