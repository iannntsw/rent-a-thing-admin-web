"use client";

import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeClient() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/signin");
        }
    }, [router]);

    return (
        <DefaultLayout>
            <ECommerce />
        </DefaultLayout>
    );
}
