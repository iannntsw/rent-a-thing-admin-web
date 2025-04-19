"use client";

import { useEffect, useState } from "react";
import { deleteBooking, getAllBookings } from "@/lib/api/booking";
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
  const [showModal, setShowModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No access token found");
      setLoading(false);
      return;
    }

    const data = getAllBookings(token);
    console.log("data", data);

    getAllBookings(token)
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (bookingId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Missing token");
      return;
    }

    try {
      await deleteBooking(bookingId, token);
      setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
    } catch (err: any) {
      setError(err.message || "Failed to delete booking");
    }
  };

  const openDeleteModal = (bookingId: string) => {
    setBookingToDelete(bookingId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (bookingToDelete) {
      await handleDelete(bookingToDelete);
      setShowModal(false);
      setBookingToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setBookingToDelete(null);
  };

  const filteredBookings = bookings.filter((booking) => {
    const query = searchQuery.toLowerCase();
    return (
      booking.bookingId.toLowerCase().includes(query) ||
      booking.rentee?.email.toLowerCase().includes(query)
    );
  });


  return (
    <DefaultLayout>
      <h1 className="mb-6 text-2xl font-semibold">Bookings</h1>

      <input
        type="text"
        placeholder="Search by Booking ID or User Email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      />

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
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.bookingId} className="border-b hover:bg-gray-50">
                  <td className="p-3">{b.bookingId}</td>
                  <td className="p-3">{b.rentee?.email || "-"}</td>
                  <td className="p-3">{b.listing?.title || "-"}</td>
                  <td className="p-3">{new Date(b.startDate).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(b.endDate).toLocaleDateString()}</td>
                  <td className="p-3">${b.totalPrice}</td>
                  <td className="p-3">{b.status}</td>
                  <td className="p-3">
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => openDeleteModal(b.bookingId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-500">
                    No bookings match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
