// app/home/page.tsx
import HomeClient from "./home-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rent-A-Thing",
    description: "Welcome to Rent-A-Thing",
};

export default function HomePage() {
    return <HomeClient />;
}
