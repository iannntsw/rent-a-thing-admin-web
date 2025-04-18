import { authHeaders } from "../utils";

export async function getUserById(userId: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/users/getUser/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders(),

            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch user profile");
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}

export async function updateUserProfile(
    userId: string,
    data: {
        firstName?: string;
        lastName?: string;
        username?: string;
        email?: string;
        profilePicture?: string;
        phoneNumber?: string;
    }
) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/users/updateUser/${userId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders(),
            },
            body: JSON.stringify(data),
        }
    );

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update user profile");
    }

    return await res.json();
}


export async function getAllUsers(token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/users/getUsers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch users");
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export async function toggleActiveStatus(email: string, isActive: boolean) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/users/toggleActivation/${email}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders(),
            },
            body: JSON.stringify({ isActive }),
        }
    );

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to toggle active status");
    }

    return await res.json();
}
