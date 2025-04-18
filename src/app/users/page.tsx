"use client"

import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/api/user";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No access token found");
            setLoading(false);
            return;
        }

        getAllUsers(token)
            .then(setUsers)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <DefaultLayout>
            <h1 className="mb-6 text-2xl font-semibold">Users</h1>

            {loading && <p>Loading users...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border border-gray-200 text-left text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">First Name</th>
                                <th className="p-3">Last Name</th>
                                <th className="p-3">Username</th>
                                <th className="p-3">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.userId} className="border-b hover:bg-gray-50">
                                    <td className="p-3">
                                        <Link href={`/profile/${user.userId}`} className="text-blue-600 hover:underline">
                                            {user.firstName}
                                        </Link>
                                    </td>
                                    <td className="p-3">{user.lastName}</td>
                                    <td className="p-3">{user.username}</td>
                                    <td className="p-3">{user.email}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}
        </DefaultLayout>
    )

}

