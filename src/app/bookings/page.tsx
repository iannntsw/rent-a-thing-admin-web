"use client";

import { useEffect, useState } from "react";
import { getAllBookings } from "@/lib/api/booking";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface Booking {
  bookingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  rentee: {
    email: string;
  };
  listing: {
    title: string;
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // Assuming you saved it after login
    if (!token) {
      setError("No access token found");
      setLoading(false);
      return;
    }
  
    getAllBookings(token)
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  

  return (
    <DefaultLayout>
      <h1 className="mb-6 text-2xl font-semibold">Bookings</h1>

      {loading && <p>Loading bookings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200 text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Booking ID</th>
                <th className="p-3">Rentee</th>
                <th className="p-3">Listing</th>
                <th className="p-3">Start</th>
                <th className="p-3">End</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.bookingId} className="border-b hover:bg-gray-50">
                  <td className="p-3">{b.bookingId}</td>
                  <td className="p-3">{b.rentee?.email || "-"}</td>
                  <td className="p-3">{b.listing?.title || "-"}</td>
                  <td className="p-3">{new Date(b.startDate).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(b.endDate).toLocaleDateString()}</td>
                  <td className="p-3">${b.totalPrice}</td>
                  <td className="p-3">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DefaultLayout>
  );
}
