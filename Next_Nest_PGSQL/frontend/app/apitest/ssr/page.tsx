"use server"
import Titlebar from "../../../components/titlebar";
import axios from "axios";
import React from "react";

interface Medicine {
  Med_name: string;
  medicines: {
    medicine_price: number;
    medicine_stock: number;
  };
  pharmacies: {
    pharma_name: string;
  };
}

export default async function ApiTest() {
  let medicines: Medicine[] = [];

  try {
    const response = await axios.get('http://localhost:4000/med/show-all');
    medicines = response.data;
  } catch (error: any) {
    console.error('Error fetching medicines:', error.response?.data?.message || error.message);
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <Titlebar title="Server Side Rendering" />
      <h1 className="text-4xl text-red-600 font-bold text-center">This is API Testing Page</h1><br /><hr /><br />

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Medicine List</h2>
        {medicines.length === 0 ? (
          <p className="text-gray-700">No medicines found.</p>
        ) : (
          <div>
            {medicines.map((medicine, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-semibold">{medicine.Med_name}</h3>
                <p>Price: {medicine.medicines.medicine_price} BDT</p>
                <p>Stock: {medicine.medicines.medicine_stock}</p>
                <p>Pharmacy: {medicine.pharmacies.pharma_name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}