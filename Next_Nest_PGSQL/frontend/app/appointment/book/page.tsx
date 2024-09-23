"use client"
import PatientLayout from '@/components/PatientLayout';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

const AppointmentBook = () => {
  const [speciality, setSpeciality] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (speciality) {
      const fetchDoctors = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/doctor/viewbyspec`, {
            params: { spec: speciality },
            withCredentials: true,
          });
          setDoctors(response.data);
        } catch (error) {
          console.error("Error : ", error);
        }
      };
      fetchDoctors();
    } else {
      setDoctors([]);
    }
  }, [speciality]);

  const handleBookAppointment = async () => {
    if (!selectedDoctorId || !appointmentDate || !appointmentTime) {
      toast({
        variant: "logout",  
        title: "Please select a doctor, date, and time.",
      });
      return;
    }

    setLoading(true);
    try {
      const sendData = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/appoint/book`,
        {
          doctor_id: selectedDoctorId,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime
        },
        {
          withCredentials: true,
        }
      );

      if(sendData.status === 201) {
        toast({
          variant: "success",  
          title: "Appointment Booked Successfully.",
        });
      }else{
        toast({
          variant: "destructive",  
          title: "An error occured.",
          description: "Invalid request.",
        });
      }

    } catch (error) {
      console.error("Error booking appointment :: ", error);
      toast({
        variant: "destructive",  
        title: "Validation error.",
        description: "Input data in correct format.",
      });
    }finally {
      setLoading(false);
      router.push("/appointment/show");
    }
  };

  return (
    <PatientLayout>
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>

        <div className="mb-4">
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Search by Speciality"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
          />
        </div>

        {doctors.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Select a Doctor</h3>
            <ul>
            {doctors.map((doctor:any) => (
            <li
              key={doctor.d_id}
              className={`p-2 cursor-pointer ${selectedDoctorId === doctor.d_id ? 'bg-blue-200' : ''}`}
              onClick={() => setSelectedDoctorId(doctor.d_id)}
            >
              {doctor.d_name} - {doctor.d_specialize}
            </li>
          ))}
            </ul>
          </div>
        )}
        
        {selectedDoctorId && (
          <div className="mb-4">
            <input
              type="date"
              className="border p-2 w-full mb-2 cursor-pointer"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
            <input
              type="time"
              className="border p-2 w-full mb-2 cursor-pointer"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            />
          </div>
        )}

          <button
            className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded ${loading || !selectedDoctorId || !appointmentDate || !appointmentTime ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleBookAppointment}
            disabled={loading || !selectedDoctorId || !appointmentDate || !appointmentTime}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 118 8"></path>
                </svg>
                Loading...
              </span>
            ) : (
              "Book Appointment"
            )}
          </button>
        <br />
      </div>
    </div>
    </PatientLayout>
  );
};

export default AppointmentBook;