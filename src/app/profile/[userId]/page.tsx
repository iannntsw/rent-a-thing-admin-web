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
import { getUserById, updateUserProfile } from "@/lib/api/user";
import { formatDateString } from "@/lib/utils";
import Swal from "sweetalert2";


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
  });
  const [previewImage, setPreviewImage] = useState<string>("");

  const loggedInUserId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId) {
          const userData = await getUserById(userId);
          setUser(userData);
          setEditForm({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            username: userData.username || "",
            email: userData.email || "",
            profilePicture: userData.profilePicture || "",
            phoneNumber: userData.phoneNumber || "",
          });
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
        <Breadcrumb pageName="Profile" />

        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="relative z-20 h-20 md:h-30">

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
          </div>


        </div>
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
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
