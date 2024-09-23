"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import PatientLayout from '@/components/PatientLayout';
import axios from 'axios';

interface Patient {
  p_name: string;
  p_email: string;
  p_phone: string;
  p_dob: string;
  p_gender: string;
  p_address: string;
  p_medical_history: string;
  p_image_name?: string;
}

const PatientDashboard = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const pData = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/profile/show`, {
          withCredentials: true
        });
        setPatient(pData.data);
      } catch (error) {
        console.error("Error ::", error);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchPatientData();
  }, []);
  
  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const imageSrc = patient?.p_image_name
    ? `/${patient.p_image_name}`
    : '/default.png';

  return (
    <PatientLayout>
      <h1 className="flex text-2xl font-bold mb-6 justify-center">Welcome , {(patient?.p_name) ? (patient?.p_name): ('User')} !</h1>

      {patient && (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Image */}
          <div className="flex items-center justify-center w-full h-48 mt-4">
            <div className="relative w-full h-full">
              <Image
                src={imageSrc}
                alt={`${patient.p_name}'s Profile Picture`}
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">{patient.p_name}</h2>
            <p className="text-gray-600 mb-2">Email: {patient.p_email}</p>
            <p className="text-gray-600 mb-2">Phone: {patient.p_phone}</p>
            <p className="text-gray-600 mb-2">Date of Birth: {patient.p_dob}</p>
            <p className="text-gray-600 mb-2">Gender: {patient.p_gender}</p>
            <p className="text-gray-600 mb-2">Address: {patient.p_address}</p>
            <p className="text-gray-600">Medical History: {patient.p_medical_history}</p>
          </div>
        </div>
      )}
    </PatientLayout>
  );
};

export default PatientDashboard;