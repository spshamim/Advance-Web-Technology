"use client"
import Titlebar from "../../../components/titlebar";
import axios from "axios";
import React, { useEffect, useState } from "react";

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

export default function ApiTest() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const backres = await axios.get('http://localhost:4000/med/show-all');
        setMedicines(backres.data);
      } catch (error: any) {
        console.error('Error fetching medicines:', error.response.data.message);
      }
    })();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <Titlebar title="Client Side Rendering" />
      <h1 className="text-4xl text-red-600 font-bold text-center">This is API Testing Page</h1><br /><hr /><br />

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Medicine List</h2>
        {medicines.length === 0 ? (
          <p className="text-gray-700">Loading medicines...</p>
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
      {/* <button type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ml-10 mt-3"
        onClick={data}
        >Click me!</button> */}
    </div>
  );
}