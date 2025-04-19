// app/home/page.tsx
import HomeClient from "./home-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "RentAThing",
    description: "Welcome to RentAThing",
};

export default function HomePage() {
    return <HomeClient />;
}
