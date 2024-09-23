"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import PatientLayout from '@/components/PatientLayout';

interface Order {
  order_id: number;
  order_status: string;
  order_date: string;
  order_total_amount: number;
  patient: {
    p_name: string;
  };
  pharmacy: {
    pharma_name: string;
  };
}

interface OrderItem {
  medicines: {
    medicine_name: string;
  };
  unit_price: number;
  ordered_quantity: number;
}

const Orders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]); // Typed as array of Order objects
  const [orderItems, setOrderItems] = useState<Record<number, OrderItem[]>>({}); // Stores order items by order ID
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({}); // Tracks expanded/collapsed state of orders

  useEffect(() => {
    (async () => {
      try {
        const orderDetails = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/porder/history`, { withCredentials: true });
        setOrders(orderDetails.data);
      } catch (error) {
        console.log("Error fetching orders.");
      }
    })();
  }, []);

  const fetchItems = async (id: number) => {
    if (expandedOrders[id]) {
      setExpandedOrders((prev) => ({ ...prev, [id]: false }));
    } else {
      try {
        const oitem = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/porder/orderdetails/${id}`,{withCredentials: true});
        setOrderItems((prevItems) => ({
          ...prevItems,
          [id]: oitem.data,
        }));
        setExpandedOrders((prev) => ({ ...prev, [id]: true }));
      } catch (error) {
        console.log("Error fetching order details.");
      }
    }
  };

  return (
    <PatientLayout>
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Orders List</h2>
        <div>
          {orders.length === 0 ? (
            <p className="text-gray-800">No Orders...</p>
          ) : (
            <div>
              {orders.map((order) => (
                <div key={order.order_id} className="mb-4">
                  <h3 className="text-xl font-semibold text-indigo-700">Status: {order.order_status}</h3>
                  <p>Order Date: {order.order_date}</p>
                  <p>Total Amount: {order.order_total_amount}</p>
                  <p>Patient Name: {order.patient?.p_name || 'User'}</p>
                  <p>Ordered Pharmacy: {order.pharmacy.pharma_name}</p>
                  <br />
                  <div>
                    {expandedOrders[order.order_id] && orderItems[order.order_id] && (
                      <div>
                        <h3 className="text-xl font-semibold text-green-600">Details of Order</h3>
                        <table className="min-w-full bg-white">
                          <thead>
                            <tr>
                              <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Medicine Name</th>
                              <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Unit Price</th>
                              <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Quantity Ordered</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderItems[order.order_id]?.map((oitem, index) => (
                              <tr key={index}>
                                <td className="py-2 px-4 border-b border-gray-200">{oitem.medicines.medicine_name}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{oitem.unit_price}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{oitem.ordered_quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="group relative flex justify-center py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 my-3"
                    onClick={() => { fetchItems(order.order_id) }}
                  >
                    {expandedOrders[order.order_id] ? 'Hide' : 'Details'}
                  </button>
                  <hr />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </PatientLayout>
  );
};

export default Orders;