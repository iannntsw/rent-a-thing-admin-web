"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserById, toggleActiveStatus, updateUserProfile } from "@/lib/api/user";
import { formatDateString } from "@/lib/utils";
import Swal from "sweetalert2";
import { deleteBooking, getAllBookings } from "@/lib/api/booking";

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

// export const metadata: Metadata = {
//   title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };

const Profile = ({
  params,
}: {
  params: { userId: string };
}) => {
  const { userId } = params;
  console.log("userId", userId);
  const [user, setUser] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    profilePicture: "",
    phoneNumber: "",
    userType: "",
  });
  const [previewImage, setPreviewImage] = useState<string>("");
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  const loggedInUserId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId) {
          const userData = await getUserById(userId);
          setUser(userData);
          console.log("userData", userData);
          setEditForm({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            username: userData.username || "",
            email: userData.email || "",
            profilePicture: userData.profilePicture || "",
            phoneNumber: userData.phoneNumber || "",
            userType: userData.userType || "",
          });
          setBookings(userData.bookings || []);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSave = async () => {
    try {
      await updateUserProfile(userId, editForm);
      setShowEditDialog(false);
      const updated = await getUserById(userId);
      setUser(updated);

      await Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been successfully updated.",
      });
    } catch (err: any) {
      console.error("Failed to update profile", err);
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          err?.message ||
          "Error updating profile. Please check for duplicate email, username, or phone number.",
      });
    };
  }

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

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  if (!user) return <div className="p-6">Loading profile...</div>;


  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {userId !== loggedInUserId ? "User Profile" : "My Profile"}
        </h2>

        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="relative z-20 h-20 md:h-10">

            <div className="absolute top-1 right-1 z-10 xsm:top-4 xsm:right-4">

              <button
                onClick={() => setShowEditDialog(true)}
                className="rounded bg-[#2C3725] px-4 py-2 text-white hover:bg-[#1f251a]"
              >
                Edit Profile
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center px-4 pb-6 lg:pb-8 xl:pb-11.5">
            <div className="mb-6 flex items-center gap-4"></div>

            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <Image
                  src={user.profilePicture || "/images/default-profile.png"}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border object-cover"
                  width={96}
                  height={96}
                  unoptimized
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">@{user.username}</p>
              </div>
              <p>
                <strong>User Type:</strong> {user.userType}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phoneNumber}
              </p>
              {/* <p>
                <strong>Joined:</strong>{" "}
                {formatDateString(new Date(user.createdAt).toISOString())}
              </p> */}
            </div>

            {userId !== loggedInUserId && (
              <div className="flex flex-col items-center gap-2 py-4">
                <p><strong>Current Status:{" "}</strong>
                  <span
                    className={`font-semibold ${user.isActive ? "text-green-600" : "text-red-500"
                      }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </p>

                <button
                  className={`rounded px-4 py-2 text-sm font-medium text-white ${user.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
                    }`}
                  onClick={async () => {
                    try {
                      const updated = await toggleActiveStatus(user.email, !user.isActive);
                      setUser((prev: any) => ({
                        ...prev,
                        isActive: updated.isActive,
                      }));

                      await Swal.fire({
                        icon: "success",
                        title: `User ${updated.isActive ? "activated" : "deactivated"
                          } successfully`,
                      });
                    } catch (err: any) {
                      console.error(err);
                      await Swal.fire({
                        icon: "error",
                        title: "Action Failed",
                        text: err?.message || "Could not change user activation status.",
                      });
                    }
                  }}
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            )}


          </div>


        </div>
        {user.userType === "CUSTOMER" && (
          <div className="mt-10 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Listings</h2>

            {user.listings?.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {user.listings.map((listing: any) => (
                  <Link
                    key={listing.listingId}
                    href={`/products/${listing.listingId}`}
                    className="rounded-lg border border-stroke bg-white p-4 shadow-sm transition hover:shadow-md dark:border-strokedark dark:bg-boxdark"
                  >
                    <Image
                      src={(() => {
                        try {
                          const parsed = JSON.parse(listing.images || "[]");
                          return parsed?.[0] || "/images/default-product.png";
                        } catch {
                          return "/images/default-product.png";
                        }
                      })()}
                      alt={listing.title}
                      width={300}
                      height={160}
                      className="mb-3 h-40 w-full rounded-md object-cover"
                      unoptimized
                    />
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ${listing.pricePerDay}/day
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                This customer does not have any listings.
              </p>
            )}

            {/* {bookings?.length > 0 ? (
              <div className="mt-10">
                <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border border-gray-200 text-left text-sm dark:border-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-800">
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
                      {bookings.map((b: any) => (
                        <tr key={b.bookingId} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900">
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
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Bookings</h2>
                <p className="text-gray-600 dark:text-gray-400">This customer does not have any bookings.</p>
              </div>
            )} */}

            {/* {showModal && (
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
            )} */}

          </div>
        )}

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Edit Your Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {previewImage && (
                <Image
                  src={previewImage}
                  alt="Profile Preview"
                  className="mx-auto mb-2 h-24 w-24 rounded-full border object-cover"
                  width={80}
                  height={80}
                  unoptimized
                />
              )}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const base64 = await toBase64(file);
                      setEditForm((prev) => ({
                        ...prev,
                        profilePicture: base64,
                      }));
                      setPreviewImage(base64);
                    }
                  }}
                  className="w-full rounded border p-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, firstName: e.target.value })
                  }
                  className="w-full rounded border p-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lastName: e.target.value })
                  }
                  className="w-full rounded border p-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  className="w-full rounded border p-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full rounded border p-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editForm.phoneNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phoneNumber: e.target.value })
                  }
                  className="w-full rounded border p-2"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="rounded border px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded bg-[#2C3725] px-4 py-2 text-white hover:bg-[#1f251a]"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
