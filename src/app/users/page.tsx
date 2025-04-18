"use client";

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
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No access token found");
            setLoading(false);
            return;
        }

        getAllUsers(token)
            .then((fetchedUsers) => {
                const customersOnly = fetchedUsers.filter(
                    (user: any) => user.userType === "CUSTOMER"
                );
                setUsers(customersOnly);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);


    const filteredUsers = users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email.toLowerCase();
        return (
            fullName.includes(searchQuery.toLowerCase()) ||
            email.includes(searchQuery.toLowerCase())
        );
    });

    return (
        <DefaultLayout>
            <h1 className="mb-6 text-2xl font-semibold">Users</h1>

            <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4 w-full p-2 border border-gray-300 rounded"
            />

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
                            {filteredUsers.map((user) => (
                                <tr key={user.userId} className="border-b hover:bg-gray-50">
                                    <td className="p-3">
                                        <Link
                                            href={`/profile/${user.userId}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {user.firstName}
                                        </Link>
                                    </td>
                                    <td className="p-3">{user.lastName}</td>
                                    <td className="p-3">{user.username}</td>
                                    <td className="p-3">{user.email}</td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-6 text-center text-gray-500">
                                        No users match your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </DefaultLayout>
    );
}
